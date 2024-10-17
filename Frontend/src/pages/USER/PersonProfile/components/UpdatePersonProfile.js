import React, { useEffect, useState } from "react"
import { Col, Form, Input, Row } from "antd"
import moment from "moment"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import STORAGE, { getStorage } from "src/lib/storage"
import UserService from "src/services/UserService"
import styled from "styled-components"

const Styled = styled.div`
  .modal-container {
    padding: 20px;
    margin: 0 24px;
  }
`

const ModalInsertUpdateProfile = ({ onOk, userProfile, ...props }) => {
  const userID = getStorage(STORAGE.USER_ID)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userProfile) {
      form.setFieldsValue({
        FullName: userProfile?.name || "",
        PhoneNumber: userProfile?.phone || "",
        // Birthday: userProfile?.dob
        //   ? moment(userProfile.dob, "DD/MM/YYYY")
        //   : null,
        payosClientId: userProfile?.payosClientId || "",
        payosAPIKey: userProfile?.payosAPIKey || "",
        payosCheckSum: userProfile?.payosCheckSum || "",
      })
    }
  }, [userProfile, form])

  const onUpdateProfile = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()

      const payload = {
        name: values.FullName,
        phone: values.PhoneNumber,
        // dob: values.Birthday ? values.Birthday.format("DD/MM/YYYY") : null,
        payosClientId: values.payosClientId,
        payosAPIKey: values.payosAPIKey,
        payosCheckSum: values.payosCheckSum,
      }

      const res = await UserService.updateProfile(userID, payload)

      if (!res?.isError) {
        Notice({ isSuccess: true, msg: "Cập nhật thành công!" })
        onOk()
      } else {
        Notice({ isSuccess: false, msg: res?.message || "Cập nhật thất bại!" })
      }
    } catch (error) {
      Notice({
        isSuccess: false,
        msg: error.message || "Có lỗi xảy ra!",
      })
    } finally {
      setLoading(false)
    }
  }

  const renderFooter = () => (
    <div className="d-flex-sb">
      <Button
        btntype="primary"
        className="btn-hover-shadow"
        onClick={onUpdateProfile}
      >
        Cập nhật
      </Button>
    </div>
  )

  return (
    <CustomModal
      title="Cập nhật thông tin tài khoản"
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
                Birthday: userProfile?.dob
                  ? moment(userProfile.dob, "DD/MM/YYYY")
                  : null,
                payosClientId: userProfile?.payosClientId || "",
                payosAPIKey: userProfile?.payosAPIKey || "",
                payosCheckSum: userProfile?.payosCheckSum || "",
              }}
            >
              <Row gutter={[16]}>
                <Col md={24}>
                  <Form.Item
                    label="Họ và tên"
                    name="FullName"
                    rules={[
                      { required: true, message: "Vui lòng nhập họ và tên!" },
                    ]}
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                </Col>

                <Col md={8}>
                  <Form.Item
                    label="Số điện thoại"
                    name="PhoneNumber"
                    rules={[
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại phải gồm 10 chữ số",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </Col>

                <Col md={8}>
                  <Form.Item label="Email" name="Email">
                    <Input disabled value={userProfile?.email || ""} />
                  </Form.Item>
                </Col>

                {/* <Col md={8}>
                  <Form.Item label="Ngày sinh" name="Birthday">
                    <DatePicker
                      placeholder="Chọn ngày sinh"
                      format="DD/MM/YYYY"
                      allowClear
                    />
                  </Form.Item>
                </Col> */}

                <Col md={8}>
                  <Form.Item
                    label="payosClientId"
                    name="payosClientId"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập payosClientId!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập payosClientId" />
                  </Form.Item>
                </Col>

                <Col md={8}>
                  <Form.Item
                    label="payosAPIKey"
                    name="payosAPIKey"
                    rules={[
                      { required: true, message: "Vui lòng nhập payosAPIKey!" },
                    ]}
                  >
                    <Input placeholder="Nhập payosAPIKey" />
                  </Form.Item>
                </Col>

                <Col md={8}>
                  <Form.Item
                    label="payosCheckSum"
                    name="payosCheckSum"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập payosCheckSum!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập payosCheckSum" />
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
