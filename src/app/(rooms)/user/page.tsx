'use server'

import { fetchRedis } from '@/helper/redis'
import { authOptions } from '@/libs/auth'
import { getServerSession } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'

async function UserPage() {
  const session = await getServerSession(authOptions)
  const rooms = await fetchRedis('smembers', `user:${session?.user.name}:rooms`)
  // const rooms = JSON.parse(roomsDb)

  console.log('rooms',rooms)
  const signOutBtn = async () => {
    try {
      await signOut()
    } catch (e) {
      console.log(e)
    }
  }
  console.log('session client', session)
  return (
    <main>
      <div>
        <p>user</p>
        <p>{session?.user.name}</p>
      </div>
      {rooms.at(0) ?
        <div>
          {rooms.map((room:string) =>
            <p>{room}</p>
          )
          }
        </div>
        :
        <div>
          <p>You have no rooms availible</p>
        </div>
      }
    </main>
  )
}

export default UserPage