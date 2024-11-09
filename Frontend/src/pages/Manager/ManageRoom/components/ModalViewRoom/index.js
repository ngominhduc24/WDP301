import React, { useEffect, useState } from "react"
import {
  Col,
  Row,
  Modal,
  Tabs,
  Card,
  Avatar,
  message,
  Table,
  Typography,
} from "antd"
import Button from "src/components/MyButton/Button"
import styled from "styled-components"
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons"
import ManagerService from "src/services/ManagerService"
import ModalInsertRenter from "./modal/ModalInsertRenter"
import ModalUpdateRenter from "./modal/ModalUpdateRenter"
import CB1 from "src/components/Modal/CB1"

const { TabPane } = Tabs

const DetailsContainer = styled.div`
  padding: 20px;
  .detail-row {
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 0;
    display: flex;
    justify-content: space-between;
  }
  .label {
    font-weight: 600;
    color: #333;
  }
  .value {
    font-weight: 500;
    color: #555;
  }
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  img {
    border: 2px solid #ddd;
    border-radius: 8px;
    max-width: 100%;
    max-height: 300px;
  }
`

const TenantContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const TenantCard = styled(Card)`
  margin: 20px;
  .ant-card-body {
    display: flex;
    align-items: center;
    padding: 12px 24px;
  }
  .ant-avatar {
    width: 80px;
    height: 80px;
    margin-right: 24px;
  }
  .tenant-info {
    flex: 1;
    .name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .details {
      font-size: 14px;
      color: #666;
    }
  }
  .ant-card-actions {
    margin-left: auto;
  }
`

