import React, { useState } from "react"
import { Tabs, Modal, Button, Row, Col, Input } from "antd"
import moment from "moment"

const { TabPane } = Tabs

const ManageRoom = () => {
  const [visibleModal, setVisibleModal] = useState(false)
  const [tenantName, setTenantName] = useState("")
  const [tenantContact, setTenantContact] = useState("")

  const handleAddTenant = () => {
    setVisibleModal(true)
  }

  const handleModalOk = () => {
    // Logic để thêm khách thuê (ví dụ: gửi thông tin đến API)
    console.log("Thêm khách thuê:", tenantName, tenantContact)
    setVisibleModal(false)
    setTenantName("")
    setTenantContact("")
  }

  const handleModalCancel = () => {
    setVisibleModal(false)
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Thông tin phòng</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Thông tin phòng" key="1">
          <Row>
            <Col span={8}>
              <div>
                <strong>Tầng:</strong> 1
              </div>
              <div>
                <strong>Tên phòng:</strong> Phòng 101
              </div>
              <div>
                <strong>Loại:</strong> Cao cấp
              </div>
              <div>
                <strong>Đơn giá:</strong> 1.500.000 VNĐ
              </div>
              <div>
                <strong>Số người phù hợp:</strong> 2
              </div>
              <div>
                <strong>Số người đang thuê:</strong> 0
              </div>
              <div>
                <strong>Tình trạng:</strong> Đã cho thuê
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="Khách thuê" key="2">
          <Button type="primary" onClick={handleAddTenant}>
            Thêm khách thuê
          </Button>
          {/* Danh sách khách thuê sẽ hiển thị ở đây */}
          <div style={{ marginTop: "20px" }}>
            <h3>Danh sách khách thuê:</h3>
            <ul>
              <li>Khách thuê 1</li>
              <li>Khách thuê 2</li>
            </ul>
          </div>
        </TabPane>
        <TabPane tab="Thông tin hóa đơn" key="3">
          <div>Thông tin hóa đơn sẽ được hiển thị ở đây.</div>
        </TabPane>
      </Tabs>

      <Modal
        title="Thêm khách thuê"
        visible={visibleModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <div>
          <h3>Thông tin khách thuê</h3>
          <div>
            <Input
              placeholder="Tên khách thuê"
              value={tenantName}
              onChange={e => setTenantName(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
            <Input
              placeholder="Số điện thoại khách thuê"
              value={tenantContact}
              onChange={e => setTenantContact(e.target.value)}
              style={{ marginBottom: "10px" }}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ManageRoom

