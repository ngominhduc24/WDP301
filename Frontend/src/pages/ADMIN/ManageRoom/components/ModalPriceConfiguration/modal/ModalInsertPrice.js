import React, { useEffect, useState } from "react"
import { Col, Row, Modal, Form, Input, Select, message } from "antd"
import Button from "src/components/MyButton/Button"
import styled from "styled-components"
import SpinCustom from "src/components/Spin"
import ManagerService from "src/services/ManagerService"

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

const ModalInsertPrice = ({ visible, onCancel, onOk, houseId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [priceOptions, setPriceOptions] = useState([])
  const [selectedPrice, setSelectedPrice] = useState(null)

  useEffect(() => {
    if (visible) {
      fetchPriceOptions()
    }
  }, [visible])

  const fetchPriceOptions = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getPriceList()
      if (response?.data) {
        setPriceOptions(response.data)
      } else {
        setPriceOptions([])
      }
    } catch (error) {
      console.error("Error fetching price list:", error)
      message.error("Có lỗi xảy ra khi tải danh sách loại phí!")
    } finally {
      setLoading(false)
    }
  }

  const onContinue = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const payload = {
        base: selectedPrice._id,
        price: parseFloat(values.price),
      }

      const response = await ManagerService.addPrice(houseId, payload)

      if (response?.statusCode === 200) {
        message.success("Thêm loại phí thành công!")
        onOk && onOk()
        form.resetFields()
        setSelectedPrice(null)
        onCancel()
      } else {
        message.error("Có lỗi xảy ra khi thêm loại phí!")
      }
    } catch (error) {
      console.error("Error adding new price:", error)
      message.error("Vui lòng kiểm tra lại thông tin!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Cấu Hình Bảng Giá"
      footer={
        <div className="d-flex justify-content-between">
          <Button
            btntype="primary"
            className="btn-hover-shadow mr-8"
            onClick={onContinue}
          >
            Thêm Kinh Phí
          </Button>
          <Button onClick={onCancel} btntype="default">
            Hủy
          </Button>
        </div>
      }
      width={800}
    >
      <SpinCustom spinning={loading}>
        <StyledContainer>
          <Form form={form} layout="vertical">
            <Row gutter={[16]}>
              <Col span={24}>
                <Form.Item
                  label="Loại phí"
                  name="priceType"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại phí!" },
                  ]}
                >
                  <Select
                    placeholder="Chọn loại phí"
                    onChange={value =>
                      setSelectedPrice(
                        priceOptions.find(option => option._id === value),
                      )
                    }
                  >
                    {priceOptions.map(option => (
                      <Option key={option._id} value={option._id}>
                        {option.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Đơn vị">
                  <Input
                    value={selectedPrice?.unit || ""}
                    readOnly
                    placeholder="Đơn vị"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Đơn giá"
                  name="price"
                  rules={[
                    { required: true, message: "Giá tiền không được để trống" },
                  ]}
                >
                  <Input type="number" placeholder="Nhập đơn giá" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </StyledContainer>
      </SpinCustom>
    </Modal>
  )
}

export default ModalInsertPrice
