import React, { useState, useEffect } from "react"
import { Select, Typography } from "antd"
import Button from "src/components/MyButton/Button"
import CustomModal from "src/components/Modal/CustomModal"
import Notice from "src/components/Notice"
import ManagerService from "src/services/ManagerService"
import SpinCustom from "src/components/Spin"

const { Option } = Select

const InsertUpdateReport = ({
  open,
  onCancel,
  onOk,
  problem,
  defaultStatus,
}) => {
  const [status, setStatus] = useState(defaultStatus || "none")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (defaultStatus) setStatus(defaultStatus)
  }, [defaultStatus])

  const onUpdate = async () => {
    try {
      setLoading(true)
      const payload = { status }
      const response = await ManagerService.updateProblems(
        problem?._id,
        payload,
      )

      if (response?.isError) {
        console.error("Error updating problem:", response.message)
        return
      }

      Notice({ msg: "Cập nhật trạng thái vấn đề thành công!" })
      onOk && onOk()
      onCancel()
    } catch (error) {
      console.error("Error updating problem:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CustomModal
      open={open}
      onCancel={onCancel}
      title={`Cập nhật vấn đề cho phòng ${problem?.roomId?.name || ""}`}
      footer={
        <Button btntype="primary" onClick={onUpdate}>
          Cập nhật
        </Button>
      }
    >
      <SpinCustom spinning={loading}>
        <Select value={status} onChange={setStatus} style={{ width: "100%" }}>
          {status === "none" && <Option value="none">Chưa tiếp nhận</Option>}
          <Option value="pending">Đang chờ giải quyết</Option>
          <Option value="doing">Đang xử lý vấn đề</Option>
          <Option value="done">Đã giải quyết</Option>
        </Select>
      </SpinCustom>
    </CustomModal>
  )
}

export default InsertUpdateReport

