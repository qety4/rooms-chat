'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import DeleteModal from './DeleteModal'
import { toPusherKey } from '@/libs/utils'
import { pusherClient } from '@/libs/pusher/pusher'

function UserRooms({ initialRooms,userName }: { initialRooms: string[],userName:string }) {
    const [rooms,setRooms] = useState<string[]>(initialRooms)

    useEffect(()=>{
        pusherClient.subscribe(
            toPusherKey(`user:${userName}:rooms`)
        )

        const deleteHandler = (roomId: string) => {
            setRooms((prev) => prev.filter((room)=> room !== roomId))
        }

        pusherClient.bind('delete_room', deleteHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${userName}:rooms`))
            pusherClient.unbind('delete_room', deleteHandler)
        }

    },[userName])

    return (
        <div className='user__rooms'>
            {rooms.at(0) ?
                rooms.map((room: string,index) =>
                    <div className='room-link-body' key={`${room}-${index}`}>
                        <Link key={room} href={`/room/${room}`}>
                            <p className='room-link'>{room} </p>
                        </Link>
                        <DeleteModal roomId={room}/>
                    </div>

                )
                :
                <p>You have no rooms availible</p>
            }
        </div>
    )
}

export default UserRooms