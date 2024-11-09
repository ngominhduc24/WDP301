import { Col, Form, Input, Row, Select, Upload } from "antd"
import { useEffect, useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import styled from "styled-components"
import { ButtonUploadStyle } from "../styled"
import SvgIcon from "src/components/SvgIcon"
import UserService from "src/services/UserService"
import STORAGE, { getStorage } from "src/lib/storage"
import ManagerService from "src/services/ManagerService"
const { Option } = Select

const Styled = styled.div`
  .ant-upload.ant-upload-select-picture-card {
    width: unset;
    height: unset;
    background-color: unset;
    border: unset;
  }
  .ant-upload-list {
    align-items: center;
    display: flex;
  }
`

const ImportUser = ({ onOk, detailInfo, ...props }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUpload, setAvatarUpload] = useState(detailInfo?.avatar || "")
  const [roleOptions, setRoleOptions] = useState([])

  useEffect(() => {
    const role = getStorage(STORAGE.USER_INFO)
    if (role?.accountType === "host") {
      setRoleOptions(["host"])
    } else if (role?.accountType === "admin") {
      setRoleOptions(["admin", "host"])
    }

    if (detailInfo) {
      form.setFieldsValue({
        username: detailInfo.username,
        email: detailInfo.email === "N/A" ? "" : detailInfo.email || "",
        name: detailInfo.name || "",
        role: detailInfo.role || roleOptions[0],
      })
    }
  }, [detailInfo, form, roleOptions])

  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      let avatarUrl = avatarUpload || detailInfo?.avatar || ""

      if (values.image && values.image[0]?.originFileObj) {
        const formData = new FormData()
        formData.append("image", values.image[0]?.originFileObj)
        const uploadResponse = await UserService.uploadFile(formData)
        avatarUrl = uploadResponse?.image
        await UserService.changeAvatar(detailInfo._id, { avatar: avatarUrl })
      }

      const payload = {
        username: values.username,
        email: values.email,
        name: values.name,
        role: values.role,
      }

      const response = await ManagerService.createUser(payload)
      Notice({
        isSuccess: true,
        msg: response.message,
      })
      onOk && onOk()
      props.onCancel()
      // if (response?.success) {
      //   Notice({
      //     isSuccess: true,
      //     msg: response.message,
      //   })
      //   onOk && onOk()
      //   props.onCancel()
      // } else {
      //   const errorMessage = response?.message || "Thêm nhân viên thất bại!"
      //   throw new Error(errorMessage)
      // }
    } catch (error) {
      console.error("Create user error:", error)
      Notice({
        isSuccess: false,
        msg: error.message || "Thêm nhân viên thất bại!",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUploadChange = ({ file }) => {
    if (file.status === "done" || file.status === "uploading") {
      setAvatarUpload(URL.createObjectURL(file.originFileObj))
      form.setFieldsValue({
        image: [
          {
            uid: "-1",
            name: file.name,
            status: "done",
            url: URL.createObjectURL(file.originFileObj),
          },
        ],
      })
    }
  }

  const renderFooter = () => (
    <div className="d-flex-end">
      <Button
        btntype="primary"
        className="btn-hover-shadow"
        onClick={onContinue}
      >
        Ghi lại
      </Button>
    </div>
  )

  return (
    <CustomModal
      title={"Thêm nhân viên"}
      footer={renderFooter()}
      width={1024}
      {...props}
    >
      <SpinCustom spinning={loading}>
        <Styled>
          <Form form={form} layout="vertical">
            <Row gutter={[16]}>
              {/* <Col span={24}>
                <Form.Item
                  label="Hình đại diện"
                  name="image"
                  valuePropName="fileList"
                >
                  {avatarUpload ? (
                    <img
                      src={avatarUpload}
                      alt="avatar"
                      style={{ width: "30%" }}
                    />
                  ) : (
                    <Upload
                      accept="image/*"
                      multiple={false}
                      maxCount={1}
                      beforeUpload={() => false}
                      onChange={handleUploadChange}
                      listType="picture-card"
                    >
                      <Row className="align-items-center">
                        <ButtonUploadStyle>
                          <Button className="account-button-upload">
                            <Row className="account-background-upload d-flex align-items-center">
                              <SvgIcon name="add-media-video" />
                              <div className="account-text-upload ml-16">
                                Chọn ảnh
                              </div>
                            </Row>
                          </Button>
                        </ButtonUploadStyle>
                        <div className="sub-color fs-12 ml-16">
                          Dung lượng file tối đa 5MB, định dạng: .JPG, .JPEG,
                          .PNG, .SVG
                        </div>
                      </Row>
                    </Upload>
                  )}
                </Form.Item>
              </Col> */}

              <Col md={24} xs={24}>
                <Form.Item
                  label="Tên người dùng"
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên người dùng" },
                  ]}
                >
                  <Input placeholder="Nhập tên người dùng" />
                </Form.Item>
              </Col>

              <Col md={24} xs={24}>
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
              </Col>

              <Col md={12} xs={24}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Vui lòng nhập email" }]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>

              <Col md={12} xs={24}>
                <Form.Item
                  label="Vai trò"
                  name="role"
                  rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                >
                  <Select placeholder="Chọn vai trò">
                    {roleOptions.map(role => (
                      <Option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Styled>
      </SpinCustom>
    </CustomModal>
  )
}

export default ImportUser

