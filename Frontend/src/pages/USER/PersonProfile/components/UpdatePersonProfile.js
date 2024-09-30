import { Col, DatePicker, Form, Input, Row, Select, Upload } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import STORAGE, { getStorage } from "src/lib/storage"
import UserService from "src/services/UserService"
import styled from "styled-components"
const { Option } = Select

const Styled = styled.div`
  .modal-container {
    padding: 20px;
    margin: 0 24px;
  }
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

const ModalInsertUpdateProfile = ({ onOk, userProfile, ...props }) => {
  const userID = getStorage(STORAGE.USER_ID)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  // Đặt giá trị mặc định cho form khi nhận được dữ liệu từ Profile
  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        FullName: userProfile.name,
        PhoneNumber: userProfile.phone || "",
        Email: userProfile.email,
        Birthday: userProfile.dob
          ? moment(userProfile.dob, "DD/MM/YYYY")
          : null,
      })
    }
  }, [userProfile, form])

  // Hàm cập nhật thông tin tài khoản
  const onUpdateProfiile = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      // Gửi dữ liệu cập nhật
      const res = await UserService.updateProfile(userID, {
        fullname: values.FullName,
        phone: values.PhoneNumber,
        email: values.Email,
        dob: values.Birthday ? values.Birthday.format("DD/MM/YYYY") : null,
      })

      // Xử lý phản hồi từ server
      if (!res?.isError) {
        Notice({ isSuccess: true, msg: "Cập nhật thành công!" })
        onOk() // Gọi hàm onOk khi cập nhật thành công
      } else {
        Notice({ isSuccess: false, msg: res?.message || "Cập nhật thất bại!" })
      }
    } catch (error) {
      const errorMessage = error.message || "Có lỗi xảy ra!"
      Notice({ isSuccess: false, msg: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  // Tạo footer cho modal
  const renderFooter = () => (
    <div className={"d-flex-sb"}>
      <Button
        btntype="primary"
        className="btn-hover-shadow"
        onClick={onUpdateProfiile}
      >
        Cập nhật
      </Button>
    </div>
  )

  return (
    <CustomModal
      title={"Cập nhật thông tin tài khoản"}
      footer={renderFooter()}
      width={1024}
      {...props}
    >
      <SpinCustom spinning={loading}>
        <Styled>
          <div className="modal-container">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                FullName: userProfile?.name || "",
                PhoneNumber: userProfile?.phone || "",
                Email: userProfile?.email || "",
                Birthday: userProfile?.dob
                  ? moment(userProfile.dob, "DD/MM/YYYY")
                  : null,
              }}
            >
              <Row gutter={[16]}>
                <Col md={24} xs={24}>
                  <Form.Item
                    label="Họ và tên"
                    name="FullName"
                    rules={[
                      {
                        required: true,
                        message: "Thông tin không được để trống",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>

                <Col md={8} xs={24}>
                  <Form.Item
                    label="Số điện thoại"
                    name="PhoneNumber"
                    rules={[
                      {
                        pattern: /^[0-9]{8,15}$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>

                <Col md={8} xs={24}>
                  <Form.Item
                    label="Email"
                    name="Email"
                    rules={[{ type: "email", message: "Email không hợp lệ" }]}
                  >
                    <Input placeholder="Nhập email" />
                  </Form.Item>
                </Col>

                <Col md={8} xs={24}>
                  <Form.Item label="Ngày sinh" name="Birthday">
                    <DatePicker
                      placeholder="Chọn ngày sinh"
                      format="DD/MM/YYYY"
                      allowClear
                      value={form.getFieldValue("Birthday")}
                      onChange={date => form.setFieldsValue({ Birthday: date })}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Styled>
      </SpinCustom>
    </CustomModal>
  )
}

export default ModalInsertUpdateProfile

