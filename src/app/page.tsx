import { notFound } from 'next/navigation'
import React from 'react'

async function page() {
  return (
    notFound()
  )
}

export default page