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
  const [utilities, setUtilities] = useState([]) // State lưu tiện ích chính
  const [otherUtilities, setOtherUtilities] = useState([]) // State lưu tiện ích khác
  const [selectedUtilities, setSelectedUtilities] = useState([]) // Tiện ích đã chọn
  const [selectedOtherUtilities, setSelectedOtherUtilities] = useState([]) // Tiện ích khác đã chọn
  const [electricPrice, setElectricPrice] = useState("") // State lưu tiền điện dạng string
  const [waterPrice, setWaterPrice] = useState("") // State lưu tiền nước dạng string
  const [newAmenity, setNewAmenity] = useState("") // Tiện ích mới
  const [isAddAmenityModalVisible, setIsAddAmenityModalVisible] =
    useState(false)

  // State địa chỉ nhà
  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedWard, setSelectedWard] = useState("")

  useEffect(() => {
    console.log(houseData)
    if (open) {
      fetchAllUtilities()
      if (houseData) {
        updateFormWithHouseData()
      }
    }
  }, [houseData, open])

  // Hàm lấy tất cả tiện ích từ API
  const fetchAllUtilities = async () => {
    setLoading(true)
    try {
      // Gọi API lấy dữ liệu cho cả utilities và otherUtilities
      const [utilitiesResponse, otherUtilitiesResponse] = await Promise.all([
        ManagerService.getUtilities(),
        ManagerService.getOtherUtilities(),
      ])
      setUtilities(utilitiesResponse?.data || []) // Cập nhật state utilities
      setOtherUtilities(otherUtilitiesResponse?.data || []) // Cập nhật state otherUtilities
    } catch (error) {
      console.error("Error fetching utilities:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateFormWithHouseData = () => {
    const { address, city, district, ward } = parseLocation(
      houseData.address || "",
    )
    const parsedElectricPrice = parseFloat(houseData?.electricPrice)
    const parsedWaterPrice = parseFloat(houseData?.waterPrice)

    form.setFieldsValue({
      houseName: houseData?.houseName,
      city: city || "",
      district: district || "",
      ward: ward || "",
      address: address || "",
      electricPrice: parsedElectricPrice || 0,
      waterPrice: parsedWaterPrice || 0,
    })

    setSelectedProvince(city || "")
    setSelectedDistrict(district || "")
    setSelectedWard(ward || "")
    setSelectedUtilities(houseData.utilities || [])
    setSelectedOtherUtilities(houseData.otherUtilities || [])
    setElectricPrice(parsedElectricPrice || 0)
    setWaterPrice(parsedWaterPrice || 0)
  }

  // Phân tích chuỗi địa chỉ thành từng phần riêng lẻ
  const parseLocation = address => {
    const parts = address.split(",").map(part => part.trim())
    return {
      address: parts[0] || "",
      ward: parts[1] || "",
      district: parts[2] || "",
      city: parts[3] || "",
    }
  }

  // Hàm xử lý khi thay đổi tiền điện
  const handleElectricPriceChange = e => {
    const value = e.target.value.replace(/[^0-9]/g, "") // Loại bỏ tất cả ký tự không phải số
    setElectricPrice(value)
    form.setFieldsValue({ electricPrice: value })
  }

  // Hàm xử lý khi thay đổi tiền nước
  const handleWaterPriceChange = e => {
    const value = e.target.value.replace(/[^0-9]/g, "") // Loại bỏ tất cả ký tự không phải số
    setWaterPrice(value)
    form.setFieldsValue({ waterPrice: value })
  }

  const onUpdate = async () => {
    setLoading(true)
    try {
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
        electricPrice: parseFloat(electricPrice) || 0, // Chuyển sang số trước khi truyền đi
        waterPrice: parseFloat(waterPrice) || 0, // Chuyển sang số trước khi truyền đi
        utilities: selectedUtilities, // Truyền utilities đã chọn
        otherUtilities: selectedOtherUtilities, // Truyền otherUtilities đã chọn
      }
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

  // Xử lý khi chọn/bỏ chọn tiện ích
  const handleAmenityChange = (utilityId, isOtherUtility = false) => {
    if (isOtherUtility) {
      setSelectedOtherUtilities(prevUtilities =>
        prevUtilities.includes(utilityId)
          ? prevUtilities.filter(id => id !== utilityId)
          : [...prevUtilities, utilityId],
      )
    } else {
      setSelectedUtilities(prevUtilities =>
        prevUtilities.includes(utilityId)
          ? prevUtilities.filter(id => id !== utilityId)
          : [...prevUtilities, utilityId],
      )
    }
  }

  const handleAddNewAmenity = () => {
    setIsAddAmenityModalVisible(true)
  }

  const handleSaveOtherUtility = async () => {
    setLoading(true)
    try {
      const payload = { name: newAmenity }
      const response = await ManagerService.otherUtilities(payload)
      if (response && !response.isError) {
        Notice({ msg: `Thêm tiện ích "${newAmenity}" thành công!` })
        setNewAmenity("")
        fetchAllUtilities()
      } else {
        Notice({ msg: "Có lỗi xảy ra khi thêm tiện ích mới!", type: "error" })
      }
    } catch (error) {
      console.error("Error adding new utility:", error)
      Notice({ msg: "Có lỗi xảy ra khi thêm tiện ích mới!", type: "error" })
    } finally {
      setLoading(false)
      setIsAddAmenityModalVisible(false)
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
                  <Input
                    value={`${electricPrice} VND/kWh`}
                    onChange={handleElectricPriceChange}
                    placeholder="VNĐ/kwH"
                  />
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
                  <Input
                    value={`${waterPrice} VND/m³`}
                    onChange={handleWaterPriceChange}
                    placeholder="VNĐ/m³"
                  />
                </Form.Item>
              </Col>
              {/* Danh sách tiện ích */}
              <Col span={24}>
                <Form.Item label="Tiện Ích">
                  <Row gutter={[16]}>
                    {/* Hiển thị tiện ích chính */}
                    {utilities.map(utility => (
                      <Col span={6} key={utility._id}>
                        <Checkbox
                          checked={selectedUtilities.includes(utility._id)}
                          onChange={() => handleAmenityChange(utility._id)}
                        >
                          {utility.name}
                        </Checkbox>
                      </Col>
                    ))}
                    {/* Hiển thị tiện ích khác */}
                    {otherUtilities.map(utility => (
                      <Col span={6} key={utility._id}>
                        <Checkbox
                          checked={selectedOtherUtilities.includes(utility._id)}
                          onChange={() =>
                            handleAmenityChange(utility._id, true)
                          }
                        >
                          {utility.name}
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
        </StyledContainer>
        {/* Modal thêm tiện ích */}
        <CustomModal
          title="Thêm tiện ích"
          visible={isAddAmenityModalVisible}
          onOk={handleSaveOtherUtility}
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
      </SpinCustom>
    </CustomModal>
  )
}

export default ModalUpdateHouse

