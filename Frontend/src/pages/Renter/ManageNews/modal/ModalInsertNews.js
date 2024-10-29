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

const ModalInsertNews = ({ open, onCancel, onOk, selectedNode }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])
=======
import { Col, Form, Input, Row, Select, Drawer, Upload, Modal } from "antd"
import { useEffect, useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
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

const ModalInsertNews = ({ open, onCancel, onOk, selectedNode, houseId }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])

>>>>>>> hungmq
  const userInfo = getStorage(STORAGE.USER_INFO)

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList)
  }

<<<<<<< HEAD
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

  const handleInsertBookingNote = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      const imageUrls = await Promise.all(
        fileList.map(async file => {
          const imageUrl = await uploadImage(file.originFileObj)
          return imageUrl
        }),
      )

      const payload = {
        houseId,
        title: values.title,
        content: values.BookingNote,
        images: imageUrls,
      }

      await RenterService.createNews(payload)
      Notice({ msg: "Đăng tin thành công" })

      form.resetFields()
      setFileList([])
      setLoading(false)
      onOk()
      onCancel()
    } catch (error) {
      console.error("Error:", error)
      setLoading(false)
    }
>>>>>>> hungmq
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
<<<<<<< HEAD
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
=======
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
>>>>>>> hungmq
              <Input.TextArea
                style={{ height: "180px", overflow: "hidden auto" }}
                placeholder="Thêm ghi chú cho bài viết..."
              />
            </Form.Item>
          </Col>

<<<<<<< HEAD
          {/* Upload hình ảnh */}
=======
>>>>>>> hungmq
          <Col span={24}>
            <Form.Item label="Thêm ảnh vào bài viết">
              <Upload
                multiple={true}
                listType="picture"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                accept="image/*"
<<<<<<< HEAD
              >
                <Button icon={<UploadOutlined />}>Chọn tệp</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Nút hành động */}
=======
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
                      src={URL.createObjectURL(file.originFileObj)}
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
            </Form.Item>
          </Col>
        </Row>
>>>>>>> hungmq
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
<<<<<<< HEAD
=======

>>>>>>> hungmq
