
export interface StreamingResponse {
    content?: string
    type: 'chunk' | 'complete' | 'error'
    success?: boolean
    error?: string
    points?: string[]
    skills?: string[]
    summary?: string[]
}

export async function* streamWorkExperience(data: {
    jobTitle: string
    company: string
    location: string
    role: string
    startDate: string
    endDate: string
    experienceCount?: number
    seniorityOverride?: string
}) {
    const response = await fetch('/api/cv/generate-work-experience', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
        throw new Error('No reader available')
    }

    const decoder = new TextDecoder()

    try {
        while (true) {
            const { done, value } = await reader.read()

            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data: StreamingResponse = JSON.parse(line.slice(6))
                        yield data
                    } catch (e) {
                        console.warn('Failed to parse streaming data:', e)
                    }
                }
            }
        }
    } finally {
        reader.releaseLock()
    }
}

export async function* streamSkills(data: {
    workExperience: string
    seniorityOverride?: string
}) {
    const response = await fetch('/api/cv/generate-skills', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
        throw new Error('No reader available')
    }

    const decoder = new TextDecoder()

    try {
        while (true) {
            const { done, value } = await reader.read()

            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data: StreamingResponse = JSON.parse(line.slice(6))
                        yield data
                    } catch (e) {
                        console.warn('Failed to parse streaming data:', e)
                    }
                }
            }
        }
    } finally {
        reader.releaseLock()
    }
}

export async function* streamSummary(data: {
    cvData: {
        skills?: string[]
        experience?: Array<{
            title?: string
            company?: string
            startDate?: string
            endDate?: string
            duration?: string
        }>
    }
    seniorityOverride?: string
}) {
    const response = await fetch('/api/cv/generate-summary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
        throw new Error('No reader available')
    }

    const decoder = new TextDecoder()

    try {
        while (true) {
            const { done, value } = await reader.read()

            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data: StreamingResponse = JSON.parse(line.slice(6))
                        yield data
                    } catch (e) {
                        console.warn('Failed to parse streaming data:', e)
                    }
                }
            }
        }
    } finally {
        reader.releaseLock()
    }
}

// Example usage hooks
export function useStreamingWorkExperience() {
    const generateWorkExperience = async (
        data: Parameters<typeof streamWorkExperience>[0],
        onChunk?: (content: string) => void,
        onComplete?: (points: string[]) => void,
        onError?: (error: string) => void
    ) => {
        try {
            for await (const chunk of streamWorkExperience(data)) {
                if (chunk.type === 'chunk' && chunk.content && onChunk) {
                    onChunk(chunk.content)
                } else if (chunk.type === 'complete' && chunk.points && onComplete) {
                    onComplete(chunk.points)
                } else if (chunk.type === 'error' && chunk.error && onError) {
                    onError(chunk.error)
                }
            }
        } catch (error) {
            if (onError) {
                onError(error instanceof Error ? error.message : 'Unknown error')
            }
        }
    }

    return { generateWorkExperience }
}

export function useStreamingSkills() {
    const generateSkills = async (
        data: Parameters<typeof streamSkills>[0],
        onChunk?: (content: string) => void,
        onComplete?: (skills: string[]) => void,
        onError?: (error: string) => void
    ) => {
        try {
            for await (const chunk of streamSkills(data)) {
                if (chunk.type === 'chunk' && chunk.content && onChunk) {
                    onChunk(chunk.content)
                } else if (chunk.type === 'complete' && chunk.skills && onComplete) {
                    onComplete(chunk.skills)
                } else if (chunk.type === 'error' && chunk.error && onError) {
                    onError(chunk.error)
                }
            }
        } catch (error) {
            if (onError) {
                onError(error instanceof Error ? error.message : 'Unknown error')
            }
        }
    }

    return { generateSkills }
}

export function useStreamingSummary() {
    const generateSummary = async (
        data: Parameters<typeof streamSummary>[0],
        onChunk?: (content: string) => void,
        onComplete?: (summary: string[]) => void,
        onError?: (error: string) => void
    ) => {
        try {
            for await (const chunk of streamSummary(data)) {
                if (chunk.type === 'chunk' && chunk.content && onChunk) {
                    onChunk(chunk.content)
                } else if (chunk.type === 'complete' && chunk.summary && onComplete) {
                    onComplete(chunk.summary)
                } else if (chunk.type === 'error' && chunk.error && onError) {
                    onError(chunk.error)
                }
            }
        } catch (error) {
            if (onError) {
                onError(error instanceof Error ? error.message : 'Unknown error')
            }
        }
    }

    return { generateSummary }
}
