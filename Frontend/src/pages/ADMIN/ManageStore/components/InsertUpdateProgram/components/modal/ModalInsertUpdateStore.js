import { Col, Form, Row } from "antd"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"

const ModalInsertUpdateStore = ({ open, onOk, onCancel, documents }) => {
  const [form] = Form.useForm()

  return (
    <CustomModal
      title="Thêm mới cửa hàng"
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      footer={
        <div className="d-flex-end">
          <Button
            btntype="primary"
            // onClick={() => hanndeInsertUpdateContent()}
          >
            {!!open?.ContentID ? "Lưu" : "Thêm"}
          </Button>
          <Button
            btntype="third"
            className="ml-8 mt-12 mb-12"
            onClick={() => onCancel()}
          >
            Đóng
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên cửa hàng:"
              rules={[
                { required: true, message: "Thông tin không được bỏ trống" },
              ]}
            ></Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="location"
              label="Địa chỉ:"
              rules={[
                { required: true, message: "Thông tin không được bỏ trống" },
              ]}
            ></Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="phone"
              label="Điện thoại:"
              rules={[
                { required: true, message: "Bạn phải nhập số điện thoại" },
              ]}
            ></Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="email"
              label="Email:"
              rules={[
                { required: true, message: "Bạn phải nhập email của cửa hàng" },
              ]}
            ></Form.Item>
          </Col>
        </Row>
      </Form>
    </CustomModal>
  )
}

export default ModalInsertUpdateStore
