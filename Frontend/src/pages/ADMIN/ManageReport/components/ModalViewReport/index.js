import React, { useState, useEffect } from "react"
import { Modal, Row, Col, Typography, Select } from "antd"
import SpinCustom from "src/components/Spin"
import InsertUpdateReport from "../InsertUpdateReport"
import Button from "src/components/MyButton/Button"
import CustomModal from "src/components/Modal/CustomModal"
import ManagerService from "src/services/ManagerService"
import Notice from "src/components/Notice"

const { Title, Text } = Typography
const { Option } = Select

const ModalViewDetailReport = ({ open, onCancel, onOk, problemId }) => {
  const [problem, setProblem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState("none")

  const getProblemDetail = async id => {
    try {
      setLoading(true)
      const response = await ManagerService.getDetailProblem(id)
      const data = response.data || {}
      setProblem(data)
      setStatus(data.status)
    } catch (error) {
      console.error("Error fetching problem details:", error)
      Notice({ msg: "Không thể lấy chi tiết vấn đề" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && problemId) {
      getProblemDetail(problemId)
    }
  }, [open, problemId])

  const handleUpdate = () => {
    setIsModalOpen(true)
  }

  const handleUpdateSuccess = async () => {
    setIsModalOpen(false)
    await getProblemDetail(problemId)
    onOk()
  }

  const renderStatus = status => {
    switch (status) {
      case "none":
        return "Chưa tiếp nhận"
      case "pending":
        return "Đang chờ giải quyết"
      case "doing":
        return "Đang xử lý vấn đề"
      case "done":
        return "Đã giải quyết"
      default:
        return status
    }
  }

  return (
    <>
      <CustomModal
        visible={open}
        onCancel={onCancel}
        title="Chi Tiết Sự Cố"
        width="600px"
        footer={
          <div className="d-flex">
            <Button btntype="third" className="mt-12 mb-12" onClick={onCancel}>
              Đóng
            </Button>
            <Button
              btntype="primary"
              className="ml-8 mt-12 mb-12"
              onClick={handleUpdate}
            >
              Cập nhật
            </Button>
          </div>
        }
      >
        <SpinCustom spinning={loading}>
          {problem ? (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Text strong>Người tạo:</Text>{" "}
                {problem.creatorId?.username || "Không xác định"}
              </Col>
              <Col span={24}>
                <Text strong>Phòng:</Text> {problem.roomId?.name || "Không có"}
              </Col>
              <Col span={24}>
                <Text strong>Ngày tạo:</Text>{" "}
                {new Date(problem.createdAt).toLocaleString("vi-VN")}
              </Col>
              <Col span={24}>
                <Text strong>Tiêu đề:</Text> {problem.title}
              </Col>
              <Col span={24}>
                <Text strong>Nội dung:</Text> {problem.content}
              </Col>
              <Col span={24}>
                <Text strong>Trạng thái:</Text> {renderStatus(status)}
              </Col>
            </Row>
          ) : (
            <Text>Không tìm thấy chi tiết sự cố.</Text>
          )}
        </SpinCustom>
      </CustomModal>

      <InsertUpdateReport
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdateSuccess}
        problem={problem}
        defaultStatus={problem?.status}
      />
    </>
  )
}

export default ModalViewDetailReport

