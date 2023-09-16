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
import { Eye,EyeOff } from 'lucide-react'

type FormData = z.infer<typeof loginValidator>

export default function Login() {
  const [visible, setVisible] = useState<boolean>(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(loginValidator),
  })

  const onSubmit = (formData: FormData) => {
    onLogin(formData.username, formData.password)
  }

  const Register = () => {
    router.push('/join/register')
  }

  const onLogin = async (username: string, password: string) => {
    try {

      const res = await signIn('credentials', {
        username: username,
        password: password,
        redirect: false
      })
      if (res!.error) {
        throw new Error('invalid credentials')
      }
      router.push('/user')
    } catch (error) {
      if (error instanceof z.ZodError) {
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

  const loginDemo = ()=>{
        onLogin('demo','Demo1234!5678')
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
              <input type={visible ? 'text' : 'password'}
                {...register('password')}
                name='password'
                placeholder='enter password...'

                className='form__input' />
                <div className='visible' onClick={()=>setVisible((prev)=>!prev)}>
                  {visible ? <EyeOff/> : <Eye/>}
                </div>
            </div>
          </div>
          <button className='form__button'>submit</button>
          <div className='log__form__redirect'>
            <p className='log__form__demo' onClick={loginDemo}>login demo</p>
            <p className='log__form__register' onClick={Register}>register</p>
          </div>
        </form>
        <p className='log__form__error'>{errors.username?.message || errors.password?.message}</p>
      </div>
    </main>
  )
}
