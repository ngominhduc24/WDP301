import { Col, Form, Input, Row, Select, Checkbox } from "antd"
import { useEffect, useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import styled from "styled-components"

const { Option } = Select

// Styled component for modal content
const StyledContainer = styled.div`
  padding: 20px; // Thêm padding cho toàn bộ nội dung bên trong modal
  .modal-title {
    margin-bottom: 20px;
  }
  .modal-content {
    padding: 20px; // Thêm padding cho từng nội dung bên trong modal
  }
`

const ModalInsertHouse = ({ onOk, detailInfo, ...props }) => {
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

  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const houseData = { ...values, amenities }
      // const res = await HouseService.addNewHouse(houseData) // Gọi API thêm nhà trọ
      // if (res?.isError) return
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

  const renderFooter = () => (
    <div className="d-flex-end">
      <Button
        btntype="primary"
        className="btn-hover-shadow"
        onClick={onContinue}
      >
        Thêm nhà
      </Button>
    </div>
  )

  return (
    <CustomModal
      title="Thêm Nhà"
      footer={renderFooter()}
      width={1024}
      {...props}
    >
      <SpinCustom spinning={loading}>
        <StyledContainer>
          <Form form={form} layout="vertical" className="modal-content">
            <Row gutter={[16]}>
              <Col span={24}>
                <Form.Item
                  label="Tên Nhà"
                  name="houseName"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên nhà" />
                </Form.Item>
              </Col>

              <Col md={8} xs={24}>
                <Form.Item
                  label="Tỉnh/Thành Phố"
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn Tỉnh/Thành Phố">
                    <Option value="Hà Nội">Hà Nội</Option>
                    <Option value="TP Hồ Chí Minh">TP Hồ Chí Minh</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col md={8} xs={24}>
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn Quận/Huyện">
                    <Option value="Quận 1">Quận 1</Option>
                    <Option value="Quận 2">Quận 2</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col md={8} xs={24}>
                <Form.Item
                  label="Phường/Xã"
                  name="ward"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Select placeholder="Chọn Phường/Xã">
                    <Option value="Phường 1">Phường 1</Option>
                    <Option value="Phường 2">Phường 2</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Địa Chỉ"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Input placeholder="Nhập địa chỉ nhà" />
                </Form.Item>
              </Col>

              <Col md={12} xs={24}>
                <Form.Item
                  label="Tiền Điện Trên 1kwH"
                  name="electricityPrice"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Input placeholder="VNĐ/kwH" />
                </Form.Item>
              </Col>

              <Col md={12} xs={24}>
                <Form.Item
                  label="Tiền Nước Trên 1 Khối"
                  name="waterPrice"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Input placeholder="VNĐ/m³" />
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
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </StyledContainer>
      </SpinCustom>
    </CustomModal>
  )
}

export default ModalInsertHouse

