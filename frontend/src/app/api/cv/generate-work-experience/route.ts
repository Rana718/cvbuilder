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

function inferSeniority(jobTitle: string, role: string, startDate: string, endDate: string, experienceCount: number = 0): string {
    const titleRole = `${jobTitle || ''} ${role || ''}`.toLowerCase()

    if (titleRole.includes('intern') || titleRole.includes('trainee')) {
        return 'intern'
    }

    const months = parseMonthsSimple(startDate, endDate)

    if (months === null) {
        return experienceCount >= 2 ? 'junior' : 'fresher'
    }

    if (months < 3) return 'intern'
    if (months < 24) return 'junior'
    return 'senior'
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
        const match = cleanContent.match(/(\[[\s\S]*\])/)
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
        const { jobTitle, company, location, role, startDate, endDate, experienceCount, seniorityOverride } = await req.json()

        const seniority = seniorityOverride || inferSeniority(jobTitle, role, startDate, endDate, experienceCount)

        let bulletRange: string
        let guidance: string

        switch (seniority) {
            case 'fresher':
                bulletRange = '6-10'
                guidance = 'Focus on coursework, projects, tools used, and learning outcomes.'
                break
            case 'intern':
                bulletRange = '6-12'
                guidance = "Emphasize contributions, collaboration, and learning; use verbs like 'assisted', 'contributed', 'supported'."
                break
            case 'junior':
                bulletRange = '9-15'
                guidance = 'Highlight ownership of small features, collaboration, and modest measurable outcomes (if provided).'
                break
            default:
                bulletRange = '9-20'
                guidance = 'Emphasize impact, ownership, leadership, and measurable outcomes where reasonable.'
        }

        const prompt = `
Generate ${bulletRange} realistic resume bullet points for this role.

Job Title: ${jobTitle}
Company: ${company}
Location: ${location}
Role/Department: ${role}
Duration: ${startDate} to ${endDate}
Inferred seniority: ${seniority}

Rules (follow exactly):
- Tone & scope must match inferred seniority: ${guidance}
- DO NOT invent large percentages, impossible scope, or single-handed platform ownership for junior/interim roles.
- Bullets: 8-18 words each, factual, concise, action-first.
- If fresher: mention coursework, projects, libraries, and tools rather than claims of product impact.
- Output must be a single valid JSON array of strings and nothing else.
`

        const stream = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.15,
            max_tokens: 600,
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
                    const points = safeParseJSON(accumulatedContent)

                    // Filter and clean the points based on seniority
                    const filtered = points.map(point => {
                        let cleaned = point.trim()
                        // Remove unrealistic percentages
                        cleaned = cleaned.replace(/\b\d{3,}%\b/g, '')
                        cleaned = cleaned.replace(/\b100%?\b/g, '')

                        // Adjust language for fresher/intern roles
                        if (seniority === 'fresher' || seniority === 'intern') {
                            cleaned = cleaned.replace(/\b(owned|spearheaded|led|managed)\b/gi, 'contributed to')
                        }

                        return cleaned.replace(/\s{2,}/g, ' ').trim()
                    }).filter(point => point)

                    // Send the final result
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                        points: filtered.length > 0 ? filtered : getFallbackPoints(seniority),
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

function getFallbackPoints(seniority: string): string[] {
    if (seniority === 'fresher' || seniority === 'intern') {
        return [
            'Assisted with small frontend tasks using React and Tailwind.',
            'Learned team workflows and participated in code reviews.',
            'Implemented minor bug fixes and wrote basic tests.',
            'Worked with senior developers to integrate API endpoints.'
        ]
    } else {
        return [
            'Contributed to feature development and collaborated across teams.',
            'Improved code quality through tests and code reviews.',
            'Worked on API integration and frontend components.'
        ]
    }
}
