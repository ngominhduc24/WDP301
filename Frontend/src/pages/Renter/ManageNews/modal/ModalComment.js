<<<<<<< HEAD
import React, { useState } from "react"
import { Button, Modal, Input, Avatar, Form, List } from "antd"
import { MessageOutlined, SendOutlined, UserOutlined } from "@ant-design/icons"
import styled from "styled-components"
import CustomModal from "src/components/Modal/CustomModal"

=======
import React, { useState, useEffect } from "react"
import { Button, Modal, Input, Avatar, Form, List, Spin } from "antd"
import { MessageOutlined, SendOutlined, UserOutlined } from "@ant-design/icons"
import styled from "styled-components"
import CustomModal from "src/components/Modal/CustomModal"
import RenterService from "src/services/RenterService"
>>>>>>> hungmq
// Styled component cho nút bình luận
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

const ModalComment = ({ open, onCancel, onSubmit, post }) => {
  const [form] = Form.useForm()
<<<<<<< HEAD
  const [comments, setComments] = useState([
    {
      author: "Minh Vu",
      content: "That khong the tin noi!",
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
=======
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchComments()
    }
  }, [open])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await RenterService.getComment(post._id)
      setComments(response.data.data || [])
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload = { content: values.comment }
      await RenterService.addComment(post._id, payload)
      await fetchComments()

      form.resetFields()
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error)
    } finally {
      setLoading(false)
    }
>>>>>>> hungmq
  }

  return (
    <CustomModal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={
        <div style={{ textAlign: "center", fontSize: "18px" }}>
          Chi Tiết Bài Viết
        </div>
      }
    >
<<<<<<< HEAD
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
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar style={{ backgroundColor: "#87d068" }}>
                  {item.author[0]}
                </Avatar>
              }
              title={<span style={{ fontWeight: "bold" }}>{item.author}</span>}
              description={<p>{item.content}</p>}
            />
          </List.Item>
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
=======
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
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
              {post?.authorId?.name || "Tác giả"}
            </span>
          </div>
          <div style={{ fontSize: "16px", marginBottom: "16px" }}>
            {post.content || "Nội dung bài viết"}
          </div>

          <div
            style={{
              fontWeight: "bold",
              fontSize: "18px",
              marginBottom: "16px",
            }}
          >
            Bình Luận
          </div>

          <List
            dataSource={comments}
            itemLayout="horizontal"
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: "#87d068" }}>
                      {item?.creatorId?.name?.[0]}
                    </Avatar>
                  }
                  title={
                    <span style={{ fontWeight: "bold" }}>
                      {item?.creatorId?.username}
                    </span>
                  }
                  description={<p>{item.content}</p>}
                />
              </List.Item>
            )}
            style={{ marginBottom: "16px" }}
          />

          <Form form={form} layout="vertical">
            <Form.Item
              name="comment"
              rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
            >
              <Input.TextArea
                placeholder="Nhập bình luận của bạn..."
                rows={4}
              />
            </Form.Item>
            <Button
              type="primary"
              icon={<SendOutlined />}
              block
              onClick={handleCommentSubmit}
              loading={loading}
            >
              GỬI BÌNH LUẬN
            </Button>
          </Form>
        </>
      )}
>>>>>>> hungmq
    </CustomModal>
  )
}

export default ModalComment
<<<<<<< HEAD
=======

>>>>>>> hungmq
