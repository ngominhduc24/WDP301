import { Col, Form, Input, Row, Select, Drawer, Upload } from "antd"
import { useEffect, useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import { GUIDE_EMPTY, SYSTEM_KEY } from "src/constants/constants"
import Notice from "src/components/Notice"
import STORAGE, { getStorage } from "src/lib/storage"
import { LeftCircleOutlined, UploadOutlined } from "@ant-design/icons"

const { Option } = Select

const ModalInsertNews = ({ open, onCancel, onOk, selectedNode }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const userInfo = getStorage(STORAGE.USER_INFO)

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList)
  }

  const handleInsertBookingNote = () => {
    form.validateFields().then(values => {
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append("files", file.originFileObj)
      })
      formData.append("data", JSON.stringify(values))

      setLoading(true)
      setTimeout(() => {
        Notice({ msg: "Đăng tin thành công" })
        setLoading(false)
        onOk()
      }, 1000)
    })
  }

  return (
    <Drawer
      title={
        <div className="d-flex align-items-center mb-20" onClick={onCancel}>
          <LeftCircleOutlined
            style={{
              margin: "0 8px",
              color: "var(--color-primary)",
              fontSize: "14px",
            }}
          />
          <div className="title-page fs-14 pointer text-uppercase">Trở về</div>
        </div>
      }
      placement="right"
      closable={false}
      onClose={onCancel}
      open={open}
      getContainer={() => document.getElementById("wrap-page")}
      style={{ position: "absolute", top: 50 }}
      width={"100%"}
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Danh sách nhà"
              name="BookingID"
              rules={[
                { required: true, message: "Thông tin không được để trống" },
              ]}
            >
              <Select disabled={!!open?.BookingNoteID}>
                <Option key={1} value={1}>
                  Nhà 1
                </Option>
                <Option key={2} value={2}>
                  Nhà 2
                </Option>
              </Select>
            </Form.Item>
          </Col>

          {/* Nhập ghi chú */}
          <Col span={24}>
            <Form.Item name="BookingNote" label="Ghi chú">
              <Input.TextArea
                style={{ height: "180px", overflow: "hidden auto" }}
                placeholder="Thêm ghi chú cho bài viết..."
              />
            </Form.Item>
          </Col>

          {/* Upload hình ảnh */}
          <Col span={24}>
            <Form.Item label="Thêm ảnh vào bài viết">
              <Upload
                multiple={true}
                listType="picture"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Chọn tệp</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Nút hành động */}
        <div className="d-flex-end mt-20">
          <Button
            btntype="primary"
            loading={loading}
            onClick={handleInsertBookingNote}
          >
            Ghi lại
          </Button>
          <Button btntype="third" className="ml-8" onClick={onCancel}>
            Đóng
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}

export default ModalInsertNews
