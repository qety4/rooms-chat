const upstashRediRestUrl = process.env.UPSTASH_REDIS_REST_URL
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN

type Commands = 'zrange' | 'sismember' | 'get' | 'smembers' | 'zscore'

export async function fetchRedis(
    command: Commands,
    ...args: (string | number)[]
) {
    const commandUrl = `${upstashRediRestUrl}/${command}/${args.join('/')}`

    const response = await fetch(
        commandUrl, {
        headers: {
            Authorization: `Bearer ${authToken}`
        },
        cache: 'no-store',
    }
    )
    const data = await response.json()
    console.log(`fetch data {${args}}`, data)

    if (response.status !== 200) {
        throw new Error(`Error executing Redis command ${command}`)
    }


    return data.result
}

// async function getChatMessages(roomId: string) {
//     try {
//       const results: string[] = await fetchRedis('zrange', `room:${roomId}:messages`, 0, -1)
  
//       const dbMessages = results.map((message) => JSON.parse(message) as Message)
  
//       const messagesRev = messageArrayValidator.parse(dbMessages)
//       const messages = messagesRev.reverse()
//       console.log('getChatMessages', messages)
//       return messages
//     } catch (e) {
//       notFound()
//     }
//   }