"use server"

import { authOptions } from '@/libs/auth'
import { db } from '@/libs/db'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import React from 'react'
import { nanoid } from 'nanoid'
import { fetchRedis } from '@/helper/redis'
import JoinRoom from '@/components/JoinRoom/JoinRoom'
import CreateRoom from '@/components/CreateRoom/CreateRoom'
import '@/libs/styles/room.styles.scss'

async function Room() {
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  const username = session.user.name

  return (
    <main className='room'>
      <div className='room__forms'>
        <JoinRoom />
        <CreateRoom />
      </div>
    </main>
  )
}

export default Room