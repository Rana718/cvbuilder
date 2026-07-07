import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export const handleSecureSignOut = async () => {
    try {
        localStorage.clear()
        sessionStorage.clear()

        if ('caches' in window) {
            const cacheNames = await caches.keys()
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            )
        }

        await signOut(auth)
        window.location.href = '/sign-in'

    } catch (error) {
        console.error('Sign out error:', error)
        window.location.href = '/sign-in'
    }
}
