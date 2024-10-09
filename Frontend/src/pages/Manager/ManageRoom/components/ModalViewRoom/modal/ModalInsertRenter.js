import React, { useEffect, useState } from "react"
import {
  Col,
  Row,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  message,
} from "antd"
import Button from "src/components/MyButton/Button"
import styled from "styled-components"
import { UploadOutlined, UserOutlined } from "@ant-design/icons"
import ManagerService from "src/services/ManagerService" // Import ManagerService để gọi hàm API

const { Option } = Select

// Styled Component
const Styled = styled.div`
  .form-container {
    display: flex;
    justify-content: space-between;
  }
  .image-upload {
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  .image-preview {
    width: 100%;
    max-width: 300px;
    height: auto;
    border: 2px solid #ddd;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  .info-form {
    width: 55%;
  }
  .form-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  .ant-upload-select-picture-card {
    border: none;
    width: unset;
    height: unset;
  }
`

const ModalInsertRenter = ({ onOk, visible, onCancel, roomId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [avatarFile, setAvatarFile] = useState(null) // Biến lưu trữ file avatar

  // Xử lý khi nhấn "OK"
  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Tạo FormData và thêm các thông tin vào
      const formData = new FormData()
      formData.append("name", values.fullName)
      formData.append("phone", values.phoneNumber)
      formData.append("cccd", values.cccd)
      formData.append("gender", values.gender)
      formData.append("dob", values.dob.format("YYYY-MM-DD")) // Định dạng ngày tháng
      formData.append("note", values.note || "")
      if (avatarFile) {
        formData.append("avatar", avatarFile) // Thêm file ảnh vào FormData
      }

      // Gọi API insertMember với FormData
      const response = await ManagerService.insertMember(roomId, formData)
      if (response?.statusCode === 201) {
        message.success("Thêm khách thuê thành công!")
        onOk && onOk()
        form.resetFields()
        setAvatarFile(null)
        setImageUrl("")
        onCancel()
      } else {
        message.error("Có lỗi xảy ra khi thêm khách thuê!")
      }
    } catch (error) {
      console.error("Validation Failed:", error)
      message.error("Vui lòng kiểm tra lại thông tin!")
    } finally {
      setLoading(false)
    }
  }

  // Xử lý upload hình ảnh và lưu file vào state
  const handleImageUpload = ({ file }) => {
    const reader = new FileReader()
    reader.onload = e => {
      setImageUrl(e.target.result)
    }
    setAvatarFile(file) // Lưu file vào state để dùng khi gửi FormData
    reader.readAsDataURL(file)
  }

  // Xử lý khi nhấn nút "Hủy"
  const handleCancel = () => {
    form.resetFields()
    setImageUrl("")
    setAvatarFile(null)
    onCancel()
  }

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      title="Thêm Khách Thuê"
      footer={null}
      width={800}
    >
      <Styled>
        <Form form={form} layout="vertical">
          <div className="form-container">
            {/* Khu vực upload ảnh */}
            <div className="image-upload">
              <Upload
                accept="image/*"
                multiple={false}
                maxCount={1}
                beforeUpload={file => {
                  handleImageUpload({ file })
                  return false
                }}
                listType="picture-card"
                showUploadList={false}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" className="image-preview" />
                ) : (
                  <div>
                    <UserOutlined />
                    <div style={{ marginTop: 8 }}>Chọn Ảnh</div>
                  </div>
                )}
              </Upload>
              <div className="sub-color fs-12 ml-16">
                Dung lượng file tối đa 5MB, định dạng: .JPG, .JPEG, .PNG, .SVG
              </div>
            </div>

            {/* Khu vực nhập thông tin */}
            <div className="info-form">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: "Họ và tên không được để trống",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại phải là 10 chữ số",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Căn cước công dân"
                    name="cccd"
                    rules={[
                      {
                        pattern: /^[0-9]{12}$/,
                        message: "CCCD phải là 12 chữ số",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập CCCD" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[
                      {
                        required: true,
                        message: "Giới tính không được để trống",
                      },
                    ]}
                  >
                    <Select placeholder="Chọn giới tính">
                      <Option value="male">Nam</Option>
                      <Option value="female">Nữ</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Ngày sinh"
                    name="dob"
                    rules={[
                      {
                        required: true,
                        message: "Ngày sinh không được để trống",
                      },
                    ]}
                  >
                    <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Ghi chú" name="note">
                    <Input.TextArea placeholder="Nhập ghi chú" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
          {/* Footer */}
          <div className="form-footer">
            <Button
              onClick={handleCancel}
              btntype="third"
              style={{ marginRight: 16 }}
            >
              Hủy
            </Button>
            <Button onClick={onContinue} btntype="primary" loading={loading}>
              Thêm
            </Button>
          </div>
        </Form>
      </Styled>
    </Modal>
  )
}

export default ModalInsertRenter
