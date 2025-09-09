import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
})

const SYSTEM_PROMPT = `
You are an AI Resume Builder assistant. Your ONLY job is to produce resume-ready content.
Follow these CORE RULES exactly:

1) OUTPUT FORMAT: Always output a single valid JSON array of plain strings only. No markdown, no code blocks, no explanations, no extra text.
2) HONESTY & SCOPE: Do NOT invent or exaggerate scope, percentages, or metrics. NEVER output highly specific percentage improvements unless the user explicitly provided those exact numbers.
3) SENIORITY ADAPTATION:
   - FRESHER / NO EXPERIENCE: Focus on coursework, projects, tools used, learning, and relevant soft skills.
   - INTERNS / SHORT TENURE (< 3 months): Emphasize learning, small contributions, collaboration, and exposure to tools; use verbs like "assisted", "contributed", "supported".
   - JUNIOR (3-24 months): Emphasize growth, ownership of small features, collaboration, and modest results.
   - SENIOR (24+ months): Emphasize leadership, ownership, and measurable impact (still avoid unrealistic metrics).
4) LENGTH & STYLE:
   - Work bullets: 10-20 words each.
   - Skills: short phrases (1-3 words or short noun phrases).
   - Summaries: 50-90 words, professional, third-person.
5) BLACKLIST & BAD EXAMPLES:
   - Do NOT output: "reduced backend load by 90%", "handled 70% user load", "single-handedly rewrote entire platform".
6) ALWAYS RETURN a JSON array and nothing else.
`

function safeParseJSON(content: string): string[] {
    if (!content) return []

    const cleanContent = content.trim().replace(/^\ufeff/, '')

    try {
        const parsed = JSON.parse(cleanContent)
        if (Array.isArray(parsed)) {
            return parsed.filter(item => typeof item === 'string')
        }
    } catch (e) {
        // Try to extract JSON array from content
        const match = cleanContent.match(/(\[.*\])/)
        if (match) {
            try {
                const parsed = JSON.parse(match[1])
                if (Array.isArray(parsed)) {
                    return parsed.filter(item => typeof item === 'string')
                }
            } catch (e) {
                // Continue to line parsing
            }
        }
    }

    // Parse as lines
    const lines = cleanContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('```'))
        .map(line => line.replace(/^[\-\*\•\d\.\)\s]+/, '').trim())
        .filter(line => line)

    return lines
}

export async function POST(req: NextRequest) {
    try {
        const { workExperience, seniorityOverride } = await req.json()

        const txt = String(workExperience || '').toLowerCase()
        const seniorityHint = txt.includes('intern') || txt.includes('1 mo') || txt.includes('1 month')
            ? 'intern'
            : (seniorityOverride || 'mixed')

        const prompt = `
Based on this work experience, produce 5-15 concise, relevant professional skills.

Work Experience: ${workExperience}
Seniority hint: ${seniorityHint}

Rules:
- Prioritize concrete skills (e.g., "React", "REST APIs", "Unit testing", "SQL").
- For freshers/interns, include tools, frameworks, and learning-focused skills (e.g., "Git", "React basics", "API integration").
- Avoid vague adjectives like 'hardworking' or 'team player' as primary skills.
- Return ONLY a JSON array of strings.
`

        const stream = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_tokens: 250,
            stream: true,
        })

        const encoder = new TextEncoder()
        let accumulatedContent = ''

        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || ''
                        accumulatedContent += content

                        // Send the chunk to client
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content, type: 'chunk' })}\n\n`))
                    }

                    // Parse the final accumulated content
                    const skills = safeParseJSON(accumulatedContent)

                    // Filter out generic soft skills
                    const filtered = skills.filter(skill => {
                        const lower = skill.toLowerCase()
                        return !['communication', 'teamwork', 'hardworking'].includes(lower)
                    })

                    // Send the final result
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        skills: filtered,
                        type: 'complete',
                        success: true
                    })}\n\n`))

                } catch (error) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        error: error instanceof Error ? error.message : 'Unknown error',
                        type: 'error',
                        success: false
                    })}\n\n`))
                } finally {
                    controller.close()
                }
            }
        })

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        })

    } catch (error) {
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
