import { fetchRedis } from '@/helper/redis'
import { nanoid } from 'nanoid'
import { db } from '@/libs/db'
import { redirect } from 'next/dist/server/api-utils'

const createRoomDb = async (username: string) => {
    try {
      const roomId = nanoid()
      const numRooms = (await fetchRedis('smembers', `user:${username}:rooms`)).length
      if (numRooms > 5)
      return console.log('room limit reached')
    
    await db.sadd(`rooms:roomlist`, roomId)
    await db.sadd(`room:${roomId}:users`, username)
    await db.sadd(`user:${username}:rooms`,)
    redirect('/user','push')
  } catch (e) {
    console.log('error', e)
  }
  }
  
  const joinRoomDb = async (roomId: string, username: string) => {
    try {
      const userRooms = await fetchRedis('smembers', `user:${username}:rooms`)
      if (userRooms.length > 5)
      return console.log('room limit exceeded')
    if (userRooms.includes(roomId))
    return redirect(`/room/${roomId}`)
  
  db.sadd(`room:${roomId}:users`, username)
  db.sadd(`user:${username}:rooms`)
  
  return redirect(`room/${roomId}`)
  
  } catch (e) {
    console.log('error', e)
  }
  }
  
  const joinRoomAction = async (formData: FormData, username: string) => {
    const roomId = formData.get('joinroom') as string
    joinRoomDb(roomId,username)
  }