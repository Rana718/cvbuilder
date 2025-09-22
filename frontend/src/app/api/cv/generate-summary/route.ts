import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
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

interface Experience {
    title?: string
    company?: string
    startDate?: string
    endDate?: string
    duration?: string
}

interface CVData {
    skills?: string[]
    experience?: Experience[]
}

function parseMonthsSimple(start?: string, end?: string): number | null {
    if (!start || !end) return null

    const parseDate = (dateStr: string): Date | null => {
        const str = dateStr.trim()
        if (!str) return null
        if (str.toLowerCase() === 'present' || str.toLowerCase() === 'now' || str.toLowerCase() === 'current') {
            return new Date()
        }

        // Try different formats
        const formats = [
            /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
            /^\d{4}-\d{2}$/, // YYYY-MM
            /^\d{4}$/ // YYYY
        ]

        for (const format of formats) {
            if (format.test(str)) {
                const date = new Date(str)
                if (!isNaN(date.getTime())) {
                    return date
                }
            }
        }
        return null
    }

    const startDate = parseDate(start)
    const endDate = parseDate(end)

    if (!startDate || !endDate) return null

    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth())

    return Math.max(0, months)
}

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
        const { cvData, seniorityOverride }: { cvData: CVData, seniorityOverride?: string } = await req.json()

        const skillsText = cvData.skills?.slice(0, 8).join(', ') || ''
        const workExpText = cvData.experience?.map(exp =>
            `${exp.title || ''} at ${exp.company || ''} (${exp.duration || exp.startDate + ' - ' + exp.endDate || ''})`
        ).join(' ') || ''

        let overallSeniority: string

        if (seniorityOverride) {
            overallSeniority = seniorityOverride
        } else if (!cvData.experience || cvData.experience.length === 0) {
            overallSeniority = 'junior'
        } else {
            // Check for leadership titles first
            const hasLeadershipRole = cvData.experience.some(exp => {
                const title = (exp.title || '').toLowerCase()
                return title.includes('founder') || title.includes('co-founder') || title.includes('cofounder') ||
                       title.includes('ceo') || title.includes('cto') || title.includes('director') ||
                       title.includes('head of') || title.includes('lead') || title.includes('senior') ||
                       title.includes('principal') || title.includes('manager') || title.includes('vp') ||
                       title.includes('vice president')
            })

            if (hasLeadershipRole) {
                overallSeniority = 'senior'
            } else if (cvData.experience.some(exp =>
                (exp.title || '').toLowerCase().includes('intern') ||
                (exp.company || '').toLowerCase().includes('intern')
            )) {
                overallSeniority = 'intern'
            } else {
                let totalMonths = 0
                let count = 0

                for (const exp of cvData.experience) {
                    const months = parseMonthsSimple(exp.startDate, exp.endDate)
                    if (months !== null) {
                        totalMonths += months
                        count += 1
                    }
                }

                const avg = count > 0 ? totalMonths / count : 0
                overallSeniority = avg >= 24 ? 'senior' : (avg >= 3 ? 'junior' : 'junior')
            }
        }

        const prompt = `
Create 2-4 professional summary variations (50-90 words each).

Skills: ${skillsText}
Work Experience: ${workExpText}
Overall seniority: ${overallSeniority}

Rules:
- Third person, professional tone.
- Match the tone and scope to the overall seniority level.
- Avoid fabricating major product impact or large % improvements for junior candidates.
- Each summary must be distinct and realistic.
- Return ONLY a JSON array of strings.
`

        const stream = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_tokens: 500,
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
                    const summaries = safeParseJSON(accumulatedContent)

                    // Filter and limit to 4 summaries
                    const filtered = summaries
                        .filter(summary => typeof summary === 'string')
                        .map(summary => summary.trim())
                        .slice(0, 4)

                    // Send the final result
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        summary: filtered,
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
