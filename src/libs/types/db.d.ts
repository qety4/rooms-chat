type User = {
    username: string,
    email?: string,
    password?: string
}

type Chat = {
    id: string,
    messges: Message[]
}

type Message = {
    id: string,
    text: string,
    timestamp: number,
    senderUsername: string
}