const ModalViewRoom = ({ open, onCancel, roomId, onOk }) => {
  const [loading, setLoading] = useState(false)
  const [room, setRoom] = useState(null)
  const [isInsertRenterVisible, setIsInsertRenterVisible] = useState(false)
  const [isUpdateRenterVisible, setIsUpdateRenterVisible] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [bills, setBills] = useState([])
  const calculateColumnSpan = numberOfMembers => {
    if (numberOfMembers === 1) return 24
    if (numberOfMembers === 2) return 12
    if (numberOfMembers === 3) return 8
    return 12
  }

  useEffect(() => {
    getRoomsDetail(roomId)
    getBillDetails(roomId)
  }, [roomId])

  const getRoomsDetail = async roomId => {
    try {
      setLoading(true)
      const response = await ManagerService.getRoomDetail(roomId)
      if (response?.data) {
        setRoom(response.data)
      }
    } catch (error) {
      setRoom(null)
    } finally {
      setLoading(false)
    }
  }

  const getBillDetails = async roomId => {
    try {
      setLoading(true)
      const response = await ManagerService.getBillDetail(roomId)
      if (response?.data) {
        setBills(response.data)
      }
    } catch (error) {
      setBills([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddRenter = () => {
    if (room?.members.length >= room?.quantityMember) {
      message.warning("Phòng đã đủ số lượng khách thuê, không thể thêm mới!")
    } else {
      setIsInsertRenterVisible(true)
    }
  }

  const handleEditRenter = member => {
    setSelectedMember(member)
    setIsUpdateRenterVisible(true)
  }

  const handleDeleteRenter = member => {
    CB1({
      title: `Bạn có chắc chắn muốn xóa khách thuê này không?`,
      icon: "warning-usb",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async close => {
        try {
          const payload = { memberId: member._id, cccd: member.cccd }
          await ManagerService.deleteMember(roomId, payload)
          message.success("Xóa khách thuê thành công!")
          getRoomsDetail(roomId)
        } catch (error) {
          message.error("Xóa khách thuê thất bại!")
        }
        close()
      },
    })
  }

  const billColumns = [
    {
      title: "Tên Chi Phí",
      dataIndex: ["base", "name"],
    },
    {
      title: "Đơn Giá",
      dataIndex: "unitPrice",
      render: price => `${price.toLocaleString()} ₫`,
    },
    {
      title: "Số Lượng",
      dataIndex: "totalUnit",
      render: (_, record) =>
        `${record.startUnit} - ${
          record.endUnit
        } (${record.totalUnit.toLocaleString()} ₫)`,
    },
    {
      title: "Thành Tiền",
      dataIndex: "totalUnit",
      render: total => `${total.toLocaleString()} ₫`,
    },
  ]

  return (
    <>
      <Modal
        open={open}
        onCancel={() => {
          onCancel()
          onOk()
        }}
        title="Chi Tiết Phòng"
        width="70vw"
        footer={
          <div className="d-flex justify-content-end">
            <Button
              btntype="third"
              className="ml-8 mt-12 mb-12"
              onClick={() => {
                onCancel()
                onOk()
              }}
            >
              Đóng
            </Button>
          </div>
        }
      >
        <Tabs defaultActiveKey="1" centered>
          {/* Tab Thông Tin Phòng */}
          <TabPane tab="Thông Tin Phòng" key="1">
            <DetailsContainer>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <div className="detail-row">
                    <div className="label">Tầng:</div>
                    <div className="value">{room?.floor || "N/A"}</div>
                  </div>
                  <div className="detail-row">
                    <div className="label">Tên Phòng:</div>
                    <div className="value">{room?.name || "N/A"}</div>
                  </div>
                  <div className="detail-row">
                    <div className="label">Loại:</div>
                    <div className="value">
                      {room?.roomType === "normal" ? "Thường" : "Cao cấp"}
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="label">Diện Tích:</div>
                    <div className="value">{room?.area || "N/A"} m2</div>
                  </div>
                  <div className="detail-row">
                    <div className="label">Số người phù hợp:</div>
                    <div className="value">{room?.quantityMember || "N/A"}</div>
                  </div>
                  <div className="detail-row">
                    <div className="label">Số người đang thuê:</div>
                    <div className="value">{room?.members.length || 0}</div>
                  </div>
                  <div className="detail-row">
                    <div className="label">Đơn giá:</div>
                    <div className="value">
                      {room?.roomPrice.toLocaleString()} VND/tháng
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="label">Tình trạng:</div>
                    <div className="value">
                      {room?.members.length === 0
                        ? "Chưa có khách thuê"
                        : "Đang thuê"}
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <ImageContainer>
                    <img
                      src={
                        room?.image ||
                        "https://res.cloudinary.com/dl7eqr4zd/image/upload/v1731086960/qg1t7hipg2fbwjghiipr.jpg"
                      }
                      alt="house"
                    />
                  </ImageContainer>
                </Col>
              </Row>
            </DetailsContainer>
          </TabPane>

          <TabPane tab="Khách Thuê" key="2">
            <TenantContainer>
              <Row gutter={[16, 16]}>
                {room?.members.length > 0 ? (
                  room.members.map((member, index) => (
                    <Col
                      key={index}
                      span={calculateColumnSpan(room.members.length)}
                    >
                      <TenantCard
                        bordered={false}
                        actions={[
                          <EditOutlined
                            key="edit"
                            onClick={() => handleEditRenter(member)}
                          />,
                          <DeleteOutlined
                            key="delete"
                            onClick={() => handleDeleteRenter(member)}
                          />,
                        ]}
                      >
                        <Avatar
                          size={80}
                          src={
                            member.avatar?.imageData ||
                            "https://via.placeholder.com/80"
                          }
                          icon={!member.avatar && <UserOutlined />}
                        />
                        <div className="tenant-info">
                          <div className="name">{member.name}</div>
                          <div className="details">
                            <div>CCCD: {member.cccd}</div>
                            <div>SDT: {member.phone}</div>
                            <div>
                              Giới tính:{" "}
                              {member.gender === "male" ? "Nam" : "Nữ"}
                            </div>
                            <div>Ngày sinh: {member.dob}</div>
                          </div>
                        </div>
                      </TenantCard>
                    </Col>
                  ))
                ) : (
                  <div style={{ padding: "20px", textAlign: "center" }}>
                    Chưa có khách thuê
                  </div>
                )}
              </Row>
              <Button btntype="primary" onClick={handleAddRenter}>
                Thêm Khách Thuê
              </Button>
            </TenantContainer>
          </TabPane>

          <TabPane tab="Thông Tin Hóa Đơn" key="3">
            <DetailsContainer>
              {bills.length > 0 ? (
                bills.map((billDetail, index) => (
                  <div key={billDetail._id} style={{ marginBottom: "20px" }}>
                    <Row justify="space-between" align="middle">
                      <Typography.Title level={5}>
                        Hóa Đơn Tháng{" "}
                        {new Date(billDetail.createdAt).getMonth() + 1}/
                        {new Date(billDetail.createdAt).getFullYear()}
                      </Typography.Title>
                      <Typography.Text
                        type={billDetail.isPaid ? "success" : "danger"}
                      >
                        {billDetail.isPaid
                          ? "Đã thanh toán"
                          : "Chưa thanh toán"}
                        . Tổng tiền:{" "}
                        {billDetail.total
                          ? `${billDetail.total.toLocaleString()} ₫`
                          : ""}
                      </Typography.Text>
                    </Row>

                    <Table
                      dataSource={billDetail.priceList}
                      columns={billColumns}
                      pagination={false}
                      bordered
                      rowKey="_id"
                      summary={() => (
                        <>
                          <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={3}>
                              <Typography.Text strong>
                                Tiền phòng
                              </Typography.Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              {billDetail.roomPrice
                                ? `${billDetail.roomPrice.toLocaleString()} ₫`
                                : ""}
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                          <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={3}>
                              <Typography.Text strong>Tiền Nợ</Typography.Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              {billDetail.debt
                                ? `${billDetail.debt.toLocaleString()} ₫`
                                : ""}
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                          <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={3}>
                              <Typography.Text strong>Tổng</Typography.Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell>
                              {billDetail.total
                                ? `${billDetail.total.toLocaleString()} ₫`
                                : ""}
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        </>
                      )}
                    />

                    {/* Payment Link */}
                    {!billDetail.isPaid && billDetail.paymentLink && (
                      <Row justify="start" style={{ marginTop: 16 }}>
                        <Typography.Text strong>
                          Link Thanh Toán:
                        </Typography.Text>
                        <Button
                          type="link"
                          onClick={() =>
                            window.open(
                              billDetail.paymentLink.checkoutUrl,
                              "_blank",
                            )
                          }
                          style={{ marginLeft: 8 }}
                        >
                          NHẤN VÀO ĐÂY
                        </Button>
                      </Row>
                    )}
                  </div>
                ))
              ) : (
                <Typography.Text>Không có hóa đơn nào</Typography.Text>
              )}
            </DetailsContainer>
          </TabPane>
        </Tabs>
      </Modal>

      {/* Insert and update renter modals */}
      <ModalInsertRenter
        visible={isInsertRenterVisible}
        onCancel={() => setIsInsertRenterVisible(false)}
        roomId={roomId}
        room={room}
        onOk={() => {
          getRoomsDetail(roomId)
        }}
      />

      <ModalUpdateRenter
        visible={isUpdateRenterVisible}
        onCancel={() => setIsUpdateRenterVisible(false)}
        member={selectedMember}
        roomId={roomId}
        room={room}
        onOk={() => {
          getRoomsDetail(roomId)
        }}
      />
    </>
  )
}

export default ModalViewRoom

