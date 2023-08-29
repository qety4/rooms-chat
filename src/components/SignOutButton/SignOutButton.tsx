'use client'
import { signOut } from 'next-auth/react'
import React from 'react'
import '@/libs/styles/signOutBtn.styles.scss'

function SignOutButton() {
    const signOutBtn = async()=>{
        try{
            await signOut()
        }catch(e){

        }
    }
  return (
        <button className="sign-out-btn" onClick={signOutBtn}>sign out</button>
  )
}

export default SignOutButton