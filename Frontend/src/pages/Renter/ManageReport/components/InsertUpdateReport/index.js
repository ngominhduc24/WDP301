import React, { useState, useEffect } from "react"
import { Input, Typography } from "antd"
import Button from "src/components/MyButton/Button"
import CustomModal from "src/components/Modal/CustomModal"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import RenterService from "src/services/RenterService"
const { TextArea } = Input

const InsertUpdateReport = ({ open, onCancel, onOk, problem }) => {
  const [title, setTitle] = useState(problem?.title || "")
  const [content, setContent] = useState(problem?.content || "")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (problem) {
      setTitle(problem?.title || "")
      setContent(problem?.content || "")
    }
  }, [problem])

  const onUpdate = async () => {
    try {
      setLoading(true)
      const payload = { title, content }
      const response = await RenterService.updateProblems(problem?._id, payload)

      if (response?.isError) {
        console.error("Error updating problem:", response.message)
        return
      }

      Notice({ msg: "Cập nhật vấn đề thành công!" })
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
      title="Cập nhật vấn đề"
      footer={
        <Button btntype="primary" onClick={onUpdate}>
          Cập nhật
        </Button>
      }
    >
      <SpinCustom spinning={loading}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Typography.Text>Tiêu Đề</Typography.Text>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề"
          />
          <Typography.Text>Nội Dung</Typography.Text>
          <TextArea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Nhập nội dung"
            rows={4}
          />
        </div>
      </SpinCustom>
    </CustomModal>
  )
}

export default InsertUpdateReport

