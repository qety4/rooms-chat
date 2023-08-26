'use server'
import React, { ReactNode } from 'react'

function layout({children}:{children:ReactNode}) {
  return (
    <>
    <nav>
        nav
    </nav>
    {children}
    </>
  )
}

export default layout