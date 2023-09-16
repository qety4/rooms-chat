'use client'
import { pusherClient } from '@/libs/pusher/pusher'
import { toPusherKey } from '@/libs/utils'
import React, { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import '@/libs/styles/participants.styles.scss'
import { Users } from 'lucide-react'

function ParticipantsList({ initialParticipants, roomId }: { initialParticipants: string[], roomId: string }) {
    const [users, setUsers] = useState<string[]>(initialParticipants)
    const [isOpen, setOpen] = useState(false)

    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`room:${roomId}:users`)
        )
        const usersHandler = (user: string) => {
            setUsers((prev) => [user, ...prev])
        }

        pusherClient.bind('new_user', usersHandler)


        return () => {
            pusherClient.unsubscribe(toPusherKey(`room:${roomId}:users`))
            pusherClient.unbind('new_user', usersHandler)
        }
    }, [roomId])

    return (
        <div className='participants'>
            <button className="users__open-btn" onClick={() => setOpen(!isOpen)}> <Users /><span>users list</span> </button>
            <Transition
                show={isOpen}
                enter="transition ease-out duration-180"
                enterFrom="transform opacity-80 scale-10"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform opacity-10 scale-0"
            >
                <div className='users__list-container'>
                    <div className='users__title-container'>
                        <h3 className='users__title'><b className='users__count'>{users.length}</b>room users</h3>
                    </div>
                    <ul className='users__list'>
                        {users.map((item) =>
                            <li className='users__user' key={item}>
                                <p className='users__user__text'>{item}</p>
                            </li>
                        )
                        }
                    </ul>
                </div>
            </Transition>
        </div>
    )
}

export default ParticipantsList