'use client'

import '@/libs/styles/loginForm.styles.scss'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const initialData = {
  username: '',
  password: ''
}

export default function Login() {
  const [formData, setFormData] = useState<User>(initialData)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      console.log(formData)
      await signIn('credentials', {
        username: formData.username,
        password: formData.password,
        redirect: false
      })

      router.push('/room')
    } catch (e) {
      console.log('login error', e)
    }
  }

  return (
    <main className='log-page'>
      <div className='log__form-container'>
        <form onSubmit={onSubmit} action='submit' className='log__form'>
          <label htmlFor="" className='form__label'>login</label>
          <div className='form__input-containers'>
            <div className='form__input-container'>
              <label htmlFor="" className='input__label'>username</label>
              <input type="text" name='username' placeholder='enter username...'
                onChange={handleChange}
                className='form__input' />
            </div>
            <div className='form__input-container'>
              <label htmlFor="" className='input__label'>password</label>
              <input type="placeholder" name='password' placeholder='enter password...'
                onChange={handleChange}
                className='form__input' />
            </div>
          </div>
          <button className='form__button'>submit</button>
        </form>
      </div>
    </main>
  )
}
