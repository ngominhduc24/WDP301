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

const ModalInsertRoom = ({ onOk, detailInfo, ...props }) => {
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
  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const houseData = { ...values, amenities }
      onOk && onOk()
      Notice({ msg: `Thêm nhà thành công!` })
      props?.onCancel()
    } catch (error) {
      console.error("Error adding new house:", error)
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
      <Button
        btntype="primary"
        className="btn-hover-shadow"
        onClick={onContinue}
      >
        Thêm phòng
      </Button>
    </div>
  )

  return (
    <CustomModal
      title="Thêm Phòng"
      footer={renderFooter()}
      width={1024}
      {...props}
    >
      <SpinCustom spinning={loading}>
        <StyledContainer>
          <Tabs defaultActiveKey="1" centered>
            {/* Tab 1: Thêm Phòng */}
            <TabPane tab="Thêm Phòng" key="1">
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

            {/* Tab 2: Thêm Danh Sách Phòng */}
            <TabPane tab="Thêm Danh Sách Phòng" key="2">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item label="Add File">
                    <Upload>
                      {/* <AntButton icon={<UploadOutlined />}>Chọn tệp</AntButton> */}
                    </Upload>
                  </Form.Item>
                </Col>
                <Col
                  span={24}
                  className="d-flex align-items-center justify-content-center"
                >
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

export default ModalInsertRoom

