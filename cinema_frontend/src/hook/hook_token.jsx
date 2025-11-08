

export default function useToken() {

    const Refresh_token = async() => {

        const token = localStorage.getItem('token')
        if (!token) return null

        try {
            const response = await fetch('http://localhost:8000/auth/refresh', {
                method: 'POST',
                headers: {'Authorization': `Bearer ${token}`}
            })

            if (response.ok) {
                const { access } = await response.json();
                localStorage.setItem('token', access); 
                return access
            }
        } catch(error) {
            console.error('token error refresh', error)
        }
        return null
    }
    return {Refresh_token}
}