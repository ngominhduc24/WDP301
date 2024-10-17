import {
  Col,
  Form,
  Input,
  Row,
  Select,
  Checkbox,
  Tabs,
  Upload,
  Button as AntButton,
} from "antd"
import { useEffect, useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import styled from "styled-components"
import ManagerService from "src/services/ManagerService"

const { Option } = Select
const { TabPane } = Tabs

// Styled component for modal content
const StyledContainer = styled.div`
  padding: 20px;
  .modal-title {
    margin-bottom: 20px;
  }
  .modal-content {
    padding: 20px;
  }
`

const ModalUpdateRoom = ({ onOk, open, roomId, ...props }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [amenities, setAmenities] = useState({
    balcony: false,
    attic: false,
    elevator: false,
    waterHeater: false,
    washingMachine: false,
    bed: false,
    television: false,
    wifi: false,
    camera: false,
    privateKitchen: false,
    refrigerator: false,
    WC: false,
    airConditioner: false,
    parking: false,
    internet: false,
    wardrobe: false,
  })
  const [isAddAmenityModalVisible, setIsAddAmenityModalVisible] =
    useState(false)
  const [newAmenity, setNewAmenity] = useState("")

  useEffect(() => {
    if (roomId && open) {
      getRoomDetail()
    }
  }, [roomId, open])

  const getRoomDetail = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getRoomDetail(roomId)
      if (response?.isError) {
        console.error("Error fetching room details:", response.message)
        return
      }
      const roomData = response?.room
      form.setFieldsValue({
        roomName: roomData?.roomName,
        status: roomData?.status,
        roomType: roomData?.roomType,
        numberOfMembers: roomData?.numberOfMembers,
        price: roomData?.price,
        deposit: roomData?.deposit,
        area: roomData?.area,
      })
      setAmenities(roomData?.amenities || {})
    } catch (error) {
      console.error("Error fetching room details:", error)
    } finally {
      setLoading(false)
    }
  }

  const onUpdate = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const roomData = { ...values, amenities }
      const response = await ManagerService.updateRoom(roomId, roomData)
      if (response?.isError) {
        console.error("Error updating room:", response.message)
        return
      }
      Notice({ msg: "Cập nhật phòng thành công!" })
      onOk && onOk()
      props?.onCancel()
    } catch (error) {
      console.error("Error updating room:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAmenityChange = e => {
    setAmenities(prev => ({ ...prev, [e.target.name]: e.target.checked }))
  }

  const handleAddNewAmenity = () => {
    setIsAddAmenityModalVisible(true)
  }

  const handleSaveNewAmenity = () => {
    if (newAmenity) {
      setAmenities(prev => ({ ...prev, [newAmenity]: false }))
      setIsAddAmenityModalVisible(false)
      setNewAmenity("")
    }
  }

  const renderFooter = () => (
    <div className="d-flex-end">
      <Button btntype="primary" className="btn-hover-shadow" onClick={onUpdate}>
        Lưu
      </Button>
    </div>
  )

  return (
    <CustomModal
      title="Cập Nhật Phòng"
      footer={renderFooter()}
      width={1024}
      open={open}
      {...props}
    >
      <SpinCustom spinning={loading}>
        <StyledContainer>
          <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Cập Nhật Phòng" key="1">
              <Form form={form} layout="vertical" className="modal-content">
                <Row gutter={[16]}>
                  <Col span={24}>
                    <Form.Item
                      label="Tên Phòng"
                      name="roomName"
                      rules={[
                        {
                          required: true,
                          message: "Thông tin không được để trống",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên phòng" />
                    </Form.Item>
                  </Col>

                  <Col md={8} xs={24}>
                    <Form.Item label="Trạng Thái" name="status">
                      <Select placeholder="Chọn Trạng Thái">
                        <Option value="available">Còn trống</Option>
                        <Option value="rented">Đã thuê</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col md={8} xs={24}>
                    <Form.Item label="Loại Phòng" name="roomType">
                      <Select placeholder="Chọn Loại Phòng">
                        <Option value="standard">Tiêu chuẩn</Option>
                        <Option value="deluxe">Cao cấp</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col md={8} xs={24}>
                    <Form.Item
                      label="Số Lượng Thành Viên"
                      name="numberOfMembers"
                      rules={[
                        {
                          required: true,
                          message: "Thông tin không được để trống",
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        placeholder="Nhập số lượng thành viên"
                      />
                    </Form.Item>
                  </Col>

                  <Col md={8} xs={24}>
                    <Form.Item
                      label="Tiền Phòng"
                      name="price"
                      rules={[
                        {
                          required: true,
                          message: "Thông tin không được để trống",
                        },
                      ]}
                    >
                      <Input placeholder="VNĐ/tháng" />
                    </Form.Item>
                  </Col>

                  <Col md={8} xs={24}>
                    <Form.Item
                      label="Tiền Cọc"
                      name="deposit"
                      rules={[
                        {
                          required: true,
                          message: "Thông tin không được để trống",
                        },
                      ]}
                    >
                      <Input placeholder="VNĐ" />
                    </Form.Item>
                  </Col>

                  <Col md={8} xs={24}>
                    <Form.Item
                      label="Diện Tích"
                      name="area"
                      rules={[
                        {
                          required: true,
                          message: "Thông tin không được để trống",
                        },
                      ]}
                    >
                      <Input placeholder="m²" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item label="Tiện Ích">
                      <Row gutter={[16, 16]}>
                        {Object.keys(amenities).map(amenity => (
                          <Col span={6} key={amenity}>
                            <Checkbox
                              name={amenity}
                              checked={amenities[amenity]}
                              onChange={handleAmenityChange}
                            >
                              {amenity}
                            </Checkbox>
                          </Col>
                        ))}
                      </Row>
                      <Button
                        btntype="primary"
                        className="mt-8"
                        onClick={handleAddNewAmenity}
                      >
                        Thêm tiện ích
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            <TabPane tab="Cập Nhật Danh Sách Tiện Ích" key="2">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item label="Add File">
                    <Upload></Upload>
                  </Form.Item>
                </Col>
                <Col span={24} className="d-flex justify-content-center">
                  <AntButton type="primary">Upload</AntButton>
                  <AntButton type="default" style={{ marginLeft: "16px" }}>
                    Download Template
                  </AntButton>
                </Col>
              </Row>
            </TabPane>
          </Tabs>

          <CustomModal
            title="Thêm tiện ích"
            visible={isAddAmenityModalVisible}
            onOk={handleSaveNewAmenity}
            onCancel={() => setIsAddAmenityModalVisible(false)}
            okText="Thêm"
            cancelText="Hủy"
          >
            <Form layout="vertical">
              <Form.Item label="Tên Tiện Ích *">
                <Input
                  value={newAmenity}
                  onChange={e => setNewAmenity(e.target.value)}
                  placeholder="Nhập tên tiện ích"
                />
              </Form.Item>
            </Form>
          </CustomModal>
        </StyledContainer>
      </SpinCustom>
    </CustomModal>
  )
}

export default ModalUpdateRoom

