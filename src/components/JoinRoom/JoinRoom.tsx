'use client'

import { db } from '@/libs/db'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import '@/libs/styles/joinRoom.styles.scss'
import { useForm } from 'react-hook-form'
import { roomValidator } from '@/libs/validators/roomValidator'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { type } from 'os'


type FormData = z.infer<typeof roomValidator>

function JoinRoom() {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(roomValidator),
    })

    const joinRoom = async (value: string) => {
        try {

            const res = await axios.post('/api/room/join', {
                roomId: value,
            })

            if (res.status === 201)
                router.push(`/room/${value}`)

            if (res.status !== 200)
                throw new Error('Server Error')

            return router.push(`/room/${value}`)
        } catch (error) {
            if (error instanceof z.ZodError) {
                setError('room', { message: error.message })
                return
            }
            if (error instanceof AxiosError) {
                setError('room', { message: error.response?.data })
                return
            }
            setError('room', { message: `Something wrong ${error}` })
        }
    }

    const onSubmit = (data: FormData) => {
        joinRoom(data.room)
    }


    return (
        <>
            <div className='join-room__form-container'>
                <form onSubmit={handleSubmit(onSubmit)} className='join-room__form'>
                    <h3 className='join-room__title'>Join Room</h3>
                    <input className='join-room__input'
                        {...register('room')}
                        type="text" placeholder="enter room..." />
                    <div className='join-room__btn-container'>
                        <button className='join-room__btn'>submit</button>
                    </div>
                </form>
                <p className='form-errors'>{errors.room?.message}</p>
            </div>
        </>
    )
}

export default JoinRoom