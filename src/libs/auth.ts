import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import { fetchRedis } from "@/helper/redis";
import bcrypt from 'bcrypt'

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                username: {
                    label: 'username',
                    type: 'text',
                },
                password: {
                    label: 'password',
                    type: 'text'
                },
                email: {
                    label: 'email',
                    type: 'email'
                }
            },
            async authorize(credentials) {

                if (!credentials?.email && !credentials?.username)
                    throw new Error('bad input')

                const userDb = await fetchRedis('smembers', `user:${credentials.username}`)

                if (!userDb.at(0))
                    return null
                
                const user = JSON.parse(userDb)

                const passwordsMatch: Boolean = await bcrypt.compare(credentials.password, user.password)

                if (!passwordsMatch)
                    return null
                
                return user
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, session }) {
            if(user)
                return{
                    email:user.email,
                    name:user.name
                }
            return token
        },


        async session({ session, token }) {
            if(token){
                session.user.name= token.name
                session.user.email=token.email
            }
            return session
        },
    }

}