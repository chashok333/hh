import { useContext } from 'react';
import axios from "axios";

// ----------------------------------------------------------------------

const useBbgAuth = () => {
    const isUserLoggedIn = () => localStorage.getItem("token");
    const callLogin = async ({ email, password }) => {
        const response = await axios.post(`${process.env.REACT_APP_BE}auth/signin`, {
            email,
            password,
        });
        localStorage.setItem("token", response?.data?.token)

    }
    return { isUserLoggedIn, callLogin }
};

export default useBbgAuth;
