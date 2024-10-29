<<<<<<< HEAD
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
=======
import { Col, Form, Input, Row, Select, Drawer, Upload, Modal } from "antd"
import { useEffect, useState } from "react"
import Button from "src/components/MyButton/Button"
import {
  LeftCircleOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons"
import Notice from "src/components/Notice"
import axios from "axios"
import STORAGE, { getStorage } from "src/lib/storage"
import RenterService from "src/services/RenterService"
const { Option } = Select

const uploadImageInstance = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/debiqwc2z/image/upload",
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
})

const ModalUpdateNews = ({ open, onCancel, onOk, selectedNode, houseId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
  const [initialImages, setInitialImages] = useState([])

  const userInfo = getStorage(STORAGE.USER_INFO)

>>>>>>> hungmq
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList)
  }

<<<<<<< HEAD
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

=======
  const handleRemoveImage = file => {
    const updatedFileList = fileList.filter(item => item.uid !== file.uid)
    setFileList(updatedFileList)
  }

  const uploadImage = async file => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "demo_api_image")
    formData.append("folder", "rms")
    const response = await uploadImageInstance.post("/", formData)
    return response.data.secure_url
  }

  const handleUpdateNews = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const imageUrls = await Promise.all(
        fileList.map(async file => {
          if (file.originFileObj) {
            const imageUrl = await uploadImage(file.originFileObj)
            return imageUrl
          } else {
            return file.url
          }
        }),
      )

      const payload = {
        houseId,
        title: values.title,
        content: values.BookingNote,
        images: imageUrls,
      }

      await RenterService.updateNew(selectedNode._id, payload)
      Notice({ msg: "Cập nhật thành công" })

      form.resetFields()
      setFileList([])
      setLoading(false)
      onOk()
      onCancel()
    } catch (error) {
      console.error("Error:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(selectedNode)
    if (selectedNode) {
      form.setFieldsValue({
        title: selectedNode?.title || "",
        BookingNote: selectedNode?.content || "",
      })

      const initialImages = selectedNode?.images?.map((url, index) => ({
        uid: index,
        name: `image-${index}`,
        status: "done",
        url: url,
      }))
      setFileList(initialImages || [])
    }
  }, [selectedNode])

>>>>>>> hungmq
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
<<<<<<< HEAD
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
=======
          <Col span={24}>
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Tiêu đề của bài viết" />
            </Form.Item>

            <Form.Item
              name="BookingNote"
              label="Ghi chú"
              rules={[{ required: true, message: "Vui lòng nhập ghi chú" }]}
            >
              <Input.TextArea
                style={{ height: "180px", overflow: "hidden auto" }}
                placeholder="Thêm ghi chú cho bài viết..."
>>>>>>> hungmq
              />
            </Form.Item>
          </Col>

<<<<<<< HEAD
          {/* Upload hình ảnh */}
          <Col span={24}>
            <Form.Item label="Cập nhật ảnh cho bài viết">
=======
          <Col span={24}>
            <Form.Item label="Thêm ảnh vào bài viết">
>>>>>>> hungmq
              <Upload
                multiple={true}
                listType="picture"
                fileList={fileList}
                onChange={handleFileChange}
<<<<<<< HEAD
                beforeUpload={() => false} // Chặn việc upload tự động
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Chọn tệp</Button>
              </Upload>
=======
                beforeUpload={() => false}
                accept="image/*"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Chọn tệp</Button>
              </Upload>

              <div
                style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}
              >
                {fileList.map((file, index) => (
                  <div
                    key={index}
                    style={{ position: "relative", marginRight: "10px" }}
                  >
                    <img
                      src={file.url || URL.createObjectURL(file.originFileObj)}
                      alt="Selected"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <CloseOutlined
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        color: "red",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRemoveImage(file)}
                    />
                  </div>
                ))}
              </div>
>>>>>>> hungmq
            </Form.Item>
          </Col>
        </Row>

<<<<<<< HEAD
        {/* Nút hành động */}
=======
>>>>>>> hungmq
        <div className="d-flex-end mt-20">
          <Button
            btntype="primary"
            loading={loading}
<<<<<<< HEAD
            onClick={handleUpdateBookingNote}
          >
            Cập nhật
=======
            onClick={handleUpdateNews}
          >
            Ghi lại
>>>>>>> hungmq
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
<<<<<<< HEAD
=======

>>>>>>> hungmq
