import { Col, Row, Space, Modal } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Button from "src/components/MyButton/Button"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import Notice from "src/components/Notice"
import TableCustom from "src/components/Table/CustomTable"
import SearchAndFilter from "./components/SearchAndFilter"
import SpinCustom from "src/components/Spin"
import ModalInsertHouse from "./components/InsertHouse"
import ModalUpdateHouse from "./components/UpdateHouse"
import ModalViewHouse from "./components/ModalViewHouse"
import ManagerService from "src/services/ManagerService"

const ManageHouse = () => {
  const [houses, setHouses] = useState([])
  const [total, setTotal] = useState(0)
  const [openInsertHouses, setOpenInsertHouses] = useState(false)
  const [openUpdateHouses, setOpenUpdateHouses] = useState(false)
  const [openViewHouses, setOpenViewHouses] = useState(false)
  const [selectedHouse, setSelectedHouse] = useState(null) // State chứa thông tin nhà được chọn
  const [loading, setLoading] = useState(false)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const { userInfo } = useSelector(state => state.appGlobal)
  const [utilityMap, setUtilityMap] = useState({})
  const [utilities, setUtilities] = useState([]) // State lưu các tiện ích chính
  const [otherUtilities, setOtherUtilities] = useState([]) // State lưu các tiện ích khác
  const [pagination, setPagination] = useState({
    PageSize: 10,
    CurrentPage: 1,
    TextSearch: "",
    ApproveStatus: 0,
    Status: 0,
  })

  useEffect(() => {
    getHouses()
  }, [pagination])

  const getHouses = async () => {
    try {
      setLoading(true)
      // Gọi API lấy danh sách utilities và otherUtilities
      const [utilityResponse, otherUtilityResponse] = await Promise.all([
        ManagerService.getUtilities(),
        ManagerService.getOtherUtilities(),
      ])

      // Lưu vào state để sử dụng khi cần
      const utilitiesData = utilityResponse?.data || []
      const otherUtilitiesData = otherUtilityResponse?.data || []

      // Tạo map cho utilities và otherUtilities để hiển thị dễ dàng hơn
      const combinedMap = [...utilitiesData, ...otherUtilitiesData].reduce(
        (map, utility) => {
          map[utility._id] = utility.name // Lưu id và name vào map
          return map
        },
        {},
      )

      setUtilities(utilitiesData)
      setOtherUtilities(otherUtilitiesData)
      setUtilityMap(combinedMap) // Lưu utilityMap vào state để dùng cho render

      // Gọi API lấy danh sách houses
      const houseResponse = await ManagerService.getAllHouses(
        pagination.CurrentPage || 1,
        pagination.PageSize || 10,
      )

      if (houseResponse?.data?.houses) {
        setHouses(transformHouseData(houseResponse.data.houses)) // Truyền dữ liệu nhà vào state
        setTotal(houseResponse.data.houses.length)
      } else {
        console.error("No data found in response", houseResponse)
      }
    } catch (error) {
      console.error("Error fetching houses:", error)
    } finally {
      setLoading(false)
    }
  }

  // Hàm này đảm bảo rằng dữ liệu houseData được lưu trữ với `utilities` và `otherUtilities` là id thay vì name
  const transformHouseData = (houses, utilitiesMap) => {
    return houses.map(house => {
      const houseUtilities = Array.isArray(house.utilities)
        ? house.utilities
        : []
      const otherUtilities = Array.isArray(house.otherUtilities)
        ? house.otherUtilities
        : []

      return {
        _id: house._id,
        houseName: house.name || "Chưa có tên",
        numberOfRooms: house.numberOfRoom || 0,
        address: `${house.location.detailLocation || ""}, ${
          house.location.ward || ""
        }, ${house.location.district || ""}, ${house.location.province || ""}`,
        electricPrice: house.electricPrice
          ? `${house.electricPrice} VND/kWh`
          : "Không có",
        waterPrice: house.waterPrice
          ? `${house.waterPrice} VND/m³`
          : "Không có",
        utilities: houseUtilities.map(u => u._id || u), // Chỉ giữ lại _id
        otherUtilities: otherUtilities.map(u => u._id || u), // Chỉ giữ lại _id
        status: house.status ? "active" : "inactive",
        image: house.image || "https://via.placeholder.com/150",
      }
    })
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
      dataIndex: "electricPrice",
      width: 120,
      key: "electricPrice",
    },
    {
      title: "Tiền nước",
      dataIndex: "waterPrice",
      width: 120,
      key: "waterPrice",
    },
    {
      title: "Tiện ích",
      dataIndex: "utilities",
      width: 300,
      key: "utilities",
      render: (_, record) => {
        // Nếu record.utilities hoặc record.otherUtilities chứa các đối tượng thì cần lấy _id hoặc name từ đó.
        const allUtilities = [
          ...record.utilities.map(u => (typeof u === "object" ? u._id : u)),
          ...record.otherUtilities.map(u =>
            typeof u === "object" ? u._id : u,
          ),
        ]

        // Sau đó lấy tên tiện ích dựa trên utilityMap.
        const utilityNames = allUtilities.map(
          utilityId => utilityMap[utilityId] || utilityId,
        )

        return Array.isArray(utilityNames) && utilityNames.length > 0
          ? utilityNames.join(", ") // Nối các tên tiện ích thành chuỗi
          : "Không có tiện ích"
      },
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
          houseData={{
            ...selectedHouse,
            utilities: selectedHouse.utilities || [],
            otherUtilities: selectedHouse.otherUtilities || [],
          }}
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

