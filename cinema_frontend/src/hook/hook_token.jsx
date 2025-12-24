import { useAlert } from "../context/Alertcontext"


export default function useToken() {

    const {showSnackbar} = useAlert()

    const Refresh_token = async() => {
    try {
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        
        if (response.ok) {
                showSnackbar('refresh reussi !','success')
                return true
                
            } else {
                showSnackbar('refresh fail','error')
            }
        
    } catch(error) {
        showSnackbar('erreur de refresh','error')
        return false
    }
}
    
    return {Refresh_token}
}