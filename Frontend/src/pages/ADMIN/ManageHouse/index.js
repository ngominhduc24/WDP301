import { Col, Row, Space, Modal, Switch } from "antd"
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
  const [allHouses, setAllHouses] = useState([])
  const [total, setTotal] = useState(0)
  const [openInsertHouses, setOpenInsertHouses] = useState(false)
  const [openUpdateHouses, setOpenUpdateHouses] = useState(false)
  const [openViewHouses, setOpenViewHouses] = useState(false)
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const { userInfo } = useSelector(state => state.appGlobal)
  const [utilityMap, setUtilityMap] = useState({})
  const [utilities, setUtilities] = useState([])
  const [otherUtilities, setOtherUtilities] = useState([])
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
      const [utilityResponse, otherUtilityResponse] = await Promise.all([
        ManagerService.getUtilities(),
        ManagerService.getOtherUtilities(),
      ])

      const utilitiesData = utilityResponse?.data || []
      const otherUtilitiesData = otherUtilityResponse?.data || []

      const combinedMap = [...utilitiesData, ...otherUtilitiesData].reduce(
        (map, utility) => {
          map[utility._id] = utility.name
          return map
        },
        {},
      )

      setUtilities(utilitiesData)
      setOtherUtilities(otherUtilitiesData)
      setUtilityMap(combinedMap)

      const houseResponse = await ManagerService.getAllHouses()

      if (houseResponse?.data?.houses) {
        const transformedHouses = transformHouseData(houseResponse.data.houses)
        setAllHouses(transformedHouses)
        filterHouses(transformedHouses)
      }
    } catch (error) {
      console.error("Error fetching houses:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterHouses = housesList => {
    if (!Array.isArray(housesList)) {
      housesList = allHouses
    }

    const filteredHouses = housesList.filter(house => {
      if (
        pagination.Status !== 0 &&
        pagination.Status !== (house.status ? 1 : 2)
      ) {
        return false
      }

      if (pagination.TextSearch) {
        const searchTerm = pagination.TextSearch.toLowerCase()
        return (
          house.houseName && house.houseName.toLowerCase().includes(searchTerm)
        )
      }

      return true
    })

    setHouses(filteredHouses)
    setTotal(filteredHouses.length)
  }

  const handleSearch = value => {
    setPagination(prevPagination => ({
      ...prevPagination,
      TextSearch: value,
      CurrentPage: 1,
    }))

    filterHouses(allHouses)
  }

  const handlePaginationChange = (CurrentPage, PageSize) => {
    setPagination({
      ...pagination,
      CurrentPage,
      PageSize,
    })
    getHouses()
  }

  const transformHouseData = houses => {
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
        utilities: houseUtilities.map(u => u._id || u),
        otherUtilities: otherUtilities.map(u => u._id || u),
        status: house.status,
        image: house.avatar?.imageData || "https://via.placeholder.com/150",
      }
    })
  }

  const toggleStatus = async (houseId, isActive) => {
    try {
      await ManagerService.updateHouse(houseId, {
        status: isActive,
      })
      const updatedDataSource = houses.map(house =>
        house._id === houseId ? { ...house, status: isActive } : house,
      )
      setHouses(updatedDataSource)
      Notice({
        isSuccess: true,
        msg: "Cập nhật trạng thái thành công",
      })
    } catch (error) {
      console.error("Error updating house status:", error)
      Notice({
        isSuccess: false,
        msg: "Cập nhật trạng thái thất bại",
      })
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
        const allUtilities = [
          ...record.utilities.map(u => (typeof u === "object" ? u._id : u)),
          ...record.otherUtilities.map(u =>
            typeof u === "object" ? u._id : u,
          ),
        ]

        const utilityNames = allUtilities.map(
          utilityId => utilityMap[utilityId] || utilityId,
        )

        return Array.isArray(utilityNames) && utilityNames.length > 0
          ? utilityNames.join(", ")
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
            record.status ? "blue-text" : "red-text",
          ].join(" ")}
        >
          {record.status ? "Đang hoạt động" : "Dừng Hoạt Động"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Switch
          checked={record.status}
          onChange={(checked, e) => {
            e.stopPropagation()
            toggleStatus(record._id, checked)
          }}
        />
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
      <SearchAndFilter
        pagination={pagination}
        setPagination={setPagination}
        onSearch={handleSearch}
        allHouses={allHouses}
        filterHouses={filterHouses}
      />

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
              current: pagination.CurrentPage,
              pageSize: pagination.PageSize,
              total: total,
              showSizeChanger: total > 10,
              onChange: handlePaginationChange,
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

