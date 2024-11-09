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
`

const ModalUpdateHouse = ({ onOk, onCancel, open, houseData }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [utilities, setUtilities] = useState([])
  const [otherUtilities, setOtherUtilities] = useState([])
  const [amenities, setAmenities] = useState([])
  const [selectedOtherUtilities, setSelectedOtherUtilities] = useState([])
  const [electricPrice, setElectricPrice] = useState("")
  const [waterPrice, setWaterPrice] = useState("")
  const [newAmenity, setNewAmenity] = useState("")
  const [isAddAmenityModalVisible, setIsAddAmenityModalVisible] =
    useState(false)

  const [selectedProvince, setSelectedProvince] = useState("")
  const [selectedProvinceName, setSelectedProvinceName] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedDistrictName, setSelectedDistrictName] = useState("")
  const [selectedWard, setSelectedWard] = useState("")
  const [selectedWardName, setSelectedWardName] = useState("")
  const [filteredDistricts, setFilteredDistricts] = useState([])
  const [filteredWards, setFilteredWards] = useState([])

  const [imageUrl, setImageUrl] = useState("")
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    if (open) {
      fetchAllUtilities()
      if (houseData) {
        updateFormWithHouseData()
      }
    }
  }, [houseData, open])

  const fetchAllUtilities = async () => {
    setLoading(true)
    try {
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

  const updateFormWithHouseData = () => {
    const { address, city, district, ward } = parseLocation(
      houseData.address || "",
    )
    form.setFieldsValue({
      houseName: houseData?.houseName,
      city: city || "",
      district: district || "",
      ward: ward || "",
      address: address || "",
      electricPrice: parseFloat(houseData?.electricPrice) || 0,
      waterPrice: parseFloat(houseData?.waterPrice) || 0,
    })

    const selectedProvinceData = provinces.find(p => p.name === city)
    const selectedDistrictData = districts.find(
      d =>
        d.name === district && d.province_code === selectedProvinceData?.code,
    )
    setSelectedProvince(selectedProvinceData?.code || "")
    setSelectedProvinceName(selectedProvinceData?.name || "")
    setSelectedDistrict(selectedDistrictData?.code || "")
    setSelectedDistrictName(selectedDistrictData?.name || "")
    setSelectedWard(ward || "")
    setSelectedWardName(ward || "")

    if (selectedProvinceData) {
      setFilteredDistricts(
        districts.filter(d => d.province_code === selectedProvinceData.code),
      )
    }
    if (selectedDistrictData) {
      setFilteredWards(
        wards.filter(w => w.district_code === selectedDistrictData.code),
      )
    }

    setAmenities(houseData.utilities || [])
    setSelectedOtherUtilities(houseData.otherUtilities || [])
    setElectricPrice(houseData?.electricPrice || 0)
    setWaterPrice(houseData?.waterPrice || 0)

    if (houseData?.avatar) {
      setImageUrl(houseData.avatar)
    }
  }

  const handleImageUpload = ({ file }) => {
    const reader = new FileReader()
    reader.onload = e => {
      setImageUrl(e.target.result)
    }
    setAvatarFile(file)
    reader.readAsDataURL(file)
    return false
  }
  const parseLocation = address => {
    const parts = address.split(",").map(part => part.trim())
    return {
      address: parts[0] || "",
      ward: parts[1] || "",
      district: parts[2] || "",
      city: parts[3] || "",
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
    setSelectedDistrictName("")
    setFilteredWards([])
  }

  const handleDistrictChange = (value, option) => {
    setSelectedDistrict(value)
    setSelectedDistrictName(option.children)
    const filtered = wards.filter(ward => ward.district_code === value)
    setFilteredWards(filtered)
  }

  const handleWardChange = (value, option) => {
    setSelectedWard(value)
    setSelectedWardName(option.children)
  }

  const handleElectricPriceChange = e => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setElectricPrice(value)
    form.setFieldsValue({ electricPrice: value })
  }

  const handleWaterPriceChange = e => {
    const value = e.target.value.replace(/[^0-9]/g, "")
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
          province: selectedProvinceName || values.city,
          district: selectedDistrictName || values.district,
          ward: selectedWardName || values.ward,
          detailLocation: values.address,
        },
        electricPrice: parseFloat(electricPrice) || 0,
        waterPrice: parseFloat(waterPrice) || 0,
        utilities: amenities,
        otherUtilities: selectedOtherUtilities,
        avatar: avatarFile,
      }

      const formData = new FormData()
      Object.keys(updatedHouseData).forEach(key => {
        if (key === "avatar" && updatedHouseData.avatar) {
          formData.append("avatar", updatedHouseData.avatar)
        } else {
          formData.append(key, JSON.stringify(updatedHouseData[key]))
        }
      })

      const res = await ManagerService.updateHouse(houseData._id, formData)
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
                  <div className="sub-color fs-12 ml-16">
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
                    value={selectedProvince}
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
                    onChange={handleDistrictChange}
                    value={selectedDistrict}
                    disabled={!selectedProvince}
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
                    onChange={handleWardChange}
                    value={selectedWard}
                    disabled={!selectedDistrict}
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

export default ModalUpdateHouse

