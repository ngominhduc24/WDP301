import { Col, Row, Space, Tooltip, Modal } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
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
import { Select } from "antd" // Nhớ import Select từ antd
import ModalInsertRoom from "./components/InsertRoom"
import ModalViewRoom from "./components/ModalViewRoom"
import ModalUpdateRoom from "./components/UpdateRoom"
import ModalPriceConfiguration from "./components/ModalPriceConfiguration"
const ManageRoom = () => {
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
  const { userInfo } = useSelector(state => state.appGlobal)
  const [pagination, setPagination] = useState({
    PageSize: 10,
    CurrentPage: 1,
    TextSearch: "",
    ApproveStatus: 0,
    Status: 0,
  })

  const { Option } = Select
  // Biến chứa dữ liệu mẫu (sample data)
  const dataSample = [
    {
      _id: "1",
      roomName: "Phòng A1",
      floor: 1,
      area: "25m²",
      price: "5,000,000",
      status: "available",
      image: "https://via.placeholder.com/150",
    },
    {
      _id: "2",
      roomName: "Phòng B2",
      floor: 2,
      area: "30m²",
      price: "6,500,000",
      status: "rented",
      image: "https://via.placeholder.com/150",
    },
    {
      _id: "3",
      roomName: "Phòng C3",
      floor: 3,
      area: "20m²",
      price: "4,000,000",
      status: "available",
      image: "https://via.placeholder.com/150",
    },
  ]

  const houseDataSample = {
    ownerName: "Mac Hung",
    email: "macquochung@gmail.com",
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
    },
    {
      isEnable: true,
      name: "Chỉnh sửa",
      icon: "edit-green",
      onClick: () => {
        setSelectedRoom(record)
        setOpenUpdateRoom(true)
      },
    },
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
      title: "Giá thuê",
      dataIndex: "price",
      width: 120,
      key: "price",
      render: text => `${text} VND/tháng`,
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

  return (
    <SpinCustom spinning={loading}>
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
          <Button
            btntype="third"
            style={{ marginLeft: "10px" }}
            onClick={() => setOpenInsertRoom(true)}
          >
            Thêm Phòng
          </Button>
          <Button
            btntype="third"
            style={{ marginLeft: "10px" }}
            onClick={() => setOpenPriceConfig(true)}
          >
            Cấu Hình Bảng Giá
          </Button>
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
          <Box sx={{ width: "50%", alignItems: "center" }}>
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
          <Box>
            <p className="fs-18 fw-bold d-flex justify-content-center ml-10">
              Tỷ Lệ Đầy Phòng
            </p>
            {/* <ChartRooms houseData={houseData} roomsData={roomsData} /> */}
          </Box>
        </Box>
      </Box>

      {/* Danh sách phòng */}
      <Box
        sx={{ position: "relative", backgroundColor: "#FFFFFF" }}
        className="mt-3"
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
            Thông Tin Phòng
          </p>
        </Box>

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
      </Box>

      {/* Modal hiển thị ảnh */}
      <Modal
        visible={imageModalVisible}
        footer={null}
        onCancel={() => setImageModalVisible(false)}
      >
        <img alt="room" style={{ width: "100%" }} src={selectedImage} />
      </Modal>
      {!!openInsertRoom && (
        <ModalInsertRoom
          open={openInsertRoom}
          onCancel={() => setOpenInsertRoom(false)}
          // onOk={getHouses}
        />
      )}
      {!!openViewRoom && (
        <ModalViewRoom
          open={openViewRoom}
          onCancel={() => setOpenViewRoom(false)}
          room={selectedRoom}
        />
      )}
      {!!openUpdateRoom && (
        <ModalUpdateRoom
          open={openUpdateRoom}
          onCancel={() => setOpenUpdateRoom(false)}
          // onOk={getHouses}
        />
      )}
      {!!openPriceConfig && (
        <ModalPriceConfiguration
          open={openPriceConfig}
          onCancel={() => setOpenPriceConfig(false)}
          // onOk={getHouses}
        />
      )}
    </SpinCustom>
  )
}

export default ManageRoom
