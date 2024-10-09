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
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import ReactECharts from "echarts-for-react"
import ModalInsertRoom from "./components/InsertRoom"
import ModalViewRoom from "./components/ModalViewRoom"
import ModalUpdateRoom from "./components/UpdateRoom"
import ModalPriceConfiguration from "./components/ModalPriceConfiguration"
import Accordion from "@mui/material/Accordion"
import AccordionActions from "@mui/material/AccordionActions"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Typography from "@mui/material/Typography"
const ManageRoom = () => {
  const [houses, setHouses] = useState([])
  const [floors, setFloors] = useState([])
  const [houseDetail, setHouseDetail] = useState(null)
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [selectedFloor, setSelectedFloor] = useState(null)
  const [rooms, setRooms] = useState([])
  const [total, setTotal] = useState(0)
  const [expanded, setExpanded] = useState({})
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
    }
  }, [selectedHouse])

  useEffect(() => {
    if (selectedHouse && selectedFloor !== null) {
      getRoomsByHouse(selectedHouse, selectedFloor)
    }
  }, [selectedFloor])

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
        setSelectedFloor(response.data[0] || null)
      } else {
        setFloors([])
        setSelectedFloor(null)
      }
    } catch (error) {
      setFloors([])
      setSelectedFloor(null)
    } finally {
      setLoading(false)
    }
  }

  const getRoomsByHouse = async (houseId, floorId) => {
    try {
      setLoading(true)
      const response = await ManagerService.getRoomFloor(houseId, floorId)
      console.log(response.data)
      if (response?.data) {
        setRooms(response.data)
      } else {
        setRooms([])
      }
    } catch (error) {
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  const handleAccordionChange = index => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [index]: !prevExpanded[index],
    }))
  }

  const renderFloorButtons = () => {
    return floors.map(floor => (
      <Button
        key={floor}
        btntype={floor === selectedFloor ? "primary" : "secondary"}
        style={{ marginRight: "8px" }}
        onClick={() => {
          setSelectedFloor(floor)
          getRoomsByHouse(selectedHouse, floor)
        }}
      >
        Tầng {floor}
      </Button>
    ))
  }

  const renderRoomAccordion = () => {
    return rooms.map((room, index) => (
      <Accordion
        key={index}
        expanded={expanded[index] || false}
        onChange={() => handleAccordionChange(index)}
        sx={{
          marginBottom: "16px",
          "&:not(:last-child)": {
            marginBottom: "16px",
          },
          "&:not(:first-of-type)": {
            marginTop: "16px",
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon style={{ color: "#FFF" }} />}
          sx={{ background: room.status === "Empty" ? "#183446" : "#1abc9c" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Typography sx={{ fontSize: "20px", color: "#FFF" }}>
              Phòng {room.name} -{" "}
              {/* {room.status === "Empty" ? "Đang trống" : "Đã thuê"} */}
              {room?.members?.length === 0 ? "Đang trống" : "Đã thuê"}
            </Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Button variant="contained" color="error">
                Xóa
              </Button>
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Giá</TableCell>
                  <TableCell align="right">Loại phòng</TableCell>
                  <TableCell align="right">Diện tích (m2)</TableCell>
                  <TableCell align="right">Số người tối đa</TableCell>
                  <TableCell align="right">Số người hiện tại</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{room.roomPrice.toLocaleString()} VND</TableCell>
                  <TableCell align="right">
                    {room.roomType === "normal" ? "Bình Thường" : "Cao cấp"}
                  </TableCell>
                  <TableCell align="right">{room.area}</TableCell>
                  <TableCell align="right">{room.quantityMember}</TableCell>
                  <TableCell align="right">{room.members.length}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => {
                setSelectedRoom(room)
                setOpenViewRoom(true)
              }}
            >
              Thông tin phòng
            </Button>
            {room?.members?.length === 0 ? (
              ""
            ) : (
              <Button variant="contained">Tạo hóa đơn</Button>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>
    ))
  }

  const calculateRoomRatio = () => {
    const rentedRooms = rooms.filter(room => room.status !== "Empty").length
    const availableRooms = rooms.filter(room => room.status === "Empty").length
    return { rentedRooms, availableRooms }
  }

  const renderRoomRatioChart = () => {
    const filteredRooms = rooms.filter(room => room.floor === selectedFloor)

    // Tính toán số lượng phòng trống và phòng đã được thuê theo tầng hiện tại
    const rentedRooms = filteredRooms.filter(
      room => room.status !== "Empty",
    ).length
    const availableRooms = filteredRooms.filter(
      room => room.status === "Empty",
    ).length

    // Nếu không có phòng ở tầng hiện tại, hiển thị thông báo
    if (filteredRooms.length === 0) {
      return <p>Không có phòng nào trong tầng này.</p>
    }

    // Cập nhật dữ liệu cho biểu đồ
    const dataSeries = [
      { value: availableRooms, name: "Phòng Trống" },
      { value: rentedRooms, name: "Phòng Đã Được Thuê" },
    ].filter(item => item.value > 0) // Loại bỏ các mục có giá trị 0 để tránh bị trùng lặp nhãn

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} phòng ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: "right", // Đặt legend sang phải để không chồng lên biểu đồ
        top: "20%", // Điều chỉnh vị trí dọc của legend
        itemGap: 20, // Tăng khoảng cách giữa các item của legend
      },
      series: [
        {
          name: "Tỷ Lệ Phòng",
          type: "pie",
          radius: ["40%", "70%"], // Điều chỉnh bán kính của biểu đồ
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {d}%",
            textStyle: {
              fontSize: 14,
            },
          },
          labelLine: {
            show: true,
            length: 20,
            length2: 10,
          },
          data: dataSeries,
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

      {/* Thông tin chung */}
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
                Tỷ Lệ Đầy Phòng Theo Tầng
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
        <Box sx={{ display: "flex", padding: "20px 0px" }}>
          {renderFloorButtons()}
        </Box>
        <Box>{renderRoomAccordion()}</Box>
      </Box>

      {/* Modal hiển thị ảnh, thêm phòng, sửa phòng... */}
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
          visible={openInsertRoom}
          onCancel={() => setOpenInsertRoom(false)}
          houseId={selectedHouse}
          onOk={() => {
            setOpenInsertRoom(false)
            getRoomsByHouse(selectedHouse, selectedFloor)
          }}
        />
      )}

      {!!openViewRoom && (
        <ModalViewRoom
          open={openViewRoom}
          onCancel={() => setOpenViewRoom(false)}
          roomId={selectedRoom?._id}
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

