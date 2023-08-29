'use server'

import SignOutButton from '@/components/SignOutButton/SignOutButton'
import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/libs/auth'
import { getServerSession } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import '@/libs/styles/userPage.styles.scss'
import { notFound } from 'next/navigation'


async function UserPage() {

  const session = await getServerSession(authOptions)
  if (!session) notFound()

  const rooms = await fetchRedis('zrange', `user:${session.user.name}:rooms`, 0, -1) as string[]

  console.log('rooms', rooms)
  console.log('session client', session)

  return (
    //make a sorted set
    // delete rooms functionality
    <main className='user-page'>
      <div className='user__container'>
        <div className='user__info'>
          <p className='user__title'>user</p>
          <p className='user__name'>{session?.user.name}</p>
        </div>
        <SignOutButton />
        <div className='user__rooms-container'>
          <div className='user__rooms'>
            {rooms.at(0) ?
              rooms.map((room: string) =>
                <Link key={room} href={`/room/${room}`}>
                  <p className='room-link'>{room} </p>
                </Link>
              )
              :
              <p>You have no rooms availible</p>
            }
          </div>
        </div>
        <Link href='/room' >
          <p className='other-rooms-title'>
            OTHER ROOMS
          </p></Link>
      </div>
    </main>
  )
}

export default UserPage