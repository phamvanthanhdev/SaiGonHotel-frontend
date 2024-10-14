import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:8080";
    const [token, setToken] = useState("");
    const [isExpand, setIsExpand] = useState(false);
    
    useEffect(()=>{
        if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"));
        }
    }, [])
    
    const contextValue = {
        url,
        token,
        setToken,
        isExpand,
        setIsExpand
    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider