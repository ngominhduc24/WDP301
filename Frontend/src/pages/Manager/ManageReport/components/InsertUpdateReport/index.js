import React, { useState, useEffect } from "react"
import {
  Col,
  Row,
  Select,
  Input,
  Modal,
  Card,
  Form,
  Upload,
  Typography,
  message,
  Tabs,
} from "antd"
import { UploadOutlined, FileImageOutlined } from "@ant-design/icons"
import Button from "src/components/MyButton/Button"
import CustomModal from "src/components/Modal/CustomModal"
import { StylesTabPattern } from "./styled"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import { v4 as uuidv4 } from "uuid"
import Notice from "src/components/Notice"

const { Option } = Select
const { Title, Text } = Typography

const InsertUpdateReport = ({ open, onCancel, onOk }) => {
  const [form] = Form.useForm()
  const [reportImages, setReportImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState({
    reportName: "",
    description: "",
    reportType: "Khác",
    status: "Đang xử lý",
  })

  const handleUploadChange = ({ fileList }) => {
    setReportImages(fileList)
  }

  const handleSaveReport = () => {
    setLoading(true)
    form
      .validateFields()
      .then(values => {
        const report = {
          ...reportData,
          ...values,
          id: uuidv4(),
          createdDate: new Date(),
          images: reportImages.map(file => file.originFileObj),
        }
        console.log("Report Data:", report)
        onOk(report)
        Notice({ isSuccess: true, msg: "Lưu báo cáo sự cố thành công!" })
        onCancel()
      })
      .catch(error => {
        console.error("Lỗi khi lưu báo cáo:", error)
        message.error("Vui lòng kiểm tra lại các trường bắt buộc!")
      })
      .finally(() => setLoading(false))
  }

  const items = [
    {
      key: "1",
      label: <div>Thông tin chung</div>,
      children: (
        <Card>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên sự cố"
                  name="reportName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sự cố!" },
                  ]}
                >
                  <Input placeholder="Nhập tên sự cố" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Loại sự cố"
                  name="reportType"
                  rules={[
                    { required: true, message: "Vui lòng chọn loại sự cố!" },
                  ]}
                >
                  <Select placeholder="Chọn loại sự cố">
                    <Option value="An ninh">An ninh</Option>
                    <Option value="Thiết bị">Thiết bị</Option>
                    <Option value="Môi trường">Môi trường</Option>
                    <Option value="Khác">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Mô tả chi tiết"
                  name="description"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mô tả chi tiết!",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Nhập mô tả chi tiết của sự cố"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ),
    },
    {
      key: "2",
      label: <div>Trạng thái</div>,
      children: (
        <Card>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Trạng thái" name="status">
                  <Select
                    defaultValue={reportData.status}
                    onChange={status =>
                      setReportData({ ...reportData, status })
                    }
                  >
                    <Option value="Đang xử lý">Đang xử lý</Option>
                    <Option value="Hoàn thành">Hoàn thành</Option>
                    <Option value="Đã hủy">Đã hủy</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ghi chú" name="note">
                  <Input.TextArea
                    rows={2}
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ),
    },
    {
      key: "3",
      label: <div>Hình ảnh</div>,
      children: (
        <Card>
          <Upload
            listType="picture"
            multiple={true}
            accept=".png,.jpeg,.jpg"
            beforeUpload={() => false}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
          {reportImages.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Danh sách hình ảnh đã tải lên</Title>
              <div className="d-flex flex-wrap">
                {reportImages.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file.originFileObj)}
                    alt="report"
                    style={{ width: 100, height: 100, marginRight: 16 }}
                  />
                ))}
              </div>
            </div>
          )}
        </Card>
      ),
    },
  ]

  // Render giao diện của modal
  return (
    <CustomModal
      open={open}
      onCancel={onCancel}
      title="Thêm mới báo cáo sự cố"
      width="80vw"
      footer={
        <div className="d-flex justify-content-end">
          <Button type="primary" loading={loading} onClick={handleSaveReport}>
            Lưu
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            Đóng
          </Button>
        </div>
      }
    >
      <StylesTabPattern>
        <Tabs type="card" defaultActiveKey="1" items={items} />
      </StylesTabPattern>
    </CustomModal>
  )
}

export default InsertUpdateReport

