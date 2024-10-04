import { Col, Form, Input, Row, Select, Checkbox } from "antd"
import { useEffect, useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import styled from "styled-components"
import ManagerService from "src/services/ManagerService" // Service để gọi API lấy dữ liệu nhà

const { Option } = Select

// Styled component để thêm padding và căn chỉnh layout
const StyledContainer = styled.div`
  padding: 20px;
`

const ModalUpdateHouse = ({ onOk, onCancel, open, houseId }) => {
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

  // Lấy dữ liệu nhà từ API và đổ vào form khi houseId thay đổi
  useEffect(() => {
    if (houseId && open) {
      getHouseDetail()
    }
  }, [houseId, open])

  const getHouseDetail = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getHouseDetail(houseId)
      if (response?.isError) {
        console.error("Error fetching house details:", response.message)
        return
      }
      const houseData = response?.house
      // Set giá trị cho form và tiện ích
      form.setFieldsValue({
        houseName: houseData?.houseName,
        city: houseData?.city,
        district: houseData?.district,
        ward: houseData?.ward,
        address: houseData?.address,
        electricityPrice: houseData?.electricityPrice,
        waterPrice: houseData?.waterPrice,
      })
      setAmenities(houseData?.amenities || {})
    } catch (error) {
      console.error("Error fetching house details:", error)
    } finally {
      setLoading(false)
    }
  }

  // Hàm xử lý cập nhật nhà
  const onUpdate = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const houseData = { ...values, amenities }
      const response = await ManagerService.updateHouse(houseId, houseData)
      if (response?.isError) {
        console.error("Error updating house:", response.message)
        return
      }
      Notice({ msg: "Cập nhật nhà thành công!" })
      onOk && onOk()
      onCancel()
    } catch (error) {
      console.error("Error updating house:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAmenityChange = e => {
    setAmenities(prev => ({ ...prev, [e.target.name]: e.target.checked }))
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
      title="Cập Nhật Nhà"
      footer={renderFooter()}
      width={1024}
      open={open}
      onCancel={onCancel}
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

export default ModalUpdateHouse

