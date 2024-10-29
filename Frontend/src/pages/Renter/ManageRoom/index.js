import React, { useEffect, useState } from "react"
<<<<<<< HEAD
import { Tabs, Modal, Row, Col, Input, Space } from "antd"
import Button from "src/components/MyButton/Button"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import Notice from "src/components/Notice"
import TableCustom from "src/components/Table/CustomTable"
import SearchAndFilter from "./components/SearchAndFilter"
import moment from "moment"
import SpinCustom from "src/components/Spin"
import ManagerService from "src/services/ManagerService"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
// import ChartRooms from "./components/ChartRooms"
import { Select } from "antd"
import ModalViewRoom from "./components/ModalViewRoom"

=======
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
>>>>>>> hungmq
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
<<<<<<< HEAD
  const [visibleModal, setVisibleModal] = useState(false)
  const [tenantName, setTenantName] = useState("")
  const [tenantContact, setTenantContact] = useState("")
  const [rooms, setRooms] = useState([])
  const [total, setTotal] = useState(0)
  const [openInsertRoom, setOpenInsertRoom] = useState(false)
  const [openUpdateRoom, setOpenUpdateRoom] = useState(false)
  const [openViewRoom, setOpenViewRoom] = useState(false)
  const [openPriceConfig, setOpenPriceConfig] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [pagination, setPagination] = useState({
    PageSize: 10,
    CurrentPage: 1,
    TextSearch: "",
    ApproveStatus: 0,
    Status: 0,
  })

  const { Option } = Select

  const dataSample = [
    {
      _id: "1",
      roomName: "Phòng A1",
      floor: 1,
      area: "25m²",
      price: "5,000,000",
      type: "Bình dân",
      status: "available",
      membersCount: 2,
      image: "https://via.placeholder.com/150",
    },
    {
      _id: "2",
      roomName: "Phòng B2",
      floor: 2,
      area: "30m²",
      price: "6,500,000",
      type: "Cao cấp",
      status: "rented",
      membersCount: 0,
      image: "https://via.placeholder.com/150",
    },
    {
      _id: "3",
      roomName: "Phòng C3",
      floor: 3,
      area: "20m²",
      price: "4,000,000",
      type: "Bình dân",
      status: "available",
      membersCount: 4,
      image: "https://via.placeholder.com/150",
    },
  ]

  const houseDataSample = {
    ownerName: "Minh Vu",
    email: "ngominhvu@gmail.com",
    phone: "0123456789",
    status: "active",
    totalRooms: 3,
  }

  const houseData = houseDataSample
  const roomsData = dataSample

  useEffect(() => {
    getRooms()
  }, [pagination])

  const getRooms = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getAllRooms(
        pagination.CurrentPage || 1,
        pagination.PageSize || 10,
      )

      console.log("API Response:", response)

      if (response && response.rooms) {
        setRooms(response.rooms)
        setTotal(response.total)
      } else {
        setRooms(dataSample)
        setTotal(dataSample.length)
      }
    } catch (error) {
      console.error("Error fetching rooms:", error)
      setRooms(dataSample)
      setTotal(dataSample.length)
    } finally {
      setLoading(false)
    }
  }

  const listBtn = record => [
    {
      isEnable: true,
      name: "Xem phòng",
      icon: "eye",
      onClick: () => {
        setSelectedRoom(record)
        setOpenViewRoom(true)
      },
    }
  ]

  const column = [
    {
      title: "STT",
      key: "_id",
      width: 60,
      render: (text, row, idx) => (
        <div className="text-center">
          {idx + 1 + pagination.PageSize * (pagination.CurrentPage - 1)}
        </div>
      ),
    },
    {
      title: "Tên Phòng",
      dataIndex: "roomName",
      width: 200,
      key: "roomName",
    },
    {
      title: "Tầng",
      dataIndex: "floor",
      width: 60,
      key: "floor",
    },
    {
      title: "Diện tích",
      dataIndex: "area",
      width: 120,
      key: "area",
    },
    {
      title: "Loại",
      dataIndex: "type",
      width: 120,
      key: "type",
    },
    {
      title: "Giá thuê",
      dataIndex: "price",
      width: 120,
      key: "price",
      render: text => `${text} VND/tháng`,
    },
    {
      title: "Số người đang thuê",
      dataIndex: "membersCount",
      width: 100,
      key: "membersCount",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 120,
      key: "image",
      render: text => (
        <img
          src={text}
          alt="room"
          style={{ width: 50, height: 50, cursor: "pointer" }}
          onClick={() => {
            setSelectedImage(text)
            setImageModalVisible(true)
          }}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: 150,
      key: "status",
      render: (_, record) => (
        <span
          className={[
            "no-color",
            record.status === "available" ? "green-text" : "red-text",
          ].join(" ")}
        >
          {record.status === "available" ? "Còn trống" : "Đã thuê"}
        </span>
      ),
    },
    {
      title: "Chức năng",
      align: "center",
      key: "Action",
      width: 150,
      render: (_, record) => (
        <Space>
          {listBtn(record).map(
            (i, idx) =>
              !!i?.isEnable && (
                <ButtonCircle
                  key={idx}
                  title={i.name}
                  iconName={i.icon}
                  onClick={i.onClick}
                />
              ),
          )}
        </Space>
      ),
    },
  ]
=======
  const [loading, setLoading] = useState(false)
  const [room, setRoom] = useState(null)
  const userInfo = getStorage(STORAGE.USER_INFO)
  const [isInsertRenterVisible, setIsInsertRenterVisible] = useState(false)
  const [isUpdateRenterVisible, setIsUpdateRenterVisible] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [billDetail, setBillDetail] = useState(null)
>>>>>>> hungmq

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
<<<<<<< HEAD
    <SpinCustom spinning={loading}>
      <div style={{ padding: "20px" }}>
        <div className="title-type-1 d-flex justify-content-space-between align-items-center mt-12 mb-30">
          <span style={{ fontWeight: "bold", marginRight: "8px" }}>
            Lựa Chọn Nhà Trọ:
          </span>
          <div className="d-flex align-items-center">
            <Select
              defaultValue="Nhà 1"
              style={{ width: 150 }}
              onChange={value => console.log("Selected House:", value)}
            >
              <Option value="house1">Nhà 1</Option>
              <Option value="house2">Nhà 2</Option>
            </Select>
          </div>
        </div>

        <SearchAndFilter pagination={pagination} setPagination={setPagination} />

        {/* Thông tin chung về nhà trọ */}
        <Box
          sx={{
            position: "relative",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 0px 10px 2px #888888",
            marginBottom: "20px",
          }}
        >
          <Box
            sx={{ backgroundColor: "#1976d2", alignItems: "center" }}
            className="p-2"
          >
            <p
              className="fs-24"
              style={{
                color: "#fff",
                margin: "4px",
                fontWeight: "bold",
              }}
            >
              Thông Tin Chung
            </p>
          </Box>
          <Box sx={{ display: "flex", padding: "20px" }}>
            <Box sx={{ width: "100%", alignItems: "center" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <b>Tên Chủ Nhà:</b>
                      </TableCell>
                      <TableCell>{houseData.ownerName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <b>Email:</b>
                      </TableCell>
                      <TableCell>{houseData.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <b>Số Điện Thoại:</b>
                      </TableCell>
                      <TableCell>{houseData.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <b>Trạng Thái:</b>
                      </TableCell>
                      <TableCell>
                        {houseData.status === "active"
                          ? "Đang Hoạt Động"
                          : "Dừng Hoạt Động"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <b>Số Lượng Phòng:</b>
                      </TableCell>
                      <TableCell>{houseData.totalRooms}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </Box>

        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin phòng" key="1">
            <Row>
              <Col span={24} className=" mb-20">
                <TableCustom
                  isPrimary
                  rowKey="_id"
                  columns={column}
                  textEmpty="Chưa có phòng nào trong hệ thống"
                  dataSource={rooms}
                  scroll={{ x: "1200px" }}
                  pagination={{
                    hideOnSinglePage: total <= 10,
                    current: pagination?.CurrentPage,
                    pageSize: pagination?.PageSize,
                    responsive: true,
                    total: total,
                    locale: { items_per_page: "" },
                    showSizeChanger: total > 10,
                    onChange: (CurrentPage, PageSize) =>
                      setPagination({
                        ...pagination,
                        CurrentPage,
                        PageSize,
                      }),
                  }}
                />
              </Col>
            </Row>
            {/* Modal hiển thị ảnh */}
            <Modal
              visible={imageModalVisible}
              footer={null}
              onCancel={() => setImageModalVisible(false)}
            >
              <img alt="room" style={{ width: "100%" }} src={selectedImage} />
            </Modal>
            {!!openViewRoom && (
              <ModalViewRoom
                open={openViewRoom}
                onCancel={() => setOpenViewRoom(false)}
                room={selectedRoom}
              />
            )}
          </TabPane>
          <TabPane tab="Khách thuê" key="2">
            <Button type="primary" onClick={handleAddTenant}>
              Thêm khách thuê
            </Button>
            {/* Danh sách khách thuê sẽ hiển thị ở đây */}
            <div style={{ marginTop: "20px" }}>
              <h3>Danh sách khách thuê:</h3>
              <ul>
                <li>Khách thuê 1</li>
                <li>Khách thuê 2</li>
              </ul>
            </div>
          </TabPane>
          <TabPane tab="Thông tin hóa đơn" key="3">
            <div>Thông tin hóa đơn sẽ được hiển thị ở đây.</div>
          </TabPane>
        </Tabs>

        <Modal
          title="Thêm khách thuê"
          visible={visibleModal}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        >
          <div>
            <h3>Thông tin khách thuê</h3>
            <div>
              <Input
                placeholder="Tên khách thuê"
                value={tenantName}
                onChange={e => setTenantName(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <Input
                placeholder="Số điện thoại khách thuê"
                value={tenantContact}
                onChange={e => setTenantContact(e.target.value)}
                style={{ marginBottom: "10px" }}
              />
            </div>
          </div>
        </Modal>
      </div>
    </SpinCustom>
=======
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
>>>>>>> hungmq
  )
}

export default ManageRoom

