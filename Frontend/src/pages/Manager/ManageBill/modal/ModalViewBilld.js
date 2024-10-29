import React, { useEffect, useState } from "react"
import { Modal, Typography, Button, Table, Row, Col, message } from "antd"
import ManagerService from "src/services/ManagerService"

const ModalViewBill = ({ open, onCancel, billId }) => {
  const [billDetail, setBillDetail] = useState(null)

  useEffect(() => {
    console.log(billId)
    fetchBillDetail(billId)
  }, [billId])

  const fetchBillDetail = async billId => {
    console.log("hello")
    try {
      const response = await ManagerService.getDetailBill(billId)
      if (response?.statusCode === 200) {
        setBillDetail(response.data)
      } else {
        message.error("Lỗi khi lấy chi tiết hóa đơn!")
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi!")
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
      render: value => (value ? `${value.toLocaleString()} ₫` : ""),
    },
    { title: "Đơn vị", dataIndex: ["base", "unit"], key: "unit" },
    { title: "Chỉ số đầu", dataIndex: "startUnit", key: "startUnit" },
    { title: "Chỉ số cuối", dataIndex: "endUnit", key: "endUnit" },
    {
      title: "Thành tiền",
      dataIndex: "totalUnit",
      key: "totalUnit",
      render: value => (value ? `${value.toLocaleString()} ₫` : ""),
    },
  ]

  return (
    <Modal
      title={`Phòng ${billDetail?.roomId?.name || ""}`}
      visible={open}
      onCancel={onCancel}
      footer={null}
      width="70vw"
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Typography.Title level={4}>
          Tháng{" "}
          {billDetail ? new Date(billDetail.createdAt).getMonth() + 1 : ""}/
          {billDetail ? new Date(billDetail.createdAt).getFullYear() : ""}
        </Typography.Title>
        <Typography.Text type={billDetail?.isPaid ? "success" : "danger"}>
          {billDetail?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}. Tổng tiền:{" "}
          {billDetail?.total ? `${billDetail.total.toLocaleString()} ₫` : ""}
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
                <Typography.Text strong>Tiền phòng/tháng</Typography.Text>
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
          <Button
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
          </Button>
        )}
      </Row>
    </Modal>
  )
}

export default ModalViewBill
