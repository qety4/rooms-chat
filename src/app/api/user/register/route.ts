import { fetchRedis } from "@/helper/redis"
import { db } from "@/libs/db"
import bcrypt from 'bcrypt'

export async function POST(req: Request) {

    setTimeout(()=>{},100000)
    
    try {
        const data = await req.json()
        const { email, username, password } = data as User
        console.log('reg data', data)

        if (!email && !username && !password)
            return new Response('Invalid Data',{status:400})

        const userExists = await fetchRedis('smembers',`user:${username}`)

            console.log('userExists',userExists)
        if (userExists.at(0))
            return new Response('user already exists in', { status: 400 })

        const passwordEnc = await bcrypt.hash(password!,10)
        const timestamp = Date.now()

        const userDb = {
            email: email,
            name: username,
            password: passwordEnc,
            createdAt:timestamp
        }

        await db.sadd(`user:${username}`,userDb)

        return new Response('OK')
    } catch (e) {

    }
}