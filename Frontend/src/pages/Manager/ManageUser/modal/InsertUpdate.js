import { Col, DatePicker, Form, Input, Row, Select, Upload } from "antd"
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
        email: detailInfo.email || "",
        phone: detailInfo.phone || "",
        Status: detailInfo.status ? "Active" : "Inactive",
        dob: detailInfo.dob ? dayjs(detailInfo.dob, "DD/MM/YYYY") : null,
        image: detailInfo.avatar
          ? [
              {
                uid: "-1",
                name: "Avatar",
                status: "done",
                url: detailInfo.avatar,
              },
            ]
          : [],
        Address: detailInfo.address || "",
      })
    }
  }, [detailInfo, form])

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

      const updatedValues = {
        ...values,
        dob: values.dob ? values.dob.format("DD/MM/YYYY") : detailInfo?.dob,
        image: avatarUrl,
        status: values.Status === "Active",
      }

      Object.keys(updatedValues).forEach(key => {
        if (!updatedValues[key] && key !== "status" && key !== "image") {
          updatedValues[key] = detailInfo[key]
        }
      })

      await UserService.updateProfile(detailInfo._id, updatedValues)
      Notice({
        msg: "Cập nhật nhân viên thành công!",
      })
      onOk && onOk()
      props.onCancel()
    } catch (error) {
      console.error("Update error:", error)
      Notice({
        msg: "Cập nhật nhân viên thất bại!",
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
    <div className={!!detailInfo ? "d-flex-sb" : "d-flex-end"}>
      {!detailInfo && (
        <Button btntype="primary" className="btn-hover-shadow">
          Reset mật khẩu mặc định
        </Button>
      )}
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

              {/* Other form fields with their initial values */}
              <Col md={24} xs={24}>
                <Form.Item label="Họ và tên" name="username">
                  <Input placeholder="Nhập tên" />
                </Form.Item>
              </Col>

              <Col md={12} xs={24}>
                <Form.Item label="Email" name="email">
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>

              <Col md={12} xs={24}>
                <Form.Item label="Trạng thái" name="Status">
                  <Select placeholder="Chọn trạng thái">
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                  </Select>
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
                <Form.Item label="Số điện thoại" name="phone">
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col md={6} xs={24}>
                <Form.Item label="Ngày sinh" name="dob">
                  <DatePicker
                    placeholder="Chọn"
                    format="DD/MM/YYYY"
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item label="Địa chỉ" name="Address">
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

