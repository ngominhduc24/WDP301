import React, { useState, useEffect } from "react"
import { Col, Row, Space, Tooltip, Modal, Button, Select, Avatar } from "antd"
import { useSelector } from "react-redux"
import SpinCustom from "src/components/Spin"
import Notice from "src/components/Notice"
import { DownloadOutlined } from "@ant-design/icons"

const { Option } = Select

const ModalViewDetailReport = ({ visible, onCancel, report, onOk }) => {
  const [loading, setLoading] = useState(false)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  // Cập nhật trạng thái của báo cáo sự cố
  const handleChangeStatus = async newStatus => {
    try {
      setLoading(true)
      const updatedReport = { ...report, status: newStatus }
      // Giả lập cập nhật trạng thái báo cáo sự cố
      onOk(updatedReport)
      Notice({
        isSuccess: true,
        msg: "Cập nhật trạng thái báo cáo thành công!",
      })
    } catch (error) {
      console.error("Error updating report status:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      title="Chi Tiết Báo Cáo Sự Cố"
      width="800px"
      footer={
        <div style={{ textAlign: "right" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Đóng
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => console.log("Exporting report...")}
          >
            Xuất báo cáo
          </Button>
        </div>
      }
    >
      <SpinCustom spinning={loading}>
        {/* Bố cục nội dung Modal */}
        <Row gutter={16}>
          {/* Cột bên trái hiển thị thông tin chi tiết */}
          <Col span={12}>
            <h3>Thông tin báo cáo</h3>
            <p>
              <strong>Tên báo cáo:</strong> {report?.reportName}
            </p>
            <p>
              <strong>Loại báo cáo:</strong> {report?.reportType}
            </p>
            <p>
              <strong>Người tạo:</strong> {report?.createdBy}
            </p>
            <p>
              <strong>Ngày tạo:</strong>{" "}
              {report?.createdDate?.toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Mô tả sự cố:</strong>
              <br />
              {report?.description || "Không có mô tả"}
            </p>
            <p>
              <strong>Trạng thái:</strong>
              <Select
                defaultValue={report?.status}
                onChange={handleChangeStatus}
                style={{ width: 200, marginTop: 8 }}
              >
                <Option value="Hoàn thành">Hoàn thành</Option>
                <Option value="Đang xử lý">Đang xử lý</Option>
                <Option value="Đã hủy">Đã hủy</Option>
              </Select>
            </p>
          </Col>

          {/* Cột bên phải hiển thị hình ảnh sự cố */}
          <Col span={12}>
            <h3>Hình ảnh sự cố</h3>
            {report?.image ? (
              <img
                src={report?.image}
                alt="Sự cố"
                style={{
                  width: "100%",
                  height: "auto",
                  cursor: "pointer",
                  borderRadius: 8,
                }}
                onClick={() => {
                  setSelectedImage(report?.image)
                  setImageModalVisible(true)
                }}
              />
            ) : (
              <Avatar
                shape="square"
                size={200}
                style={{ display: "block", margin: "auto" }}
              >
                Không có ảnh
              </Avatar>
            )}
          </Col>
        </Row>

        {/* Modal hiển thị ảnh chi tiết */}
        <Modal
          visible={imageModalVisible}
          footer={null}
          onCancel={() => setImageModalVisible(false)}
        >
          <img
            alt="product"
            style={{ width: "100%", borderRadius: 8 }}
            src={selectedImage}
          />
        </Modal>
      </SpinCustom>
    </Modal>
  )
}

export default ModalViewDetailReport
