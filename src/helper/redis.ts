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

    if (response.status !== 200) {
        throw new Error(`Error executing Redis command ${command}`)
    }


    return data.result
}
