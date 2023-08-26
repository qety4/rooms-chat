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

// const createRoomDb = async (username: string) => {
//   try {
//     const roomId = nanoid()
//     const numRooms = (await fetchRedis('smembers', `user:${username}:rooms`)).length
//     if (numRooms > 5)
//     return console.log('room limit reached')
  
//   await db.sadd(`rooms:roomlist`, roomId)
//   await db.sadd(`room:${roomId}:users`, username)
//   await db.sadd(`user:${username}:rooms`,)
//   return redirect('/user')
// } catch (e) {
//   console.log('error', e)
// }
// }

// const joinRoomDb = async (roomId: string, username: string) => {
//   try {
//     const userRooms = await fetchRedis('smembers', `user:${username}:rooms`)
//     if (userRooms.length > 5)
//     return console.log('room limit exceeded')
//   if (userRooms.includes(roomId))
//   return redirect(`/room/${roomId}`)

// db.sadd(`room:${roomId}:users`, username)
// db.sadd(`user:${username}:rooms`)

// return redirect(`room/${roomId}`)

// } catch (e) {
//   console.log('error', e)
// }
// }

// const joinRoomAction = async (formData: FormData, username: string) => {
//   const roomId = formData.get('joinroom') as string
//   joinRoomDb(roomId,username)
// }

// make an api with these
async function Room() {
  const session = await getServerSession(authOptions)
    if (!session) notFound()
  const username = session.user.name
  const userRoomsDb = await fetchRedis('smembers', `user:${username}:rooms`) as string
  console.log('user rooms' ,userRoomsDb)

  // create room id, add it to list of rooms, add it to list of user rooms, add user to the list of room users
// join room , redirect to the input url

  return (
    <main>
      <JoinRoom userRooms={userRoomsDb} />
      <CreateRoom userRooms={userRoomsDb}/>
    </main>
  )
}

export default Room