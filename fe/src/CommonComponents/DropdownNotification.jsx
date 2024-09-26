import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getNotification, readNotification } from "../services/notification";
import { toast } from "react-toastify";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { convertTimeFormat } from "../Utils";
import { useNavigate } from 'react-router-dom'
import { socket } from "../socket/socket";


const DropdownNotification = () => {
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState([])
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        async function fetchNotification (){
            getNotification().then(data => {
                setNotifications(data.data.data)
            }).catch(error => {
                toast.error(error)
            })

        }
        fetchNotification()
        socket.on('newNotification', (data) => {
            fetchNotification()
        });
        // return () => {
        //     socket.disconnect();
        // };
    }, [])

    const handleNotificationClick = async (link, notificationId) => {
        handleClose();
        await readNotification(notificationId);
        navigate(link.replace("http://rms.io.vn", ""));
    }

    return (
        <>
            <IconButton color="inherit" onClick={handleClick} >
                <Badge badgeContent={(notifications?.filter(notification => !notification.isRead)).length} color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}

            >
                {notifications?.map((notification, index) => (

                    <MenuItem
                        sx={{
                            minWidth: "400px",
                            py: 3
                        }}
                        key={index}
                        onClick={() => handleNotificationClick(notification?.link, notification?._id)}
                    >
                        <Box sx={{
                            display: "flex",
                            gap: 3
                        }}>
                            <img src={notification?.avatar ? notification?.avatar : "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"} alt="avatar" width={`100px`} height={`100px`} />
                            <Box>
                                <Typography sx={{
                                    fontWeight: notification?.isRead === true ? "400" : "600"
                                }}>{notification?.message}</Typography>
                                <Typography
                                    sx={{
                                        fontWeight: notification?.isRead === true ? "400" : "600"
                                    }}
                                >{convertTimeFormat(notification?.createdAt)}</Typography>
                            </Box>

                        </Box>

                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default DropdownNotification;