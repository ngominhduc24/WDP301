import React, { useEffect, useState } from "react"
import {
  Col,
  Row,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Tabs,
  message,
  Upload,
  Button as AntButton,
} from "antd"
import Button from "src/components/MyButton/Button"
import styled from "styled-components"
import SpinCustom from "src/components/Spin"
import CustomModal from "src/components/Modal/CustomModal"
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

const ModalInsertRoom = ({ visible, onCancel, onOk, houseId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [utilities, setUtilities] = useState([]) // Danh sách tiện ích chính
  const [otherUtilities, setOtherUtilities] = useState([]) // Danh sách tiện ích khác
  const [selectedUtilities, setSelectedUtilities] = useState([]) // Tiện ích chính được chọn
  const [selectedOtherUtilities, setSelectedOtherUtilities] = useState([]) // Tiện ích khác được chọn
  const [newAmenity, setNewAmenity] = useState("")
  const [isAddAmenityModalVisible, setIsAddAmenityModalVisible] =
    useState(false)
  const [fileList, setFileList] = useState([])
  // Gọi API để lấy danh sách tiện ích và tiện ích khác khi mở modal
  useEffect(() => {
    if (visible) {
      fetchAllUtilities()
    }
  }, [visible])

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
      message.error("Có lỗi xảy ra khi tải danh sách tiện ích!")
    } finally {
      setLoading(false)
    }
  }

  // Xử lý khi thay đổi trạng thái checkbox tiện ích chính
  const handleUtilityChange = id => {
    setSelectedUtilities(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    )
  }

  // Xử lý khi thay đổi trạng thái checkbox tiện ích khác
  const handleOtherUtilityChange = id => {
    setSelectedOtherUtilities(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    )
  }

  // Xử lý thêm tiện ích khác mới
  const handleSaveOtherUtility = async () => {
    try {
      setLoading(true)
      const payload = { name: newAmenity }
      const response = await ManagerService.otherUtilities(payload)
      if (response && !response.isError) {
        message.success(`Thêm tiện ích "${newAmenity}" thành công!`)
        setNewAmenity("")
        fetchAllUtilities() // Tải lại danh sách tiện ích sau khi thêm
      } else {
        message.error("Có lỗi xảy ra khi thêm tiện ích mới!")
      }
    } catch (error) {
      console.error("Error adding new utility:", error)
      message.error("Có lỗi xảy ra khi thêm tiện ích mới!")
    } finally {
      setLoading(false)
      setIsAddAmenityModalVisible(false)
    }
  }

  // Xử lý khi nhấn "OK" để thêm phòng
  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Tạo dữ liệu để gửi đi
      const payload = {
        name: values.roomName,
        status: values.status,
        quantityMember: values.numberOfMembers,
        roomType: values.roomType,
        roomPrice: parseFloat(values.price),
        deposit: parseFloat(values.deposit),
        area: parseFloat(values.area),
        utilities: selectedUtilities, // Sử dụng các tiện ích chính được chọn
        otherUtilities: selectedOtherUtilities, // Sử dụng các tiện ích khác được chọn
      }

      const response = await ManagerService.insertRoom(houseId, payload)

      if (response?.statusCode === 201) {
        message.success("Thêm phòng thành công!")
        onOk && onOk()
        form.resetFields()
        setSelectedUtilities([])
        setSelectedOtherUtilities([])
        onCancel()
      } else {
        message.error("Có lỗi xảy ra khi thêm phòng!")
      }
    } catch (error) {
      console.error("Error adding new room:", error)
      message.error("Vui lòng kiểm tra lại thông tin!")
    } finally {
      setLoading(false)
    }
  }
  // Xử lý download template
  const handleDownloadTemplate = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.downloadTemplate()
      if (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "template.xlsx") // Đặt tên file tải về
        document.body.appendChild(link)
        link.click()
        message.success("Tải template thành công!")
      } else {
        message.error("Có lỗi xảy ra khi tải template!")
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải template!")
    } finally {
      setLoading(false)
    }
  }

  // Xử lý upload file
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Vui lòng chọn file để upload!")
      return
    }

    const formData = new FormData()
    formData.append("excelFile", fileList[0]) // Thêm file vào FormData
    formData.append("houseId", houseId) // Thêm houseId vào FormData

    try {
      setLoading(true)
      const response = await ManagerService.insertListRoom(formData)
      if (response?.statusCode === 201) {
        message.success("Upload danh sách phòng thành công!")
        onOk && onOk()
        setFileList([]) // Xóa danh sách file sau khi upload thành công
      } else {
        message.error("Có lỗi xảy ra khi upload danh sách phòng!")
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi upload danh sách phòng!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Thêm Phòng"
      footer={
        <div className="d-flex-end">
          <Button
            btntype="primary"
            className="btn-hover-shadow"
            onClick={onContinue}
          >
            Thêm phòng
          </Button>
        </div>
      }
      width={1024}
    >
      <SpinCustom spinning={loading}>
        <StyledContainer>
          <Tabs defaultActiveKey="1" centered>
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
                    <Form.Item
                      label="Trạng Thái"
                      name="status"
                      rules={[
                        {
                          required: true,
                          message: "Thông tin không được để trống",
                        },
                      ]}
                    >
                      <Select placeholder="Chọn Trạng Thái">
                        <Option value="Empty">Còn trống</Option>
                        <Option value="Rented">Đã thuê</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col md={8} xs={24}>
                    <Form.Item
                      label="Loại Phòng"
                      name="roomType"
                      rules={[
                        {
                          required: true,
                          message: "Thông tin không được để trống",
                        },
                      ]}
                    >
                      <Select placeholder="Chọn Loại Phòng">
                        <Option value="normal">Bình Thường</Option>
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

                  {/* Danh sách tiện ích chính */}
                  <Col span={24}>
                    <Form.Item label="Tiện Ích Chính">
                      <Row gutter={[16, 16]}>
                        {utilities.map(utility => (
                          <Col span={6} key={utility._id}>
                            <Checkbox
                              name={utility.name}
                              checked={selectedUtilities.includes(utility._id)}
                              onChange={() => handleUtilityChange(utility._id)}
                            >
                              {utility.name}
                            </Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Form.Item>
                  </Col>

                  {/* Danh sách tiện ích khác */}
                  <Col span={24}>
                    <Form.Item label="Tiện Ích Khác">
                      <Row gutter={[16, 16]}>
                        {otherUtilities.map(utility => (
                          <Col span={6} key={utility._id}>
                            <Checkbox
                              name={utility.name}
                              checked={selectedOtherUtilities.includes(
                                utility._id,
                              )}
                              onChange={() =>
                                handleOtherUtilityChange(utility._id)
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
                        onClick={() => setIsAddAmenityModalVisible(true)}
                      >
                        Thêm tiện ích
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </TabPane>

            <TabPane tab="Thêm Danh Sách Phòng" key="2">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item label="Upload File">
                    <Upload
                      fileList={fileList}
                      beforeUpload={file => {
                        setFileList([file])
                        return false // Prevent auto upload
                      }}
                      onRemove={() => setFileList([])} // Xóa file
                      maxCount={1} // Chỉ cho phép chọn 1 file
                    >
                      <AntButton>Chọn tệp</AntButton>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col
                  span={24}
                  className="d-flex align-items-center justify-content-center"
                >
                  <AntButton type="primary" onClick={handleUpload}>
                    Upload
                  </AntButton>
                  <AntButton
                    type="default"
                    style={{ marginLeft: "16px" }}
                    onClick={handleDownloadTemplate}
                  >
                    Download Template
                  </AntButton>
                </Col>
              </Row>
            </TabPane>
          </Tabs>

          {/* Modal thêm tiện ích khác */}
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
        </StyledContainer>
      </SpinCustom>
    </Modal>
  )
}

export default ModalInsertRoom

