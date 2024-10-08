import { Col, Row, Space, Tooltip, Modal, Select } from "antd"
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
import ReactECharts from "echarts-for-react"
import ModalInsertRoom from "./components/InsertRoom"
import ModalViewRoom from "./components/ModalViewRoom"
import ModalUpdateRoom from "./components/UpdateRoom"
import ModalPriceConfiguration from "./components/ModalPriceConfiguration"

const ManageRoom = () => {
  const [houses, setHouses] = useState([])
  const [floors, setFloors] = useState([])
  const [houseDetail, setHouseDetail] = useState(null)
  const [selectedHouse, setSelectedHouse] = useState(null)
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
  const { userInfo } = useSelector(state => state.appGlobal)
  const [pagination, setPagination] = useState({
    PageSize: 10,
    CurrentPage: 1,
    TextSearch: "",
    ApproveStatus: 0,
    Status: 0,
  })

  const { Option } = Select

  useEffect(() => {
    getAllHouses()
  }, [])

  useEffect(() => {
    if (selectedHouse) {
      getHouseByHouseId(selectedHouse)
      getFloorByHouseId(selectedHouse)
      getRoomsByHouse(selectedHouse)
    }
  }, [selectedHouse, pagination])

  const getAllHouses = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getAllHouses()
      const housesData = response?.data?.houses || []
      if (housesData.length > 0) {
        setHouses(housesData)
        setSelectedHouse(housesData[0]?._id)
      } else {
        setHouses([])
      }
    } catch (error) {
      setHouses([])
    } finally {
      setLoading(false)
    }
  }

  const getHouseByHouseId = async houseId => {
    try {
      setLoading(true)
      const response = await ManagerService.getHouseDetail(houseId)
      if (response?.data) {
        setHouseDetail(response.data)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const getFloorByHouseId = async houseId => {
    try {
      setLoading(true)
      const response = await ManagerService.getHouseFloors(houseId)
      if (response?.data) {
        setFloors(response.data)
      } else {
        setFloors([])
      }
    } catch (error) {
      setFloors([])
    } finally {
      setLoading(false)
    }
  }

  const getRoomByFloor = async (houseId, floorId) => {
    try {
      setLoading(true)
      const response = await ManagerService.getRoomFloor(houseId, floorId)
      if (response?.data) {
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const getRoomsByHouse = async houseId => {
    try {
      setLoading(true)
      const response = await ManagerService.getAllRoomInHouse(houseId)
      if (response?.data) {
        setRooms(response.data)
        setTotal(response.total)
      } else {
        setRooms([])
        setTotal(0)
      }
    } catch (error) {
      setRooms([])
      setTotal(0)
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

  // Hàm này để tính toán số lượng phòng trống và phòng đã thuê
  const calculateRoomRatio = () => {
    const rentedRooms = rooms.filter(room => room.status !== "Empty").length
    const availableRooms = rooms.filter(room => room.status === "Empty").length
    return { rentedRooms, availableRooms }
  }

  // Hàm để render biểu đồ tỷ lệ phòng
  const renderRoomRatioChart = () => {
    // Tính toán số lượng phòng trống và phòng đã thuê
    const { rentedRooms, availableRooms } = calculateRoomRatio()
    const totalRooms = rentedRooms + availableRooms

    // Cấu hình biểu đồ
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} phòng ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "left",
        data: ["Phòng Trống", "Phòng Đã Được Thuê"],
      },
      series: [
        {
          name: "Tỷ Lệ Phòng",
          type: "pie",
          radius: ["50%", "70%"], // Tăng bán kính của biểu đồ để làm to biểu đồ
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {d}%", // Định dạng nhãn hiển thị
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: availableRooms, name: "Phòng Trống" },
            { value: rentedRooms, name: "Phòng Đã Được Thuê" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    }

    return (
      <div style={{ width: "400px", height: "400px" }}>
        {" "}
        {/* Điều chỉnh kích thước của biểu đồ */}
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
        />
      </div>
    )
  }

  return (
    <SpinCustom spinning={loading}>
      <div className="title-type-1 d-flex justify-content-space-between align-items-center mt-12 mb-30">
        <span style={{ fontWeight: "bold", marginRight: "8px" }}>
          Lựa Chọn Nhà Trọ:
        </span>
        <div className="d-flex align-items-center">
          <Select
            value={selectedHouse}
            style={{ width: 150 }}
            onChange={value => setSelectedHouse(value)}
          >
            {houses.map(house => (
              <Option key={house._id} value={house._id}>
                {house.name}
              </Option>
            ))}
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

      <Box
        sx={{
          position: "relative",
          backgroundColor: "#FFFFFF",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{ backgroundColor: "#1976d2", alignItems: "center" }}
          className="p-2"
        >
          <p
            className="fs-24"
            style={{ color: "#fff", margin: "4px", fontWeight: "bold" }}
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
                    <TableCell>{houseDetail?.hostId?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Trạng Thái:</b>
                    </TableCell>
                    <TableCell>
                      {houseDetail?.status
                        ? "Đang Hoạt Động"
                        : "Dừng Hoạt Động"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Email:</b>
                    </TableCell>
                    <TableCell>{houseDetail?.hostId?.email || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Số Điện Thoại:</b>
                    </TableCell>
                    <TableCell>{houseDetail?.hostId?.phone || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <b>Số Lượng Phòng:</b>
                    </TableCell>
                    <TableCell>{houseDetail?.numberOfRoom || "N/A"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box
            sx={{
              width: "50%",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div>
              <p className="fs-18 fw-bold d-flex justify-content-center">
                Tỷ Lệ Đầy Phòng
              </p>
              {renderRoomRatioChart()}
            </div>
          </Box>
        </Box>
      </Box>

      {/* Thông tin chi tiết của phòng */}
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
            style={{ color: "#fff", margin: "4px", fontWeight: "bold" }}
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
        />
      )}
      {!!openPriceConfig && (
        <ModalPriceConfiguration
          open={openPriceConfig}
          onCancel={() => setOpenPriceConfig(false)}
        />
      )}
    </SpinCustom>
  )
}

export default ManageRoom

