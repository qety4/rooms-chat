import { fetchRedis } from "@/helper/redis"
import { db } from "@/libs/db"
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const data = await req.json()
        const { email, username, password } = data as User

        if (!email && !username && !password)
            return new Response('Invalid Data',{status:400})

        const userExists = await fetchRedis('get', `user:${username}`)
        console.log('register req', data)
        if (userExists)
            return new Response('user already exists in', { status: 400 })

        const passwordEnc = await bcrypt.hash(password!,10)

        const userDb = {
            email: email,
            name: username,
            password: passwordEnc,
        }

        await db.sadd(`user:${username}`,userDb)

        return new Response('OK')
    } catch (e) {

    }
}