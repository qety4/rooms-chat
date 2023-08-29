'use client'

import '@/libs/styles/loginForm.styles.scss'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { loginValidator } from '@/libs/validators/loginValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { AxiosError } from 'axios'


type FormData = z.infer<typeof loginValidator>

export default function Login() {

  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
} = useForm<FormData>({
    resolver: zodResolver(loginValidator),
})

  const onSubmit = (formData:FormData)=>{
    onLogin(formData.username,formData.password)
  }


  const onLogin = async (username:string,password:string) => {
    try {

      const res = await signIn('credentials', {
        username: username,
        password: password,
        redirect: false
      })
      console.log('res', res)
      if (res!.error) {
        throw new Error('invalid credentials')
      }
      router.push('/room')
    } catch (error) { 
      if (error instanceof z.ZodError) {
        console.log(error)
        setError('username', { message: error.message })
        return
    }
    if (error instanceof AxiosError) {
        setError('username', { message: error.response?.data })
        return
    }
    setError('password', { message: `${error}` })
    }
  }

  return (
    <main className='log-page'>
      <div className='log__form-container'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          action='submit'
          className='log__form'>
          <label htmlFor="" className='form__label'>login</label>
          <div className='form__input-containers'>
            <div className='form__input-container'>
              <label htmlFor="" className='input__label'>username</label>
              <input type="text"
                {...register('username')}
                name='username'
                placeholder='enter username...'

                className='form__input' />
            </div>
            <div className='form__input-container'>
              <label htmlFor="" className='input__label'>password</label>
              <input type="placeholder"
                {...register('password')}
                name='password'
                placeholder='enter password...'

                className='form__input' />
            </div>
          </div>
          <button className='form__button'>submit</button>
        </form>
        <p>{errors.username?.message}</p>
      </div>
    </main>
  )
}
