import { Col, Form, Input, Row, Select, Drawer, Upload } from "antd"
import { useEffect, useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import { GUIDE_EMPTY, SYSTEM_KEY } from "src/constants/constants"
import Notice from "src/components/Notice"
import STORAGE, { getStorage } from "src/lib/storage"
import { LeftCircleOutlined, UploadOutlined } from "@ant-design/icons"

const { Option } = Select

const ModalUpdateNews = ({ open, onCancel, onOk, selectedNode }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([]) // State lưu trữ danh sách file upload
  const userInfo = getStorage(STORAGE.USER_INFO)

  // Cập nhật dữ liệu form khi Modal được mở và có dữ liệu selectedNode
  useEffect(() => {
    if (selectedNode) {
      form.setFieldsValue({
        BookingID: selectedNode?.BookingID,
        BookingNote: selectedNode?.BookingNote,
      })

      // Giả lập thêm file vào state fileList nếu có dữ liệu (nếu có API bạn sẽ cập nhật từ server)
      if (selectedNode?.fileList) {
        setFileList(selectedNode.fileList)
      }
    }
  }, [selectedNode, form])

  // Hàm xử lý thay đổi danh sách tệp tải lên
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList)
  }

  // Hàm xử lý khi người dùng bấm nút "Cập nhật"
  const handleUpdateBookingNote = () => {
    form.validateFields().then(values => {
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append("files", file.originFileObj)
      })
      formData.append("data", JSON.stringify(values))

      // Gửi API hoặc xử lý dữ liệu form và file
      setLoading(true)
      // Call API hoặc xử lý dữ liệu (giả lập)
      setTimeout(() => {
        Notice({ msg: "Cập nhật thành công" })
        setLoading(false)
        onOk() // Gọi hàm onOk để đóng modal sau khi hoàn thành
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
          {/* Select chương trình họp */}
          <Col span={24}>
            <Form.Item
              label="Chương trình họp"
              name="BookingID"
              rules={[
                { required: true, message: "Thông tin không được để trống" },
              ]}
            >
              <Select disabled={!!open?.BookingNoteID}>
                {/* Dữ liệu mẫu cho Select */}
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
                placeholder="Cập nhật ghi chú cho bài viết..."
              />
            </Form.Item>
          </Col>

          {/* Upload hình ảnh */}
          <Col span={24}>
            <Form.Item label="Cập nhật ảnh cho bài viết">
              <Upload
                multiple={true}
                listType="picture"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false} // Chặn việc upload tự động
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
            onClick={handleUpdateBookingNote}
          >
            Cập nhật
          </Button>
          <Button btntype="third" className="ml-8" onClick={onCancel}>
            Đóng
          </Button>
        </div>
      </Form>
    </Drawer>
  )
}

export default ModalUpdateNews
