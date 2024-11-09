import { Col, Form, Input, Row, Select, Checkbox, Upload } from "antd"
import { useEffect, useState } from "react"
import { UserOutlined } from "@ant-design/icons"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import styled from "styled-components"
import ManagerService from "src/services/ManagerService"
import provinces from "src/data/provinces.json"
import districts from "src/data/districts.json"
import wards from "src/data/wards.json"

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

const ModalInsertHouse = ({ onOk, detailInfo, onCancel, ...props }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [utilities, setUtilities] = useState([])
  const [otherUtilities, setOtherUtilities] = useState([])
  const [amenities, setAmenities] = useState([])
  const [selectedOtherUtilities, setSelectedOtherUtilities] = useState([])
  const [newAmenity, setNewAmenity] = useState("")
  const [isAddAmenityModalVisible, setIsAddAmenityModalVisible] =
    useState(false)

  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedProvinceName, setSelectedProvinceName] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedDistrictName, setSelectedDistrictName] = useState("")
  const [selectedWardName, setSelectedWardName] = useState("")
  const [filteredDistricts, setFilteredDistricts] = useState([])
  const [filteredWards, setFilteredWards] = useState([])
  const [imageUrl, setImageUrl] = useState("")
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    fetchAllUtilities()
  }, [])

  const fetchAllUtilities = async () => {
    try {
      setLoading(true)
      const [utilitiesResponse, otherUtilitiesResponse] = await Promise.all([
        ManagerService.getUtilities(),
        ManagerService.getOtherUtilities(),
      ])

      setUtilities(utilitiesResponse?.data || [])
      setOtherUtilities(otherUtilitiesResponse?.data || [])
    } catch (error) {
      console.error("Error fetching utilities:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProvinceChange = (value, option) => {
    setSelectedProvince(value)
    setSelectedProvinceName(option.children)
    const filtered = districts.filter(
      district => district.province_code === value,
    )
    setFilteredDistricts(filtered)
    setSelectedDistrict("")
    setSelectedWardName("")
  }

  const handleDistrictChange = (value, option) => {
    setSelectedDistrict(value)
    setSelectedDistrictName(option.children)
    const filtered = wards.filter(ward => ward.district_code === value)
    setFilteredWards(filtered)
  }

  const handleWardChange = (value, option) => {
    setSelectedWardName(option.children)
  }

  const handleAmenityChange = id => {
    setAmenities(prev =>
      prev.includes(id)
        ? prev.filter(amenity => amenity !== id)
        : [...prev, id],
    )
  }

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

  const handleSaveOtherUtility = async () => {
    try {
      setLoading(true)
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
  const handleImageUpload = ({ file }) => {
    const reader = new FileReader()
    reader.onload = e => {
      setImageUrl(e.target.result)
    }
    reader.readAsDataURL(file)
    setAvatarFile(file)
    return false
  }

  const handleCancel = () => {
    form.resetFields()
    setImageUrl("")
    setAvatarFile(null)
    onCancel()
  }

  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      const houseData = {
        name: values.houseName,
        status: true,
        location: {
          province: selectedProvinceName || values.city,
          district: selectedDistrictName || values.district,
          ward: selectedWardName || values.ward,
          detailLocation: values.address,
        },
        electricPrice: Number(values.electricPrice),
        waterPrice: Number(values.waterPrice),
        utilities: amenities,
        otherUtilities: selectedOtherUtilities,
        avatar: avatarFile,
      }

      const formData = new FormData()
      Object.keys(houseData).forEach(key => {
        if (key === "avatar" && houseData.avatar) {
          formData.append("avatar", houseData.avatar)
        } else {
          formData.append(key, JSON.stringify(houseData[key]))
        }
      })

      const res = await ManagerService.createHouse(formData)
      if (res?.isError) return
      onOk && onOk()
      Notice({ msg: `Thêm nhà thành công!` })
      onCancel()
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
      onCancel={handleCancel} // Use the modified handleCancel
    >
      <SpinCustom spinning={loading}>
        <StyledContainer>
          <Form form={form} layout="vertical" className="modal-content">
            <Row gutter={[16]}>
              <Col span={24} className="mb-10">
                <div className="image-upload">
                  <Upload
                    accept="image/*"
                    multiple={false}
                    maxCount={1}
                    beforeUpload={handleImageUpload}
                    onChange={({ file }) => {
                      if (file && file.status !== "removed") {
                        handleImageUpload({ file })
                      }
                    }}
                    listType="picture-card"
                    showUploadList={false}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        className="image-preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div>
                        <UserOutlined />
                        <div style={{ marginTop: 8 }}>Chọn Ảnh</div>
                      </div>
                    )}
                  </Upload>

                  <div className="sub-color fs-12">
                    Dung lượng file tối đa 5MB, định dạng: .JPG, .JPEG, .PNG,
                    .SVG
                  </div>
                </div>
              </Col>
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
                    onChange={handleProvinceChange}
                  >
                    {provinces.map(province => (
                      <Option key={province.code} value={province.code}>
                        {province.name}
                      </Option>
                    ))}
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
                    disabled={!selectedProvince}
                    onChange={handleDistrictChange}
                  >
                    {filteredDistricts.map(district => (
                      <Option key={district.code} value={district.code}>
                        {district.name}
                      </Option>
                    ))}
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
                    disabled={!selectedDistrict}
                    onChange={handleWardChange}
                  >
                    {filteredWards.map(ward => (
                      <Option key={ward.code} value={ward.code}>
                        {ward.name}
                      </Option>
                    ))}
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

