'use client'

import React, { useState } from 'react'
import '@/libs/styles/loginForm.styles.scss'
import axios from 'axios'

const initialData = {
    username: '',
    password: '',
    email: ''
}

function RegisterPage() {
    const [formData, setFormData] = useState<User>(initialData)

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
            const target =  e.target as HTMLFormElement
            console.log(formData)
            await axios.post('/api/user/register', {
                email:formData.email,
                username: formData.username,
                password: formData.password,
            } as User)
            setFormData(initialData)
            target.reset()
        } catch (e) {
            console.log('login error', e)
        }
    }

    return (
        <main className='log-page'>
            <div className='log__form-container'>
                <form
                // action={register}
                onSubmit={onSubmit} 
                className='log__form'>
                    <label htmlFor="" className='form__label'>register</label>
                    <div className='form__input-containers'>
                        <div className='form__input-container'>
                            <label htmlFor="" className='input__label'>username</label>
                            <input type="text" name='username' placeholder='enter username...'
                                className='form__input'
                                onChange={handleChange}
                            />
                        </div>
                        <div className='form__input-container'>
                            <label htmlFor="" className='input__label'>password</label>
                            <input type="placeholder" name='password' placeholder='enter password...'
                                className='form__input'
                                onChange={handleChange}
                            />
                        </div>
                        <div className='form__input-container'>
                            <label htmlFor="" className='input__label'>email</label>
                            <input type="placeholder" name='email' placeholder='enter email...'
                                className='form__input'
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button className='form__button'>submit</button>
                </form>
            </div>
        </main>
    )
}

export default RegisterPage