import { createContext, useEffect, useState } from "react";
import axios from 'axios'

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const url = "http://localhost:8080";
    const [hangPhong, setHangPhong] = useState([]);
    const [ngayNhanPhong, setNgayNhanPhong] = useState(new Date());
    const [ngayTraPhong, setNgayTraPhong] = useState(new Date());
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");

    const addToCart = async(itemId, quantity) => {
        // if (!cartItems[itemId]) {
        //     setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        // } else {
        //     setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        // }
        setCartItems((prev) => ({ ...prev, [itemId]: quantity }))
        console.log(cartItems);
    }

    const removeFromCart = async(itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: 0 }))
        console.log(cartItems);
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = hangPhong.find((hp) => hp.idHangPhong == item);                
                if(itemInfo.phanTramGiam > 0){
                    totalAmount += itemInfo.giaKhuyenMai * cartItems[item] * calculateDateDifference();
                }else{
                    totalAmount += itemInfo.giaGoc * cartItems[item] * calculateDateDifference();
                }
            }
        }
        return totalAmount;
    }

    const fetchHangPhong = async() => {
        const response = await axios.get(url+"/api/thong-tin-hang-phong/all");
        setHangPhong(response.data.result);
    }

    const calculateDateDifference = () => {
        const timeDifference = ngayTraPhong.getTime() - ngayNhanPhong.getTime(); 
        const dayDifference = timeDifference / (1000 * 3600 * 24);
        return Math.round(dayDifference);
    };

    const convertDateShow = (date)=>{
        const dateArray = date.split("-");
        return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
    }

    useEffect(()=>{
        ngayTraPhong.setDate(ngayTraPhong.getDate() + 1);
        
        async function loadData() {
            await fetchHangPhong();
        }
        loadData();

        if(localStorage.getItem("token")){
            setToken(localStorage.getItem("token"));
        }
    }, [])
    
    const contextValue = {
        url,
        hangPhong,
        ngayNhanPhong,
        ngayTraPhong,
        setNgayNhanPhong,
        setNgayTraPhong,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        calculateDateDifference,
        token,
        setToken,
        convertDateShow,
    }


    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider