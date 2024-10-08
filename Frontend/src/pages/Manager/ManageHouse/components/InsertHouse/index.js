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
  .modal-title {
    margin-bottom: 20px;
  }
  .modal-content {
    padding: 20px;
  }
`

const ModalInsertHouse = ({ onOk, detailInfo, ...props }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [utilities, setUtilities] = useState([]) // Chứa danh sách tiện ích chính
  const [otherUtilities, setOtherUtilities] = useState([]) // Chứa danh sách tiện ích khác
  const [amenities, setAmenities] = useState([]) // Chứa danh sách tiện ích chính đã chọn
  const [selectedOtherUtilities, setSelectedOtherUtilities] = useState([]) // Chứa danh sách tiện ích khác đã chọn
  const [newAmenity, setNewAmenity] = useState("")
  const [isAddAmenityModalVisible, setIsAddAmenityModalVisible] =
    useState(false)

  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [wards, setWards] = useState([])

  useEffect(() => {
    fetchAllUtilities() // Gọi hàm kết hợp dữ liệu khi component mount
  }, [])

  // Gọi cả hai API và kết hợp kết quả
  const fetchAllUtilities = async () => {
    try {
      setLoading(true)
      // Gọi API getUtilities và getOtherUtilities song song
      const [utilitiesResponse, otherUtilitiesResponse] = await Promise.all([
        ManagerService.getUtilities(),
        ManagerService.getOtherUtilities(),
      ])

      // Lấy dữ liệu từ cả hai API và set vào state riêng
      setUtilities(utilitiesResponse?.data || [])
      setOtherUtilities(otherUtilitiesResponse?.data || [])
    } catch (error) {
      console.error("Error fetching utilities:", error)
    } finally {
      setLoading(false)
    }
  }

  // Xử lý khi người dùng chọn/bỏ chọn tiện ích chính
  const handleAmenityChange = id => {
    setAmenities(prev =>
      prev.includes(id)
        ? prev.filter(amenity => amenity !== id)
        : [...prev, id],
    )
  }

  // Xử lý khi người dùng chọn/bỏ chọn tiện ích khác
  const handleOtherAmenityChange = id => {
    setSelectedOtherUtilities(prev =>
      prev.includes(id)
        ? prev.filter(amenity => amenity !== id)
        : [...prev, id],
    )
  }

  const handleAddNewAmenity = () => {
    setIsAddAmenityModalVisible(true)
  }

  // Thêm tiện ích mới vào API otherUtilities
  const handleSaveOtherUtility = async () => {
    try {
      setLoading(true)
      const payload = { name: newAmenity } // Tạo payload chứa tên tiện ích mới
      const response = await ManagerService.otherUtilities(payload) // Gọi API otherUtilities
      if (response && !response.isError) {
        Notice({ msg: `Thêm tiện ích "${newAmenity}" thành công!` })
        setNewAmenity("") // Reset trường nhập liệu
        fetchAllUtilities() // Lấy lại danh sách utilities sau khi thêm thành công
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

  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Tạo cấu trúc houseData theo định dạng mong muốn
      const houseData = {
        name: values.houseName,
        status: true,
        location: {
          province: selectedProvince || values.city,
          district: selectedDistrict || values.district,
          ward: values.ward,
          detailLocation: values.address,
        },
        electricPrice: Number(values.electricPrice), // Chuyển thành số
        waterPrice: Number(values.waterPrice), // Chuyển thành số
        utilities: amenities, // Truyền tiện ích chính đã chọn
        otherUtilities: selectedOtherUtilities, // Truyền tiện ích khác đã chọn
      }

      const res = await ManagerService.createHouse(houseData)
      if (res?.isError) return
      onOk && onOk()
      Notice({ msg: `Thêm nhà thành công!` })
      props?.onCancel()
    } catch (error) {
      console.error("Error adding new house:", error)
    } finally {
      setLoading(false)
    }
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
                  <Select
                    placeholder="Chọn Tỉnh/Thành Phố"
                    onChange={setSelectedProvince}
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
                  name="electricPrice"
                  rules={[
                    {
                      required: true,
                      message: "Thông tin không được để trống",
                    },
                  ]}
                >
                  <Input type="number" placeholder="VNĐ/kwH" />
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
                  <Input type="number" placeholder="VNĐ/m³" />
                </Form.Item>
              </Col>

              {/* Hiển thị danh sách tiện ích */}
              <Col span={24}>
                <Form.Item label="Tiện Ích Chính">
                  <Row gutter={[16, 16]}>
                    {utilities.map(utility => (
                      <Col span={6} key={utility._id}>
                        <Checkbox
                          name={utility.name}
                          checked={amenities.includes(utility._id)}
                          onChange={() => handleAmenityChange(utility._id)}
                        >
                          {utility.name}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Form.Item>
              </Col>

              {/* Hiển thị danh sách tiện ích khác */}
              <Col span={24}>
                <Form.Item label="Tiện Ích Khác">
                  <Row gutter={[16, 16]}>
                    {otherUtilities.map(utility => (
                      <Col span={6} key={utility._id}>
                        <Checkbox
                          name={utility.name}
                          checked={selectedOtherUtilities.includes(utility._id)}
                          onChange={() => handleOtherAmenityChange(utility._id)}
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

export default ModalInsertHouse

