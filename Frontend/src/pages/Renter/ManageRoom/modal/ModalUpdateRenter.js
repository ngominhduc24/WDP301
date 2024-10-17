import React, { useCallback, useEffect, useState } from "react"
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
import { UserOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import RenterService from "src/services/RenterService"

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

const ModalUpdateRenter = ({ onOk, visible, onCancel, roomId, member }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [avatarFile, setAvatarFile] = useState(null)

  const fetchMemberDetail = useCallback(async () => {
    try {
      setLoading(true)
      const response = await RenterService.getMemberDetail(roomId, member._id)
      if (response?.data) {
        const memberData = response.data
        form.setFieldsValue({
          fullName: memberData.name,
          phoneNumber: memberData.phone,
          cccd: memberData.cccd,
          gender: memberData.gender,
          dob: memberData.dob ? dayjs(memberData.dob) : null,
          note: memberData.note,
        })
        setImageUrl(memberData.avatar?.imageData || "")
      }
    } catch (error) {
      message.error("Không thể tải thông tin thành viên.")
    } finally {
      setLoading(false)
    }
  }, [form, member, roomId])
  useEffect(() => {
    if (member && visible) {
      fetchMemberDetail()
    }
  }, [member, visible, fetchMemberDetail])

  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const formData = new FormData()
      formData.append("memberId", member._id)
      formData.append("name", values.fullName)
      formData.append("phone", values.phoneNumber)
      formData.append("cccd", values.cccd)
      formData.append("gender", values.gender)
      formData.append("dob", values.dob.format("YYYY-MM-DD"))
      formData.append("note", values.note || "")
      if (avatarFile) {
        formData.append("avatar", avatarFile)
      }

      const response = await RenterService.updateMember(roomId, formData)
      if (response?.statusCode === 200) {
        message.success("Cập nhật thông tin thành công!")
        onOk && onOk()
        form.resetFields()
        setAvatarFile(null)
        setImageUrl("")
        onCancel()
      } else {
        message.error("Có lỗi xảy ra khi cập nhật thông tin!")
      }
    } catch (error) {
      console.error("Validation Failed:", error)
      message.error("Vui lòng kiểm tra lại thông tin!")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = ({ file }) => {
    const reader = new FileReader()
    reader.onload = e => {
      setImageUrl(e.target.result)
    }
    setAvatarFile(file)
    reader.readAsDataURL(file)
  }

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
      title="Cập Nhật Khách Thuê"
      footer={null}
      width={800}
    >
      <Styled>
        <Form form={form} layout="vertical">
          <div className="form-container">
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
          <div className="form-footer">
            <Button
              onClick={handleCancel}
              btntype="third"
              style={{ marginRight: 16 }}
            >
              Hủy
            </Button>
            <Button onClick={onContinue} btntype="primary" loading={loading}>
              Lưu
            </Button>
          </div>
        </Form>
      </Styled>
    </Modal>
  )
}

export default ModalUpdateRenter
