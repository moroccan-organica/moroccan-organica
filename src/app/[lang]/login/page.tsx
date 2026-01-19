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
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (result?.error) {
                setError(lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password')
                return
            }

            router.push(`/${lang}/admin`)
        } catch {
            setError(lang === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return <LoginScreen onSubmit={handleSubmit} isLoading={isLoading} errorMessage={error} />
}
