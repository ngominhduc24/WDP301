import { Col, Form, Input, Row, Select, Checkbox } from "antd"
import { useEffect, useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import styled from "styled-components"
import ManagerService from "src/services/ManagerService"

const { Option } = Select

const StyledContainer = styled.div`
  padding: 20px;
`

const ModalUpdateHouse = ({ onOk, onCancel, open, houseData }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [utilities, setUtilities] = useState([]) // State lưu danh sách utilities từ API
  const [selectedUtilities, setSelectedUtilities] = useState([]) // State để lưu tiện ích đã chọn

  // State để lưu trữ giá trị tỉnh/thành phố, quận/huyện và phường/xã đã chọn
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedWard, setSelectedWard] = useState("")

  useEffect(() => {
    fetchUtilities()
  }, [])

  // Cập nhật form và selectedUtilities với dữ liệu nhà khi houseData hoặc open thay đổi
  useEffect(() => {
    if (houseData && open) {
      updateFormWithHouseData()
      setSelectedUtilities(houseData.utilities || [])
    }
  }, [houseData, open])

  // Hàm lấy danh sách utilities từ API
  const fetchUtilities = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getUtilities()
      if (response && response.data) {
        setUtilities(response.data)
      } else {
        console.error("No data found in response:", response)
      }
    } catch (error) {
      console.error("Error fetching utilities:", error)
    } finally {
      setLoading(false)
    }
  }

  // Hàm cập nhật form với dữ liệu chi tiết của nhà hiện tại
  const updateFormWithHouseData = () => {
    // Lấy thông tin vị trí từ dữ liệu
    const { address, city, district, ward } = parseLocation(
      houseData.address || "",
    )

    // Cập nhật form với dữ liệu chi tiết của nhà
    form.setFieldsValue({
      houseName: houseData?.houseName,
      city: city || "",
      district: district || "",
      ward: ward || "",
      address: address || "",
      electricPrice: houseData?.electricPrice || 0,
      waterPrice: houseData?.waterPrice || 0,
    })

    // Cập nhật state với các giá trị đã chọn
    setSelectedProvince(city || "")
    setSelectedDistrict(district || "")
    setSelectedWard(ward || "")
  }

  // Hàm phân tích chuỗi địa chỉ thành các thành phần riêng lẻ
  const parseLocation = address => {
    const parts = address.split(",").map(part => part.trim())
    return {
      address: parts[0] || "",
      ward: parts[1] || "",
      district: parts[2] || "",
      city: parts[3] || "",
    }
  }

  // Hàm xử lý cập nhật nhà
  const onUpdate = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const updatedHouseData = {
        name: values.houseName,
        status: true,
        location: {
          province: selectedProvince || values.city,
          district: selectedDistrict || values.district,
          ward: selectedWard || values.ward,
          detailLocation: values.address,
        },
        electricPrice: Number(values.electricPrice),
        waterPrice: Number(values.waterPrice),
        utilities: selectedUtilities, // Cập nhật với tiện ích đã chọn (dạng id)
        otherUtilities: [], // Các tiện ích khác
      }

      // Gọi API updateHouse với id của nhà và dữ liệu đã cập nhật
      const res = await ManagerService.updateHouse(
        houseData._id,
        updatedHouseData,
      )
      if (res?.isError) return

      Notice({ msg: "Cập nhật nhà thành công!" })
      onOk && onOk()
      onCancel()
    } catch (error) {
      console.error("Error updating house:", error)
    } finally {
      setLoading(false)
    }
  }

  // Xử lý khi chọn/bỏ chọn tiện ích bằng id thay vì name
  const handleAmenityChange = utilityId => {
    setSelectedUtilities(prevUtilities =>
      prevUtilities.includes(utilityId)
        ? prevUtilities.filter(id => id !== utilityId)
        : [...prevUtilities, utilityId],
    )
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
                  <Select
                    placeholder="Chọn Tỉnh/Thành Phố"
                    onChange={setSelectedProvince}
                    value={selectedProvince}
                  >
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
                  <Select
                    placeholder="Chọn Quận/Huyện"
                    onChange={setSelectedDistrict}
                    value={selectedDistrict}
                  >
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
                  <Select
                    placeholder="Chọn Phường/Xã"
                    onChange={setSelectedWard}
                    value={selectedWard}
                  >
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
                  name="electricPrice"
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

              {/* Hiển thị danh sách tiện ích */}
              <Col span={24}>
                <Form.Item label="Tiện Ích">
                  <Row gutter={[16, 16]}>
                    {utilities.length > 0 ? (
                      utilities.map(utility => (
                        <Col span={6} key={utility._id}>
                          <Checkbox
                            checked={selectedUtilities.includes(utility._id)} // So sánh bằng id thay vì name
                            onChange={() => handleAmenityChange(utility._id)} // Sử dụng id thay vì name
                          >
                            {utility.name}
                          </Checkbox>
                        </Col>
                      ))
                    ) : (
                      <div>Không có tiện ích</div>
                    )}
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

