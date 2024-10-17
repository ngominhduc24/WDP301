import React, { useState } from "react"
import {
  Button,
  Modal,
  Input,
  Row,
  Col,
  Avatar,
  Form,
  List,
  Comment,
} from "antd"
import { MessageOutlined, SendOutlined, UserOutlined } from "@ant-design/icons"
import styled from "styled-components"

const CommentButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background-color: #3f51b5;
  color: white;
  font-weight: bold;
  height: 40px;
  &:hover {
    background-color: #2c3e90;
  }
`

const StyledModal = styled(Modal)`
  .ant-modal-header {
    background-color: #3f51b5;
    color: white;
    text-align: center;
  }
  .ant-modal-title {
    color: white;
    text-align: center;
  }
  .ant-modal-footer {
    display: flex;
    justify-content: center;
  }
  .ant-modal-content {
    border-radius: 8px;
  }
`

const CommentModal = ({ open, onCancel, onSubmit, post }) => {
  const [form] = Form.useForm()
  const [comments, setComments] = useState([
    {
      author: "Mac Hungg",
      content: "Mọi người lưu ý",
    },
  ])

  const handleCommentSubmit = () => {
    form.validateFields().then(values => {
      const newComment = {
        author: "User",
        content: values.comment,
      }
      setComments([...comments, newComment])
      form.resetFields()
    })
  }

  return (
    <StyledModal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={
        <div style={{ textAlign: "center", fontSize: "18px" }}>
          Chi Tiết Bài Viết
        </div>
      }
    >
      {/* Hiển thị thông tin bài viết */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        <Avatar
          style={{ backgroundColor: "#87d068" }}
          icon={<UserOutlined />}
        />
        <span style={{ marginLeft: "8px", fontSize: "16px" }}>
          {post.author || "Tác giả"}
        </span>
      </div>
      <div style={{ fontSize: "16px", marginBottom: "16px" }}>
        {post.content || "Nội dung bài viết"}
      </div>

      {/* Tiêu đề phần bình luận */}
      <div
        style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }}
      >
        Bình Luận
      </div>

      {/* Hiển thị danh sách bình luận */}
      <List
        dataSource={comments}
        itemLayout="horizontal"
        renderItem={item => (
          <Comment
            author={<span style={{ fontWeight: "bold" }}>{item.author}</span>}
            avatar={
              <Avatar style={{ backgroundColor: "#87d068" }}>
                {item.author[0]}
              </Avatar>
            }
            content={<p>{item.content}</p>}
          />
        )}
        style={{ marginBottom: "16px" }}
      />

      {/* Form nhập bình luận mới */}
      <Form form={form} layout="vertical">
        <Form.Item
          name="comment"
          rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
        >
          <Input.TextArea placeholder="Nhập bình luận của bạn..." rows={4} />
        </Form.Item>
        <Button
          type="primary"
          icon={<SendOutlined />}
          block
          onClick={handleCommentSubmit}
        >
          GỬI BÌNH LUẬN
        </Button>
      </Form>
    </StyledModal>
  )
}

export default CommentModal
