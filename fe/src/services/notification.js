import axios from "axios";
import { URL_SERVER } from "../dataConfig";
import Cookies from "js-cookie";

export const getNotification = async () => {
    const token = Cookies.get("accessToken");
    return await axios.get(`${URL_SERVER}/notification`, {
        withCredentials: true,
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
};

export const readNotification = async (notificationId) => {
    const token = Cookies.get("accessToken");
    return await axios.put(`${URL_SERVER}/notification/${notificationId}`,{
        isRead: true
    } ,{
        withCredentials: true,
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
}