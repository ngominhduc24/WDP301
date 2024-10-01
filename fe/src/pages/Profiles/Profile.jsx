import { Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import General from "./components/general";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ChangePassword from "./components/ChangePassword";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const userData = useSelector((state) => state.user.data); //state là rootReducer trong store ,counter cái tên đăng kí trong rootReducer
  
  // if (userData) {
  //   var userID = userData._id;
  // }
  // console.log("userData1", userData.avatar);
  
  

  useEffect(() => {
    if (userData) {
      setIsLoading(false);
      // console.log("chya vao effect");
    }
  }, [userData]);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      {isLoading ? (
        <div className="text-center">
          <AiOutlineLoading3Quarters className="loading-icon" />
          <p>Loading...</p>
        </div>
      ) : (
        <Grid item xs={12} md={12} lg={12}>
          <Paper
            elevation={3}
            sx={{
              p: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Tabs value={value} onChange={handleChange}>
              <Tab label="Thông tin cá nhân" />
              <Tab label="Mật khẩu" />
            </Tabs>
            <General value={value} index={0}/>
            <ChangePassword value={value} index={1}/>
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default Profile;
