'use client'
import { Dialog, Transition } from '@headlessui/react'
import React from 'react'
import { Fragment, useState } from 'react'
import { XCircle } from 'lucide-react'
import '@/libs/styles/deleteRoomModal.styles.scss'
import axios from 'axios'

function DeleteModal({ roomId }: { roomId: string }) {
    const [isOpen, setOpen] = useState<boolean>(false)
    const onClose = () => {
        setOpen((prev) => !prev)
    }
    const deleteRoom = async () => {
        try{
            const res = await axios.post('/api/room/delete',{
                roomId:roomId
            })
            onClose()
        }catch(e){
            console.log('delete',e)
        }
    }

    return (
        <>
            <button className='room-delete-btn' onClick={() => setOpen(true)}><XCircle /></button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="delete-modal-container" onClose={onClose} >
                    <Transition.Child
                        // as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className='delete-modal'>

                            <Dialog.Title
                            //  as={Fragment}
                            >
                                <p className='delete-modal__title'>Are you sure you want to <br /><b className='modal__delete-word'>delete</b> room <br /><b className='modal__room-id'> {roomId}</b></p>
                            </Dialog.Title>
                            <Dialog.Panel
                            // as={Fragment}
                            className='delete-modal__btns'
                            >
                                <button onClick={deleteRoom} className='modal__btn delete-btn'>delete</button> <button onClick={onClose} className='modal__btn no-btn'>no</button>
                            </Dialog.Panel>
                        </div>
                    </Transition.Child>

                </Dialog>
            </Transition>
        </>
    )
}

export default DeleteModal