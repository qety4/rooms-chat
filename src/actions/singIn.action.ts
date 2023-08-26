'use server'

import { signIn } from "next-auth/react"

export const logIn = async (formData:FormData):Promise<void>=>{
    try{
        const name=formData.get('userName')
        const password=formData.get('password')

        await signIn('credentials',{
            name:name,
            password:password
        })
    }catch(e){
        console.log('login error',e)
    }
}