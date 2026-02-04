'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import LoginScreen from '@/components/ui/login-1'

type FormState = { email: string; password: string }

export default function LoginPage() {
    const router = useRouter()
    const params = useParams()
    const lang = (params?.lang as string) || 'en'
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: FormState) => {
        setError('')
        setIsLoading(true)

        try {
            console.log('Attempting login for:', data.email)
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            console.log('Login result:', result)

            if (result?.error) {
                setError(lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password')
                return
            }

            if (result?.ok) {
                // Force a hard refresh or ensure router is ready
                window.location.href = `/${lang}/admin`
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(lang === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return <LoginScreen onSubmit={handleSubmit} isLoading={isLoading} errorMessage={error} />
}
