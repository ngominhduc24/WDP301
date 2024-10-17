import { Col, Form, Input, Row, Drawer, Upload } from "antd"
import { useEffect, useState } from "react"
import Button from "src/components/MyButton/Button"
import {
  LeftCircleOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons"
import Notice from "src/components/Notice"
import axios from "axios"
// import STORAGE, { getStorage } from "src/lib/storage"
import RenterService from "src/services/RenterService"
// const { Option } = Select

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
  // const [initialImages, setInitialImages] = useState([])

  // const userInfo = getStorage(STORAGE.USER_INFO)

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList)
  }

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
  }, [selectedNode, form])

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
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Thêm ảnh vào bài viết">
              <Upload
                multiple={true}
                listType="picture"
                fileList={fileList}
                onChange={handleFileChange}
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
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex-end mt-20">
          <Button
            btntype="primary"
            loading={loading}
            onClick={handleUpdateNews}
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

export default ModalUpdateNews
