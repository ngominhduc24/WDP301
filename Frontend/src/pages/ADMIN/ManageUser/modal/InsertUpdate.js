import { Col, DatePicker, Form, Input, Row, Upload, Select } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import { GUIDE_EMPTY, SYSTEM_KEY } from "src/constants/constants"
import {
  getRegexEmail,
  getRegexMobile,
  getRegexPassword,
  getRegexUsername,
} from "src/lib/stringsUtils"
import { getListComboByKey, nest, normFile } from "src/lib/utils"
import styled from "styled-components"
import { ButtonUploadStyle } from "../styled"
import SvgIcon from "src/components/SvgIcon"
import dayjs from "dayjs"
import UserService from "src/services/UserService"
import { differenceInYears } from "date-fns"

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

const ModalInsertUpdate = ({ onOk, detailInfo, ...props }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [avatarUpload, setAvatarUpload] = useState(detailInfo?.avatar || "")

  useEffect(() => {
    if (detailInfo) {
      form.setFieldsValue({
        username: detailInfo.username,
        name: detailInfo.name,
        email: detailInfo.email === "N/A" ? "" : detailInfo.email || "",
        phone: detailInfo.phone === "N/A" ? "" : detailInfo.phone || "",
        dob: detailInfo.dob ? dayjs(detailInfo.dob, "DD/MM/YYYY") : null,
        address: detailInfo.address || "",
      })
    }
  }, [detailInfo, form])

  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const { username, dob, ...updatedValues } = values
      if (!updatedValues.email) delete updatedValues.email
      if (!updatedValues.phone) delete updatedValues.phone
      updatedValues.id = detailInfo._id
      await UserService.updateProfile(updatedValues)
      Notice({ msg: "Cập nhật nhân viên thành công!" })
      onOk && onOk()
      props.onCancel()
    } catch (error) {
      console.error("Update error:", error)
      Notice({ msg: "Cập nhật nhân viên thất bại!" })
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
    <div className={!!detailInfo ? "d-flex-sb" : "d-flex-end"}>
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
      title={!!detailInfo ? "Cập nhật nhân viên" : "Thêm nhân viên"}
      footer={renderFooter()}
      width={1024}
      {...props}
    >
      <SpinCustom spinning={loading}>
        <Styled>
          <Form form={form} layout="vertical">
            <Row gutter={[16]}>
              <Col span={24}>
                <Form.Item
                  label="Hình đại diện"
                  name="image"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (!!value?.find(i => i?.size > 5 * 1024 * 1024)) {
                          return Promise.reject(
                            new Error("Dung lượng file tối đa 5MB"),
                          )
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
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
              </Col>

              <Col md={24} xs={24}>
                <Form.Item label="Tên tài khoản" name="username">
                  <Input placeholder="Nhập tên" disabled />
                </Form.Item>
              </Col>
              <Col md={24} xs={24}>
                <Form.Item label="Họ và tên" name="name">
                  <Input placeholder="Nhập tên" />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    // {
                    //   type: "email",
                    //   message: "Email không hợp lệ!",
                    // },
                    {
                      validator: (_, value) => {
                        if (value && !getRegexEmail().test(value)) {
                          return Promise.reject(new Error("Email không hợp lệ"))
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>

              {!detailInfo && (
                <Col md={12} xs={24}>
                  <Form.Item label="Mật khẩu mặc định" name="password">
                    <Input placeholder="Nhập mật khẩu" />
                  </Form.Item>
                </Col>
              )}

              <Col md={12} xs={24}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                  rules={[
                    {
                      pattern: /^(\+84|0)[3|5|7|8|9]\d{8}$/,
                      message: "Số điện thoại không hợp lệ!",
                    },
                    {
                      validator: (_, value) => {
                        if (value && !getRegexMobile().test(value)) {
                          return Promise.reject(
                            new Error("Số điện thoại không hợp lệ"),
                          )
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>

              <Col md={6} xs={24}>
                <Form.Item
                  label="Ngày sinh"
                  name="dob"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve()
                        const age = differenceInYears(
                          new Date(),
                          new Date(value),
                        )
                        if (age < 18) {
                          return Promise.reject(new Error("Phải trên 18 tuổi"))
                        }
                        return Promise.resolve()
                      },
                    },
                  ]}
                >
                  <DatePicker
                    placeholder="Chọn"
                    format="DD/MM/YYYY"
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Địa chỉ" name="address">
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Styled>
      </SpinCustom>
    </CustomModal>
  )
}

export default ModalInsertUpdate

