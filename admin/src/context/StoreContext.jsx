import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:8080";
    const [token, setToken] = useState("");
    const [isExpand, setIsExpand] = useState(false);
    const navigate = useNavigate();

    const introspect = async(token) => {
        try {
            const formData = {
                token: token
            }
            const response = await axios.post(url + "/api/tai-khoan/introspect", formData);
            if(!response.data.result.valid){
                navigate("/login");
            }
        } catch (error) {
            console.log(response.data);
            console.log(error.message);
        }
    }

    const convertDateShow = (date)=>{
        const dateArray = date.split("-");
        return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
    }
    
    useEffect(()=>{
        if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"));
            introspect(localStorage.getItem("token"));
        }
    }, [])
    
    const contextValue = {
        url,
        token,
        setToken,
        isExpand,
        setIsExpand,
        introspect,
        convertDateShow
    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider