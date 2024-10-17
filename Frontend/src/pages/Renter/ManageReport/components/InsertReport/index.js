import React, { useState } from "react"
import { Select, Input, Form } from "antd"
import Button from "src/components/MyButton/Button"
import CustomModal from "src/components/Modal/CustomModal"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import RenterService from "src/services/RenterService"

const { Option } = Select
const { TextArea } = Input

const InsertReport = ({ open, onCancel, onOk, roomId }) => {
  const [type, setType] = useState(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const onAddProblem = async () => {
    try {
      await form.validateFields()
      setLoading(true)

      const payload = {
        roomId,
        type,
        title,
        content,
      }

      const response = await RenterService.addProblem(payload)

      if (response?.isError) {
        console.error("Error adding problem:", response.message)
        return
      }

      Notice({ msg: "Thêm vấn đề thành công!" })
      onOk && onOk()
      onCancel()
    } catch (error) {
      console.error("Error adding problem:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CustomModal
      open={open}
      onCancel={onCancel}
      title="Vấn đề cần thông báo"
      footer={
        <Button btntype="primary" onClick={onAddProblem}>
          Gửi đi
        </Button>
      }
    >
      <SpinCustom spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{ type, title, content }}
        >
          <Form.Item
            label="Lựa chọn vấn đề"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn vấn đề" }]}
          >
            <Select
              placeholder="Chọn loại vấn đề"
              onChange={value => setType(value)}
            >
              <Option value="electric">Điện</Option>
              <Option value="water">Nước</Option>
              <Option value="common">Vấn đề cơ bản</Option>
              <Option value="other">Vấn đề khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Tiêu Đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input
              placeholder="Nhập tiêu đề"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Nội Dung vấn đề"
            name="content"
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nội dung"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </Form.Item>
        </Form>
      </SpinCustom>
    </CustomModal>
  )
}

export default InsertReport
