'use client'

import React, { ReactNode } from 'react'

import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import '@/libs/styles/nav.styles.scss'

function Nav() {

    // const segment = useSelectedLayoutSegment()
    const { data: session, status } = useSession()
    const params = usePathname()
    const isLoggedIn = status == 'authenticated'

    return (
        <nav className='navbar'>
            <div className="nav-left">
                {(isLoggedIn && !params.startsWith('/user')) &&
                    <Link  href='/user'>
                        <p>{session!.user.name}</p>
                    </Link>
                }
            </div>
            <div className="nav-middle">
                <Link  href='/room'>
                    <p>ROOMS</p>
                </Link>
            </div>
            <div className='nav-right'>

            </div>
        </nav>
    )
}

export default Nav