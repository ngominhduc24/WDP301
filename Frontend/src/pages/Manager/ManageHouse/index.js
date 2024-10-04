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
import ModalInsertHouse from "./components/InsertHouse"
import ModalUpdateHouse from "./components/UpdateHouse"
import ModalViewHouse from "./components/ModalViewHouse"

const ManageHouse = () => {
  const [houses, setHouses] = useState([])
  const [total, setTotal] = useState(0)
  const [openInsertHouses, setOpenInsertHouses] = useState(false)
  const [openUpdateHouses, setOpenUpdateHouses] = useState(false)
  const [openViewHouses, setOpenViewHouses] = useState(false)
  const [selectedHouse, setSelectedHouse] = useState(null)
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

  // Biến chứa dữ liệu mẫu (sample data)
  const dataSample = [
    {
      _id: "1",
      houseName: "Căn hộ Vinhome",
      numberOfRooms: 3,
      address: "72 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh",
      electricityPrice: "3000",
      waterPrice: "15000",
      amenities: {
        balcony: true,
        wifi: true,
        camera: false,
        airConditioner: true,
      },
      status: "active",
      image: "https://via.placeholder.com/150",
    },
    {
      _id: "2",
      houseName: "Chung cư Tân Bình",
      numberOfRooms: 2,
      address: "123 Lý Thường Kiệt, Quận Tân Bình, TP. Hồ Chí Minh",
      electricityPrice: "2500",
      waterPrice: "13000",
      amenities: {
        balcony: false,
        wifi: true,
        camera: true,
        airConditioner: false,
      },
      status: "inactive",
      image: "https://via.placeholder.com/150",
    },
    {
      _id: "3",
      houseName: "Biệt thự Thảo Điền",
      numberOfRooms: 4,
      address: "456 Thảo Điền, Quận 2, TP. Hồ Chí Minh",
      electricityPrice: "3500",
      waterPrice: "20000",
      amenities: {
        balcony: true,
        wifi: false,
        camera: true,
        airConditioner: true,
      },
      status: "active",
      image: "https://via.placeholder.com/150",
    },
  ]

  useEffect(() => {
    getHouses()
  }, [pagination])

  const getHouses = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getAllHouses(
        pagination.CurrentPage || 1,
        pagination.PageSize || 10,
      )

      console.log("API Response:", response)

      // Sử dụng dữ liệu từ API nếu có, nếu không thì dùng dataSample
      if (response && response.houses) {
        setHouses(response.houses)
        setTotal(response.total)
      } else {
        setHouses(dataSample) // Dùng dữ liệu mẫu nếu không có dữ liệu từ API
        setTotal(dataSample.length)
      }
    } catch (error) {
      console.error("Error fetching houses:", error)
      // Nếu xảy ra lỗi khi gọi API, hiển thị dữ liệu mẫu
      setHouses(dataSample)
      setTotal(dataSample.length)
    } finally {
      setLoading(false)
    }
  }

  const listBtn = record => [
    {
      isEnable: true,
      name: "Xem nhà",
      icon: "eye",
      onClick: () => {
        setSelectedHouse(record)
        setOpenViewHouses(true)
      },
    },
    {
      isEnable: true,
      name: "Chỉnh sửa",
      icon: "edit-green",
      onClick: () => {
        setSelectedHouse(record)
        setOpenUpdateHouses(true)
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
      title: "Tên Nhà ",
      dataIndex: "houseName",
      width: 200,
      key: "houseName",
    },
    {
      title: "Số phòng",
      dataIndex: "numberOfRooms",
      width: 60,
      key: "numberOfRooms",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 300,
      key: "address",
    },
    {
      title: "Tiền điện",
      dataIndex: "electricityPrice",
      width: 120,
      key: "electricityPrice",
      render: text => `${text} VND/kwH`,
    },
    {
      title: "Tiền nước",
      dataIndex: "waterPrice",
      width: 120,
      key: "waterPrice",
      render: text => `${text} VND/m³`,
    },
    {
      title: "Tiện ích",
      dataIndex: "amenities",
      width: 300,
      key: "amenities",
      render: amenities =>
        amenities
          ? Object.keys(amenities)
              .filter(key => amenities[key])
              .map(key => (
                <span key={key} style={{ marginRight: 8 }}>
                  {key}
                </span>
              ))
          : "Không có tiện ích",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      width: 120,
      key: "image",
      render: text => (
        <img
          src={text}
          alt="house"
          style={{ width: 50, height: 50, cursor: "pointer" }}
          onClick={() => {
            setSelectedImage(text)
            setImageModalVisible(true)
          }}
        />
      ),
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "status",
      align: "center",
      width: 150,
      key: "status",
      render: (_, record) => (
        <span
          className={[
            "no-color",
            record.status === "active" ? "blue-text" : "red-text",
          ].join(" ")}
        >
          {record.status === "active" ? "Đang hoạt động" : "Dừng Hoạt Động"}
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
        <div>Quản lý danh sách nhà</div>
        <div>
          <Button btntype="third" onClick={() => setOpenInsertHouses(true)}>
            Thêm mới
          </Button>
        </div>
      </div>
      <SearchAndFilter pagination={pagination} setPagination={setPagination} />
      <Row>
        <Col span={24} className="mt-30 mb-20">
          <TableCustom
            isPrimary
            rowKey="_id"
            columns={column}
            textEmpty="Chưa có nhà nào trong hệ thống"
            dataSource={houses}
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
      <Modal
        visible={imageModalVisible}
        footer={null}
        onCancel={() => setImageModalVisible(false)}
      >
        <img alt="house" style={{ width: "100%" }} src={selectedImage} />
      </Modal>
      {!!openInsertHouses && (
        <ModalInsertHouse
          open={openInsertHouses}
          onCancel={() => setOpenInsertHouses(false)}
          onOk={getHouses}
        />
      )}

      {!!openUpdateHouses && (
        <ModalUpdateHouse
          open={openUpdateHouses}
          onCancel={() => setOpenUpdateHouses(false)}
          onOk={getHouses}
        />
      )}
      {!!openViewHouses && (
        <ModalViewHouse
          open={openViewHouses}
          onCancel={() => setOpenViewHouses(false)}
          house={selectedHouse}
        />
      )}
    </SpinCustom>
  )
}

export default ManageHouse

