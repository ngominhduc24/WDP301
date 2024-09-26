import { Box, Button, Typography } from "@mui/material";
const Page404 = ()=> {
    return(
        <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: "100vw",
          backgroundColor: "#1976d2",
        }}
      >
        <Typography variant="h1" style={{ color: "white" }}>
          404
        </Typography>
        <Typography variant="h6" style={{ color: "white" }}>
          Địa chỉ bạn tìm kiếm không tồn tại
        </Typography>
      </Box>
    )
}

export default Page404;