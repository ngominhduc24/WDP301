import React, { useEffect, useState } from "react"
import {
  Table,
  Select,
  Spin,
  Row,
  Col,
  DatePicker,
  Space,
  Typography,
  message,
  Button,
  Tag,
} from "antd"
import ManagerService from "src/services/ManagerService"
import dayjs from "dayjs"
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons"
import TableCustom from "src/components/TableCustom"
import ModalCreateBill from "./modal/ModalCreateBill"
import ModalViewBill from "./modal/ModalViewBilld"
import CB1 from "src/components/Modal/CB1"
const { Option } = Select

const ManageBill = () => {
  const [houses, setHouses] = useState([])
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MM-YYYY"))
  const [roomBills, setRoomBills] = useState([])
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [viewBill, setViewBill] = useState(false)
  const [currentRoomId, setCurrentRoomId] = useState(null)
  const [currentBillId, setCurrentBillId] = useState(null)

  useEffect(() => {
    getAllHouses()
  }, [])

  const getAllHouses = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getAllHouses()
      const housesData = response?.data?.houses || []
      if (housesData.length > 0) {
        setHouses(housesData)
        setSelectedHouse(housesData[0]?._id)
      }
    } catch (error) {
      message.error("Lỗi khi lấy danh sách nhà!")
    } finally {
      setLoading(false)
    }
  }

  const getRoomWithBill = async (houseId, month) => {
    try {
      setLoading(true)
      const response = await ManagerService.getRoomWithBill(houseId, month)
      setRoomBills(response?.data || [])
    } catch (error) {
      message.error("Lỗi khi lấy danh sách hóa đơn!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedHouse && selectedMonth) {
      getRoomWithBill(selectedHouse, selectedMonth)
    }
  }, [selectedHouse, selectedMonth])

  const handleCashPayment = billId => {
    CB1({
      title: `Bạn có chắc chắn phòng này đã thanh toán bằng tiền mặt`,
      icon: "warning-usb",
      okText: "Có",
      cancelText: "Không",
      onOk: async close => {
        try {
          const response = await ManagerService.paymentByCash(billId, {
            paymentMethod: "Cash",
          })
          if (response?.statusCode === 200) {
            message.success("Đã thanh toán thành công!")
            getRoomWithBill(selectedHouse, selectedMonth)
          } else {
            message.error("Lỗi khi cập nhật trạng thái thanh toán!")
          }
        } catch (error) {
          message.error("Đã xảy ra lỗi!")
        } finally {
          close()
        }
      },
    })
  }

  const openCreateBillModal = roomId => {
    setCurrentRoomId(roomId)
    setOpenModal(true)
  }

  const openViewBillModal = billId => {
    if (!billId) {
      return
    }
    console.log("Selected Bill ID:", billId)
    setCurrentBillId(billId)
    setViewBill(true)
  }

  const renderAmount = amount => {
    return amount ? `${amount.toLocaleString()} ₫` : ""
  }

  const renderBillStatus = bill => {
    return bill ? (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Đã tạo hóa đơn
      </Tag>
    ) : (
      <Tag icon={<ExclamationCircleOutlined />} color="error">
        Chưa tạo hóa đơn
      </Tag>
    )
  }

  const renderPaymentStatus = bill => {
    return bill && bill.isPaid ? (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Đã thanh toán
      </Tag>
    ) : (
      <Tag icon={<ExclamationCircleOutlined />} color="error">
        Chưa thanh toán
      </Tag>
    )
  }

  const columns = [
    { title: "STT", key: "stt", render: (value, record, index) => index + 1 },
    { title: "Phòng", dataIndex: ["room", "name"], key: "roomName" },
    {
      title: "Số người đang ở",
      dataIndex: ["room", "quantityMember"],
      key: "quantityMember",
    },
    {
      title: "Thành tiền tháng này",
      dataIndex: ["bill", "total"],
      key: "totalAmount",
      render: renderAmount,
    },
    {
      title: "Đã tạo hoá đơn",
      dataIndex: "bill",
      key: "billStatus",
      render: renderBillStatus,
    },
    {
      title: "Đã thanh toán",
      dataIndex: "bill",
      key: "paymentStatus",
      render: renderPaymentStatus,
    },
    {
      title: "Hình thức",
      dataIndex: ["bill", "paymentMethod"],
      key: "paymentMethod",
      render: paymentMethod => paymentMethod || "Chưa thanh toán",
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            disabled={!!record.bill}
            onClick={() => openCreateBillModal(record.room._id)}
          >
            Tạo Hoá Đơn
          </Button>
          <Button
            type="link"
            disabled={!record.bill}
            onClick={() => openViewBillModal(record.bill._id)}
          >
            Xem Chi Tiết
          </Button>
          <Button
            type="default"
            disabled={!record.bill || record.bill.isPaid}
            onClick={() => handleCashPayment(record.bill._id)}
          >
            Thanh Toán Bằng Tiền Mặt
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Spin spinning={loading}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Select
            value={selectedHouse}
            onChange={value => setSelectedHouse(value)}
            style={{ width: "100%" }}
          >
            {houses.map(house => (
              <Option key={house._id} value={house._id}>
                {house.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <DatePicker
            picker="month"
            value={dayjs(selectedMonth, "MM-YYYY")}
            onChange={date => setSelectedMonth(date.format("MM-YYYY"))}
            style={{ width: "100%" }}
          />
        </Col>
      </Row>
      <TableCustom
        dataSource={roomBills}
        columns={columns}
        rowKey={record => record.room._id}
        pagination={{ pageSize: 10 }}
      />
      <ModalViewBill
        open={viewBill}
        onCancel={() => setViewBill(false)}
        billId={currentBillId}
      />
      <ModalCreateBill
        open={openModal}
        onCancel={() => setOpenModal(false)}
        roomId={currentRoomId}
        onOk={() => {
          setOpenModal(false)
          getRoomWithBill(selectedHouse, selectedMonth)
        }}
      />
    </Spin>
  )
}

export default ManageBill

