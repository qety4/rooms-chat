'use server'

export const register = async (formData: FormData): Promise<void> => {
    try {
        const name = formData.get('userName')
        const password = formData.get('password')
        const email = formData.get('email')
        const res = await fetch('/api/user/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                password: password,
                email: email
            })
        })
        console.log('register res', res)
    } catch (e) {
        console.log('login error', e)
    }
}