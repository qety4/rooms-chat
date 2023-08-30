import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname
        const isAuth = await getToken({req})
        const isLoginPage = pathname.startsWith('/join')
        console.log('pathname',pathname)
        const rootPage = pathname === ('/')
        const sensitiveRoutes = ['/','/join','/user','/room']
        const accesingSensitiveRoutes = sensitiveRoutes.some((route)=>pathname.startsWith(route))

        if(isLoginPage){
            if(isAuth){
                return NextResponse.redirect(new URL('/user',req.url))
            }
            return
        }

        if(rootPage){
            return NextResponse.redirect(new URL('/join/login',req.url))
        }

       if(!isAuth && accesingSensitiveRoutes){
        return NextResponse.redirect(new URL('/join/login',req.url))
       }
    },
    {
    callbacks:{
            async authorized(){
              return true
            }
        }
    }
)

export const config ={
    matcher:['/','/join/:path*','/room/:path*','/user']
}