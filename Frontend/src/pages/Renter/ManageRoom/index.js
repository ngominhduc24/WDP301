import React, { useEffect, useState } from "react"
import {
  Tabs,
  Button as AntButton,
  message,
  Row,
  Typography,
  Table,
} from "antd"
import { Box, Grid, Avatar, Button as MuiButton } from "@mui/material"
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons"
import { styled } from "@mui/system"
import RenterService from "src/services/RenterService"
import STORAGE, { getStorage, setStorage } from "src/lib/storage"
import ModalInsertRenter from "./modal/ModalInsertRenter"
import ModalUpdateRenter from "./modal/ModalUpdateRenter"
import CB1 from "src/components/Modal/CB1"
import Button from "src/components/MyButton/Button"
const { TabPane } = Tabs

const StyledBox = styled(Box)({
  backgroundColor: "#f9f9f9",
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  marginBottom: "24px",
})

const TenantCard = styled(Box)({
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
})

const ManageRoom = () => {
  const [loading, setLoading] = useState(false)
  const [room, setRoom] = useState(null)
  const userInfo = getStorage(STORAGE.USER_INFO)
  const [isInsertRenterVisible, setIsInsertRenterVisible] = useState(false)
  const [isUpdateRenterVisible, setIsUpdateRenterVisible] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [billDetail, setBillDetail] = useState(null)

  useEffect(() => {
    if (userInfo?.roomId) {
      getRoomsDetail(userInfo?.roomId)
      getBillDetail(userInfo?.roomId)
    }
  }, [userInfo?.roomId])

  const getRoomsDetail = async id => {
    try {
      setLoading(true)
      const response = await RenterService.getRoomDetail(id)
      if (response?.data) {
        setRoom(response.data)
      }
    } catch (error) {
      message.error("Không thể tải thông tin phòng!")
    } finally {
      setLoading(false)
    }
  }
  const handleEditRenter = member => {
    setSelectedMember(member)
    setIsUpdateRenterVisible(true)
  }
  const handleAddRenter = () => {
    if (room?.members.length >= room?.quantityMember) {
      message.warning("Phòng đã đủ số lượng khách thuê, không thể thêm mới!")
    } else {
      setIsInsertRenterVisible(true)
    }
  }
  const handleDeleteRenter = member => {
    CB1({
      title: `Bạn có chắc chắn muốn xóa khách thuê này không?`,
      icon: "warning-usb",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async close => {
        try {
          const payload = { memberId: member._id }

          await RenterService.deleteMember(userInfo?.roomId, payload)

          message.success("Xóa khách thuê thành công!")

          getRoomsDetail(userInfo?.roomId)
        } catch (error) {
          message.error("Xóa khách thuê thất bại!")
        }
        close()
      },
    })
  }
  const getBillDetail = async id => {
    try {
      const response = await RenterService.getBillDetail(id)
      if (response?.data) {
        setBillDetail(response.data[0])
      }
    } catch (error) {
      message.error("Không thể tải thông tin hóa đơn!")
    }
  }
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      render: (text, _, index) => index + 1,
    },
    { title: "Tên", dataIndex: ["base", "name"], key: "name" },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: value => `${value.toLocaleString()} ₫`,
    },
    { title: "Đơn vị", dataIndex: ["base", "unit"], key: "unit" },
    { title: "Chỉ số đầu", dataIndex: "startUnit", key: "startUnit" },
    { title: "Chỉ số cuối", dataIndex: "endUnit", key: "endUnit" },
    {
      title: "Thành tiền",
      dataIndex: "totalUnit",
      key: "totalUnit",
      render: value => `${value.toLocaleString()} ₫`,
    },
  ]
  return (
    <Box
      sx={{
        marginTop: "10px",
        position: "relative",
        backgroundColor: "#FFFFFF",
        marginBottom: "20px",
      }}
    >
      <Box sx={{ padding: "24px", maxWidth: "100%", margin: "0 auto" }}>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Thông Tin Phòng" key="1">
            <StyledBox display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h6">Tầng:</Typography>
                <Typography>{room?.floor || "N/A"}</Typography>
              </Box>
              <Box>
                <Typography variant="h6">Tên Phòng:</Typography>
                <Typography>{room?.name || "N/A"}</Typography>
              </Box>
              <Box>
                <Typography variant="h6">Loại:</Typography>
                <Typography>
                  {room?.roomType === "normal" ? "Thường" : "Cao cấp"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">Đơn Giá:</Typography>
                <Typography>
                  {room?.roomPrice.toLocaleString()} VND/tháng
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6">Số Người Phù Hợp:</Typography>
                <Typography>{room?.quantityMember || "N/A"}</Typography>
              </Box>
              <Box>
                <Typography variant="h6">Số Người Đang Thuê:</Typography>
                <Typography>{room?.members?.length || 0}</Typography>
              </Box>
              <Box>
                <Typography variant="h6">Tình Trạng:</Typography>
                <Typography>
                  {room?.status === "Empty"
                    ? "Chưa Có Khách Thuê"
                    : "Đang Thuê"}
                </Typography>
              </Box>
            </StyledBox>
          </TabPane>

          <TabPane tab="Khách Thuê" key="2">
            <Box
              width="100%"
              display="flex"
              justifyContent="flex-end"
              marginBottom="16px"
            >
              <Button btntype="primary" onClick={handleAddRenter}>
                Thêm Khách Thuê
              </Button>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              flexWrap="wrap"
              gap="24px"
              padding="24px"
            >
              {room?.members?.map((member, index) => (
                <Box
                  key={index}
                  width="45%"
                  padding="16px"
                  border="1px solid #e0e0e0"
                  borderRadius="8px"
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6} display="flex" justifyContent="center">
                      <Avatar
                        src={
                          member?.avatar?.imageData ||
                          "https://via.placeholder.com/80"
                        }
                        alt={member.name}
                        sx={{ width: 80, height: 80 }}
                      >
                        {!member.avatar && <UserOutlined />}
                      </Avatar>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {member.name}
                      </Typography>
                      <Typography>CCCD: {member.cccd}</Typography>
                      <Typography>SĐT: {member.phone}</Typography>
                      <Typography>
                        Giới Tính: {member.gender === "male" ? "Nam" : "Nữ"}
                      </Typography>
                      <Typography>Ngày Sinh: {member.dob}</Typography>
                    </Grid>
                  </Grid>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    marginTop="16px"
                  >
                    <MuiButton
                      variant="contained"
                      startIcon={<EditOutlined />}
                      onClick={() => handleEditRenter(member)}
                      sx={{ width: "48%" }}
                    >
                      Cập Nhật
                    </MuiButton>
                    <MuiButton
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteOutlined />}
                      onClick={() => handleDeleteRenter(member)}
                      sx={{ width: "48%" }}
                    >
                      Xóa
                    </MuiButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </TabPane>
          <TabPane tab="Thông Tin Hóa Đơn" key="3">
            <StyledBox>
              <Row
                justify="space-between"
                align="middle"
                style={{ marginBottom: 16 }}
              >
                <Typography.Title level={4}>
                  Tháng{" "}
                  {billDetail
                    ? new Date(billDetail.createdAt).getMonth() + 1
                    : ""}
                  /
                  {billDetail
                    ? new Date(billDetail.createdAt).getFullYear()
                    : ""}
                </Typography.Title>
                <Typography.Text
                  type={billDetail?.isPaid ? "success" : "danger"}
                >
                  {billDetail?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}.
                  Tổng tiền:{" "}
                  {billDetail?.total
                    ? `${billDetail.total.toLocaleString()} ₫`
                    : ""}
                </Typography.Text>
              </Row>

              <Table
                dataSource={billDetail?.priceList || []}
                columns={columns}
                pagination={false}
                bordered
                summary={() => (
                  <>
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={6}>
                        <Typography.Text strong>
                          Tiền phòng/tháng
                        </Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        {billDetail?.roomPrice
                          ? `${billDetail.roomPrice.toLocaleString()} ₫`
                          : ""}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={6}>
                        <Typography.Text strong>Tiền Nợ</Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        {billDetail?.debt
                          ? `${billDetail.debt.toLocaleString()} ₫`
                          : ""}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={6}>
                        <Typography.Text strong>Tổng</Typography.Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell>
                        {billDetail?.total
                          ? `${billDetail.total.toLocaleString()} ₫`
                          : ""}
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </>
                )}
              />

              <Row justify="start" style={{ marginTop: 16 }}>
                <Typography.Text strong>Link Thanh Toán:</Typography.Text>
                {!billDetail?.isPaid && (
                  <AntButton
                    type="link"
                    onClick={() =>
                      window.open(
                        `https://pay.payos.vn/web/${billDetail?.paymentLink?.paymentLinkId}`,
                        "_blank",
                      )
                    }
                    style={{ marginLeft: 8, paddingBottom: 12 }}
                  >
                    NHẤN VÀO ĐÂY
                  </AntButton>
                )}
              </Row>
            </StyledBox>
          </TabPane>
        </Tabs>
      </Box>

      <ModalInsertRenter
        visible={isInsertRenterVisible}
        onCancel={() => setIsInsertRenterVisible(false)}
        roomId={userInfo?.roomId}
        onOk={() => getRoomsDetail(userInfo?.roomId)}
      />

      <ModalUpdateRenter
        visible={isUpdateRenterVisible}
        onCancel={() => setIsUpdateRenterVisible(false)}
        member={selectedMember}
        roomId={userInfo?.roomId}
        onOk={() => getRoomsDetail(userInfo?.roomId)}
      />
    </Box>
  )
}

export default ManageRoom

