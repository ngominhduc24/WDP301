import axios from "axios";
import { URL_SERVER } from "../dataConfig";
import Cookies from "js-cookie";

export const changePassword = async (data) => {
    const token = Cookies.get("accessToken");
    return await axios.put(`${URL_SERVER}/account/profile/change-password`, data, {
        withCredentials: true,
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
};