'use server'

import { auth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'

export async function signUpWithEmail(
  _prev: { error: string } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim()
  const name = (formData.get('name') as string)?.trim()
  const password = formData.get('password') as string

  if (!email) return { error: 'Email is required.' }
  if (!name) return { error: 'Name is required.' }
  if (!password || password.length < 8)
    return { error: 'Password must be at least 8 characters.' }

  const { error } = await auth.signUp.email({ email, name, password })

  if (error) {
    return { error: error.message || 'Failed to create account.' }
  }

  redirect('/dashboard')
}
