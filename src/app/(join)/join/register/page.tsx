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




type FormData = z.infer<typeof registerValidator>

function RegisterPage() {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(registerValidator),
    })



    const onRegister = async (email: string, username: string, password: string) => {
        try {
            if(!password.match(passwordPattern))
                throw new Error('Password must contain at least 8 chracters, a number, one special chracter, and an uppercase letter')

            const res = await axios.post('/api/user/register', {
                email: email,
                username: username,
                password: password,
            })
            console.log(res)


        } catch (error) {
            if (error instanceof z.ZodError) {
                console.log(error)
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
        console.log(formData)

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
                            <input type="placeholder" placeholder='enter password...'
                                {...register('password')}
                                className='form__input'
                            />
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
                </form>
                    <p>{errors.email?.message || errors.username?.message || errors.password?.message}</p>
            </div>
        </main>
    )
}

export default RegisterPage