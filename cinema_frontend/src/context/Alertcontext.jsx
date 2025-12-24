import { useContext, createContext, useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const AlertContext = createContext()

export const useAlert = () => {
    return useContext(AlertContext)

}

export default function Alertprovider({children}) {

    const [Alertstate, setAlertState] = useState({
        message: '',
        open: false,
        severity: 'success'
    })

    const handleCloseAlert = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertState(prev => ({ ...prev, open: false }));
    }, []);

    const showSnackbar = useCallback((message, severity = 'info') => {
        setAlertState({
            open: true,
            message,        
            severity,      
        });
    }, []);

    return (
        <AlertContext.Provider value={{showSnackbar}}>
            {children}
            <Snackbar
                open={Alertstate.open} 
                autoHideDuration={4000}
                onClose={handleCloseAlert} 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert} 
                    severity={Alertstate.severity} 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {Alertstate.message} 
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    )
}

