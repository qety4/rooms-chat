'use client'

import React, { useState } from 'react'
import '@/libs/styles/loginForm.styles.scss'
import axios, { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerValidator } from '@/libs/validators/registerValidator'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { passwordPattern } from '@/libs/regex'
import { Eye,EyeOff } from 'lucide-react'




type FormData = z.infer<typeof registerValidator>

function RegisterPage() {
    const [visible, setVisible] = useState<boolean>(false)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(registerValidator),
    })


    const login = () => {
        router.push('/join/login')
    }

    const onRegister = async (email: string, username: string, password: string) => {
        try {
            if (!password.match(passwordPattern))
                throw new Error('Password must contain at least 8 chracters, a number, one special chracter, and an uppercase letter')

            const res = await axios.post('/api/user/register', {
                email: email,
                username: username,
                password: password,
            })

            reset()
            setError('username', { message: 'succesfully registered' })

            setTimeout(() => router.push('/join/login'), 2000)

        } catch (error) {
            if (error instanceof z.ZodError) {
                setError('email', { message: error.message })
                return
            }
            if (error instanceof AxiosError) {
                setError('username', { message: error.response?.data })
                return
            }

            setError('password', { message: `${error}` })
        }
    }

    const onSubmit = (formData: FormData) => {
        onRegister(formData.email, formData.username, formData.password)
    }

    return (
        <main className='log-page'>
            <div className='log__form-container'>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='log__form'>
                    <label htmlFor="" className='form__label'>register</label>
                    <div className='form__input-containers'>
                        <div className='form__input-container'>
                            <label htmlFor="" className='input__label'>username</label>
                            <input
                                className='form__input'
                                {...register('username')}
                                type="text"
                                placeholder='enter username...'
                            />
                        </div>
                        <div className='form__input-container'>
                            <label htmlFor="" className='input__label'>password</label>
                            <input
                                type={visible ? 'text' : 'password'}
                                placeholder='enter password...'
                                {...register('password')}
                                className='form__input'
                            />
                            <div className='visible' onClick={()=>setVisible((prev)=>!prev)}>
                                {visible ? <EyeOff /> : <Eye />}
                            </div>
                        </div>
                        <div className='form__input-container'>
                            <label htmlFor="" className='input__label'>email</label>
                            <input type="placeholder"
                                {...register('email')}
                                placeholder='enter email...'
                                className='form__input'
                            />
                        </div>
                    </div>
                    <button className='form__button'>submit</button>
                    <div className='log__form__redirect'>
                        <p className='log__form__register' onClick={login}>login</p>
                    </div>
                </form>
                <p className='log__form__error'>{errors.email?.message || errors.username?.message || errors.password?.message}</p>
            </div>
        </main>
    )
}

export default RegisterPage