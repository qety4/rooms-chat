import React from 'react'
import '@/libs/styles/loader.styles.scss'

function loading() {

  return (
    <main className='loader-body'>
        <div className='loader'>
            <span className='loader-dot'></span>
            <span className='loader-dot'></span>
            <span className='loader-dot'></span>
        </div>

    </main>
  )
}

export default loading