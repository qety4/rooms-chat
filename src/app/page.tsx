import React from 'react'
async function wait(ms:number){
  return new Promise(resolve=>setTimeout(resolve,ms))
}

async function page() {
  await wait(10000)


  return (
    <div>//// page</div>
  )
}

export default page