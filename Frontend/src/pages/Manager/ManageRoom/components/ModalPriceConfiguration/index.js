import { Modal, Table, Input, Form, Row, Col } from "antd"
import { useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"

const ModalPriceConfiguration = ({ open, onCancel, onOk }) => {
  const [dataSource, setDataSource] = useState([
    {
      key: "1",
      feeType: "Tiền nước theo khối",
      price: "1.000 ₫",
      unit: "đồng/khối",
    },
    {
      key: "2",
      feeType: "Tiền điện theo số (kWh)",
      price: "1.000 ₫",
      unit: "đồng/kWh",
    },
  ])

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "10%",
      align: "center",
    },
    {
      title: "Loại Phí",
      dataIndex: "feeType",
      key: "feeType",
      align: "center",
    },
    {
      title: "Đơn Giá",
      dataIndex: "price",
      key: "price",
      align: "center",
    },
    {
      title: "Đơn Vị",
      dataIndex: "unit",
      key: "unit",
      align: "center",
    },
    {
      title: "Thao Tác",
      key: "action",
      width: "15%",
      align: "center",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.key)}>
          XÓA
        </Button>
      ),
    },
  ]

  const handleDelete = key => {
    setDataSource(prevData => prevData.filter(item => item.key !== key))
  }

  const handleAdd = () => {
    const newKey = (dataSource.length + 1).toString()
    setDataSource(prevData => [
      ...prevData,
      {
        key: newKey,
        feeType: "",
        price: "",
        unit: "",
      },
    ])
  }

  return (
    <CustomModal
      title="Cấu Hình Bảng Giá"
      visible={open}
      onCancel={onCancel}
      width={800}
      footer={
        <div className="d-flex justify-content-between">
          <Button className="mr-8" onClick={onCancel}>
            Đóng
          </Button>

          <Button type="primary" onClick={onOk}>
            Lưu
          </Button>
        </div>
      }
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        footer={() => (
          <Button type="primary" onClick={handleAdd}>
            Thêm Kinh Phí
          </Button>
        )}
      />
    </CustomModal>
  )
}

export default ModalPriceConfiguration

