import React, { useEffect, useState } from "react"
import {
  Modal,
  Typography,
  Input,
  Button,
  Table,
  Row,
  Col,
  message,
} from "antd"
import ManagerService from "src/services/ManagerService"

const { TextArea } = Input

const ModalCreateBill = ({ open, onCancel, onOK, roomId }) => {
  const [room, setRoom] = useState(null)
  const [debt, setDebt] = useState(0)
  const [priceList, setPriceList] = useState([])
  const [dateValue, setDateValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formValues, setFormValues] = useState({})
  const [note, setNote] = useState("")
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    if (roomId) {
      fetchRoomData()
      fetchDebt()
    }
  }, [roomId])

  const fetchRoomData = async () => {
    try {
      const roomResponse = await ManagerService.getRoomDetail(roomId)
      const roomData = roomResponse?.data
      setRoom(roomData)
      setPriceList(roomData?.houseId?.priceList || [])
    } catch (error) {
      console.error("Error fetching room data:", error)
    }
  }

  const fetchDebt = async () => {
    try {
      const debtResponse = await ManagerService.getDebt(roomId)
      setDebt(debtResponse?.data?.data?.debt || 0)
    } catch (error) {
      console.error("Error fetching debt:", error)
    }
  }

  useEffect(() => {
    const now = new Date()
    const formattedDate = `${now.getMonth() + 1}/${now.getFullYear()}`
    setDateValue(formattedDate)
  }, [])

  const handleInputChange = (index, field, value) => {
    const key = `${field}-${index}`
    setFormValues(prev => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleAddBill = async () => {
    try {
      setIsSubmitting(true)

      const priceListToAdd = priceList.map((priceItem, index) => ({
        base: priceItem.base,
        unitPrice: priceItem.price,
        startUnit: parseFloat(formValues[`startUnit-${index}`]) || 0,
        endUnit: parseFloat(formValues[`endUnit-${index}`]) || 0,
      }))

      const payload = {
        priceList: priceListToAdd,
        note: note,
      }

      const response = await ManagerService.addBill(roomId, payload)
      if (response?.statusCode === 201) {
        message.success("Thêm hóa đơn thành công!")
        onOK()
        onCancel()
      } else {
        message.error("Thêm hóa đơn thất bại!")
      }
    } catch (error) {
      console.error("Error adding bill:", error)
      message.error("Đã xảy ra lỗi!")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTotal = () => {
    const total = priceList.reduce((acc, item, index) => {
      if (item.base.unit === "đồng/người") {
        const totalUnit = item.price * (room?.members?.length || 0)
        return acc + totalUnit
      } else if (item.base.unit === "đồng/tháng") {
        return acc + item.price
      } else {
        const totalUnit = parseFloat(formValues[`total-${index}`]) || 0
        return acc + totalUnit
      }
    }, 0)
    const finalTotal = total + (room?.roomPrice || 0) + debt
    setTotalValue(finalTotal)
  }

  const handleCalculateTotal = (index, unitPrice) => {
    const startUnit = parseFloat(formValues[`startUnit-${index}`]) || 0
    const endUnit = parseFloat(formValues[`endUnit-${index}`]) || 0
    const total = (endUnit - startUnit) * unitPrice
    const newFormValues = { ...formValues }
    newFormValues[`total-${index}`] = total > 0 ? total : 0
    setFormValues(newFormValues)
  }

  const columns = [
    { title: "STT", dataIndex: "stt", key: "stt" },
    { title: "Loại phí", dataIndex: "name", key: "name" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: text => `${text.toLocaleString()} ₫`,
    },
    { title: "Đơn vị", dataIndex: "unit", key: "unit" },
    {
      title: "Chỉ số đầu",
      dataIndex: "startUnit",
      key: "startUnit",
      render: (_, record, index) => (
        <Input
          type="number"
          placeholder="Chỉ số đầu"
          size="small"
          value={formValues[`startUnit-${index}`] || ""}
          onChange={e => handleInputChange(index, "startUnit", e.target.value)}
          onBlur={() => handleCalculateTotal(index, record.price)}
          disabled={record.unit !== "đồng/khối" && record.unit !== "đồng/kWh"}
        />
      ),
    },
    {
      title: "Chỉ số cuối",
      dataIndex: "endUnit",
      key: "endUnit",
      render: (_, record, index) => (
        <Input
          type="number"
          placeholder="Chỉ số cuối"
          size="small"
          value={formValues[`endUnit-${index}`] || ""}
          onChange={e => handleInputChange(index, "endUnit", e.target.value)}
          onBlur={() => handleCalculateTotal(index, record.price)}
          disabled={
            !(record.unit === "đồng/khối" || record.unit === "đồng/kWh")
          }
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
      render: (_, record, index) => (
        <Input
          type="text"
          size="small"
          disabled
          value={
            record.unit === "đồng/tháng"
              ? `${record.price.toLocaleString()} ₫`
              : record.unit === "đồng/người"
              ? `${(
                  record.price * (room?.members?.length || 0)
                ).toLocaleString()} ₫`
              : `${(formValues[`total-${index}`] || 0).toLocaleString()} ₫`
          }
        />
      ),
    },
  ]

  const dataSource = priceList.map((item, index) => ({
    key: index,
    stt: index + 1,
    name: item?.base?.name,
    price: item.price,
    unit: item?.base?.unit,
  }))

  return (
    <Modal
      title={`Tạo hóa đơn phòng ${room?.name}`}
      visible={open}
      onCancel={onCancel}
      width="70vw"
      footer={
        <div className="d-flex justify-content-end">
          <Button onClick={onCancel}>Đóng</Button>
          <Button onClick={handleTotal} style={{ marginLeft: "8px" }}>
            Tính tổng
          </Button>
          <Button
            type="primary"
            onClick={handleAddBill}
            loading={isSubmitting}
            style={{ marginLeft: "8px" }}
          >
            Lưu
          </Button>
        </div>
      }
    >
      <Row gutter={16}>
        <Col span={12}>
          <Typography.Text strong>Tháng</Typography.Text>
          <Input value={dateValue} disabled style={{ marginBottom: "16px" }} />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={6}>Tiền Phòng</Table.Summary.Cell>
              <Table.Summary.Cell>
                {room?.roomPrice.toLocaleString()} ₫
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={6}>Tiền Nợ</Table.Summary.Cell>
              <Table.Summary.Cell>{debt.toLocaleString()} ₫</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={6}>Tổng tiền</Table.Summary.Cell>
              <Table.Summary.Cell>
                {totalValue.toLocaleString()} ₫
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
      <Typography.Text strong style={{ marginTop: "16px", display: "block" }}>
        Nhập ghi chú
      </Typography.Text>
      <TextArea rows={3} value={note} onChange={e => setNote(e.target.value)} />
    </Modal>
  )
}

export default ModalCreateBill

