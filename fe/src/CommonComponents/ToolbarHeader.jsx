import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Icon, {
  MessageOutlined,
  BellOutlined,
  PlusOutlined,
  DownOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import MenuItem from "@mui/material/MenuItem";

import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
// import { login } from "../../reduxToolkit/UserSlice";
import { Outlet, useNavigate } from "react-router-dom";
// import { getCurrentUser } from "../../services/auth";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { login } from "../reduxToolkit/UserSlice";
import { getCurrentUser, logout } from "../services/auth";
import {
  mainListItems,
  secondaryListItems,
  mainListItemsRenter
} from "../pages/Dashboard/Components/listItems";
import DropdownNotification from "./DropdownNotification";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const settings = ["Tài khoản", "Cài đặt", "Dashboard", "Đăng Xuất"];

export default function ToolbarHeader() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.data); //state là rootReducer trong store ,counter cái tên đăng kí trong rootReducer
  // console.log("userData", userData);
  const name = userData?.name;

  const accessToken = Cookies.get("accessToken");
  console.log("accessToken", accessToken);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    getCurrentUser(accessToken)
      .then((res) => {
        // console.log("getCurrentUser", res);
        dispatch(login(res?.data?.data));
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          navigate("/login");
        }
        console.log(error);
      });
  }, [dispatch, accessToken]);

  // useEffect(() => {
  //   if (userData) {
  //     setIsLoading(false);
  //   }
  // }, [userData]);
  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      setIsLoading(false);
    }
  }, [userData]);
  console.log("userData",userData);
  const handleLogout = () => {
    logout();
    Cookies.remove("accessToken");
    navigate("/");
    window.location.reload();
  };
  const handleMenuItemClick = (link) => {
    navigate(`${link}`);
  };

  return (
    <>
      {isLoading ? (
        <div className="text-center">
          <AiOutlineLoading3Quarters className="loading-icon" />
          <p>Loading...</p>
        </div>
      ) : (
        <ThemeProvider theme={defaultTheme}>
          <Box sx={{ display: "flex" }}>
            {/* <CssBaseline /> */}
            {/* header bên trên */}
            <AppBar position="absolute" open={open}>
              <Toolbar
                sx={{
                  pr: "24px", // keep right padding when drawer closed
                }}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: "36px",
                    ...(open && { display: "none" }),
                  }}
                >
                  <MenuIcon />
                </IconButton>

                <Typography
                  component="div"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexGrow: 1,
                  }}
                >
                  {userData && <div>{name}</div>}
                </Typography>
                <Box sx={{ flexGrow: 0 }}>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/2.jpg"
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    {settings.map((setting) => {
                      if (setting === "Tài khoản") {
                        return (
                          <MenuItem
                            key={setting}
                            onClick={() => handleMenuItemClick("/profile")}
                          >
                            <Typography textAlign="center">
                              {setting}
                            </Typography>
                          </MenuItem>
                        );
                      }  else if (setting === "Đăng Xuất") {
                        return (
                          <MenuItem key={setting} onClick={handleLogout}>
                            <Typography textAlign="center">
                              {setting}
                            </Typography>
                          </MenuItem>
                        );
                      }
                    })}
                  </Menu>
                </Box>

                <DropdownNotification/>
              </Toolbar>
            </AppBar>{" "}
            {/* header bên trên */}
            {/* tay trái */}
            <Drawer variant="permanent" open={open}>
              <Toolbar
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  px: [1],
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <ChevronLeftIcon />
                </IconButton>
              </Toolbar>
              <Divider />
              {userData.accountType == "host" ? (
                <List component="nav">
                  {mainListItems}
                  <Divider sx={{ my: 1 }} />
                  {secondaryListItems}
                </List>
              ) : (
                <List component="nav">
                  {mainListItemsRenter}
                </List>
              )}
            </Drawer>{" "}
            {/* tay trái */}
            {/* nội dung chính */}
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? "#FFFFFF"
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Toolbar />
              {/* bố cục nội dung  */}
              <Container maxWidth="false">
                <Grid container spacing={1}>
                  {/* spacing={number}   <Grid> sẽ chứa các phần tử con và có khoảng cách (spacing)
                 là number đơn vị giữa các phần tử con  */}

                  <Outlet ></Outlet>
                  {/* Chart
                  <Grid item xs={12} md={8} lg={9}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: 240,
                      }}
                    >
                      <Chart />
                    </Paper>
                  </Grid>
                  Recent Deposits
                  <Grid item xs={12} md={4} lg={3}>
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        height: 240,
                      }}
                    >
                      <Deposits />
                    </Paper>
                  </Grid>
                  Recent Orders
                  <Grid item xs={12}>
                    <Paper
                      sx={{ p: 2, display: "flex", flexDirection: "column" }}
                    >
                      <Orders />
                    </Paper>
                  </Grid> */}
                </Grid>
              </Container>
            </Box>{" "}
            {/* <Nội dung /> */}
          </Box>
        </ThemeProvider>
      )}
    </>
  );
}
