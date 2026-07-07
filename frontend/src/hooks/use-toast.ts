import * as React from "react"

// Simple toast hook
export function useToast() {
    const [toasts, setToasts] = React.useState<Array<{ id: string; title: string; description?: string; variant?: "default" | "destructive" }>>([])

    const toast = React.useCallback(({ title, description, variant = "default" }: { title: string; description?: string; variant?: "default" | "destructive" }) => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts(prev => [...prev, { id, title, description, variant }])

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 3000)
    }, [])

    return { toast, toasts }
}
