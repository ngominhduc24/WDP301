<<<<<<< HEAD
import React, { useState } from "react"
=======
import React, { useState, useEffect } from "react"
>>>>>>> hungmq
import {
  Row,
  Col,
  Dropdown,
  Menu,
  Modal,
  Button,
  Space,
  Pagination,
<<<<<<< HEAD
  Input,
  Empty,
  Avatar,
  List,
  Comment,
  Form,
=======
  Select,
  Empty,
>>>>>>> hungmq
} from "antd"
import { EllipsisOutlined, MessageOutlined } from "@ant-design/icons"
import SpinCustom from "src/components/Spin"
import { NoteStyle } from "./styled"
import FlInput from "src/components/FloatingLabel/Input"
import SvgIcon from "src/components/SvgIcon"
import ModalInsertNews from "./modal/ModalInsertNews"
import ModalUpdateNews from "./modal/ModalUpdateNews"
import ModalComment from "./modal/ModalComment"
<<<<<<< HEAD
const News = () => {
  // Dữ liệu mẫu ban đầu
  const fakeData = [
    {
      BookingNoteID: 1,
      title: "Tin tức tăng giá phòng",
      content: "Giá phòng tăng 10% trong tháng 10.",
      createdDate: "2024-10-01T03:22:40.844Z",
    },
    {
      BookingNoteID: 2,
      title: "Cập nhật dịch vụ phòng",
      content: "Dịch vụ phòng sẽ có thêm đồ uống miễn phí.",
      createdDate: "2024-10-02T08:22:40.844Z",
    },
  ]

  const [notes, setNotes] = useState(fakeData)
=======
import Notice from "src/components/Notice"
import CB1 from "src/components/Modal/CB1"
import RenterService from "src/services/RenterService"
import STORAGE, { getStorage, setStorage } from "src/lib/storage"

const { Option } = Select

const News = () => {
  const [notes, setNotes] = useState([])
  const userInfo = getStorage(STORAGE.USER_INFO)
  const [selectedHouse, setSelectedHouse] = useState(null)
>>>>>>> hungmq
  const [selectedNote, setSelectedNote] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
<<<<<<< HEAD
  const [loading, setLoading] = useState(false)
  const [selectedNew, setSelectedNew] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [comments, setComments] = useState([])
=======
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedNew, setSelectedNew] = useState(null)
>>>>>>> hungmq
  const [pagination, setPagination] = useState({
    pageSize: 5,
    currentPage: 1,
  })
<<<<<<< HEAD

  // Mở Modal thêm bài viết mới
=======
  useEffect(() => {
    if (userInfo?.roomId) {
      fetchHouse(userInfo?.roomId)
    }
  }, [userInfo?.roomId])
  useEffect(() => {
    if (selectedHouse) {
      fetchNews(selectedHouse)
    }
  }, [selectedHouse])

  const fetchHouse = async () => {
    try {
      setLoading(true)
      const userInfo = getStorage(STORAGE.USER_INFO)
      const response = await RenterService.getRoomDetail(userInfo?.roomId)
      const housesData = response?.data?.houseId || []
      if (housesData) {
        console.log("hello")
        fetchNews(housesData._id)
        setSelectedHouse(housesData._id)
      }
    } catch (error) {
      console.error("Error fetching houses:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNews = async houseId => {
    try {
      setLoading(true)
      const response = await RenterService.getNews(houseId)
      const newsData = response?.data?.data || []
      setNotes(newsData)
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

>>>>>>> hungmq
  const showModal = () => {
    setSelectedNote(null)
    setIsModalOpen(true)
  }

<<<<<<< HEAD
  // Mở Modal chỉnh sửa ghi chú
=======
>>>>>>> hungmq
  const showModalUpdate = note => {
    setSelectedNew(note)
    setIsModalUpdateOpen(true)
  }

<<<<<<< HEAD
  // Hiển thị modal bình luận
  const showCommentModal = post => {
    setSelectedPost(post)
    setComments([{ author: "Minh Vũ", content: "Không thể tin nổi!" }]) // Dữ liệu mẫu cho bình luận
    setIsCommentModalOpen(true)
  }

  // Đóng modal bình luận
=======
  const showCommentModal = post => {
    setSelectedNew(post)
    setIsCommentModalOpen(true)
  }

>>>>>>> hungmq
  const handleCommentModalCancel = () => {
    setIsCommentModalOpen(false)
  }

<<<<<<< HEAD
  // Xóa ghi chú
  const handleDeleteNote = noteID => {
    Modal.confirm({
      title: "Xóa ghi chú",
      content: "Bạn có chắc chắn muốn xóa ghi chú này không?",
      onOk: () => {
        setNotes(notes.filter(note => note.BookingNoteID !== noteID))
=======
  const handleDeleteNews = async noteID => {
    try {
      setLoading(true)
      await RenterService.deleteNew(noteID)
      Notice({ msg: "Xóa bài viết thành công" })
      fetchNews(selectedHouse)
    } catch (error) {
      console.error("Error deleting news:", error)
    } finally {
      setLoading(false)
    }
  }

  const showDeleteConfirm = record => {
    CB1({
      record,
      title: `Bạn có chắc chắn xóa nội dung này?`,
      icon: "warning-usb",
      okText: "Có",
      cancelText: "Không",
      onOk: close => {
        handleDeleteNews(record._id)
        close()
>>>>>>> hungmq
      },
    })
  }

<<<<<<< HEAD
  // Lưu ghi chú mới
  const handleSaveNote = values => {
    if (selectedNote) {
      setNotes(
        notes.map(note =>
          note.BookingNoteID === selectedNote.BookingNoteID
            ? { ...note, ...values }
            : note,
        ),
      )
    } else {
      const newNote = {
        BookingNoteID: notes.length + 1,
        ...values,
        createdDate: new Date().toISOString(),
      }
      setNotes([...notes, newNote])
    }
    setIsModalOpen(false)
  }

  // Cập nhật ghi chú hiện có
  const handleUpdateNote = values => {
    setNotes(
      notes.map(note =>
        note.BookingNoteID === selectedNew.BookingNoteID
          ? { ...note, ...values }
          : note,
      ),
    )
    setIsModalUpdateOpen(false)
  }

  // Xử lý chuyển trang
=======
>>>>>>> hungmq
  const handlePageChange = page => {
    setPagination({ ...pagination, currentPage: page })
  }

<<<<<<< HEAD
  // Thêm bình luận mới vào danh sách bình luận
  const handleAddComment = comment => {
    setComments([...comments, { author: "User", content: comment }])
  }

  // Menu cho các tùy chọn
  const menu = record => (
    <Menu>
      <Menu.Item key="edit" onClick={() => showModalUpdate(record)}>
        Chỉnh sửa
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={() => handleDeleteNote(record.BookingNoteID)}
      >
        Xóa
      </Menu.Item>
    </Menu>
  )
=======
  const handleImageClick = image => {
    setSelectedImage(image)
    setImageModalVisible(true)
  }

  const menu = record => {
    if (record.authorId._id === userInfo._id) {
      return (
        <Menu>
          <Menu.Item key="edit" onClick={() => showModalUpdate(record)}>
            Chỉnh sửa
          </Menu.Item>
          <Menu.Item key="delete" onClick={() => showDeleteConfirm(record)}>
            Xóa
          </Menu.Item>
        </Menu>
      )
    }
    return <></>
  }
>>>>>>> hungmq

  return (
    <SpinCustom spinning={loading}>
      <NoteStyle>
        <div className="title-type-1 d-flex justify-content-space-between align-items-center mt-12 mb-30 mr-12 ml-12">
          <div>Bảng tin</div>
        </div>
        <Row className="mt-8 mb-8 mr-12 ml-12">
          <Col span={24}>
            <FlInput
              onSearch={e => setPagination({ ...pagination, TextSearch: e })}
              search
              allowClear
              label="Nhập từ khóa tìm kiếm"
            />
          </Col>
        </Row>
        <Row className="mr-12 ml-12">
          <Col
            span={24}
            className="d-flex justify-content-space-between align-items-center pt-0 mb-0 pb-8"
          >
            <div>
              <span>{notes.length} Bảng tin</span>
            </div>
            <Space size={8}>
              <div>
                <Button className="btn-add-note" onClick={showModal}>
                  <div className="d-flex">
                    <SvgIcon className="ml-10 mr-8" name="edit" />
<<<<<<< HEAD
                    <span className="mt-2 mr-10">Tạo bài viết mới</span>
=======
                    <span className="mt-2 mr-10">Tạo Tin</span>
>>>>>>> hungmq
                  </div>
                </Button>
              </div>
            </Space>
          </Col>

          <Col span={24} className="mt-30">
            <Space direction="vertical" style={{ width: "100%" }}>
              {notes.length ? (
                notes
                  .slice(
                    (pagination.currentPage - 1) * pagination.pageSize,
                    pagination.currentPage * pagination.pageSize,
                  )
                  .map(record => (
                    <div
<<<<<<< HEAD
                      key={record.BookingNoteID}
=======
                      key={record._id}
>>>>>>> hungmq
                      gutter={16}
                      style={{
                        border: "2px solid #ddd",
                        padding: "12px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <div>
                        <div className="notify-box">
                          <div className="notify-header">
                            <div
                              style={{ color: "white" }}
                              className="mb-8"
<<<<<<< HEAD
                            >{`Chương trình họp: ${record.title}`}</div>
                            {/* <div
=======
                            >{`Tin tức tại nhà: ${record.title}`}</div>
                            <div
>>>>>>> hungmq
                              onClick={e => {
                                e.stopPropagation()
                              }}
                            >
                              <Space
                                style={{
                                  position: "absolute",
                                  right: "24px",
                                  top: "20px",
                                  color: "white",
                                }}
                              >
                                <Dropdown
                                  overlay={menu(record)}
                                  trigger={["click"]}
                                >
                                  <EllipsisOutlined
                                    style={{
                                      fontSize: "24px",
                                      cursor: "pointer",
                                    }}
                                  />
                                </Dropdown>
                              </Space>
<<<<<<< HEAD
                            </div> */}
=======
                            </div>
>>>>>>> hungmq
                          </div>
                          <div
                            style={{ maxWidth: "100%" }}
                            className="notify-content"
                          >
<<<<<<< HEAD
                            <div className="mb-8">{`Ghi chú: ${record.content}`}</div>
=======
                            <div className="mb-8">
                              {`Ghi chú: ${record.content} - ${record.authorId.name} (${record.authorId.accountType})`}
                            </div>
                            {record.images.length > 0 &&
                              record.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt="news"
                                  style={{
                                    maxWidth: "100px",
                                    marginRight: "8px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleImageClick(image)}
                                />
                              ))}
>>>>>>> hungmq
                          </div>
                          <div
                            style={{
                              opacity: 0.5,
                              textAlign: "right",
                              paddingRight: "8px",
                            }}
                          >
<<<<<<< HEAD
                            {new Date(record.createdDate).toLocaleString(
                              "vi-VN",
                            )}
=======
                            {new Date(record.createdAt).toLocaleString("vi-VN")}
>>>>>>> hungmq
                          </div>
                          <Button
                            type="primary"
                            icon={
                              <MessageOutlined style={{ marginRight: 8 }} />
                            }
                            style={{
                              margin: "12px 8px 8px  8px",
                              borderRadius: "4px",
                              display: "block",
                            }}
                            onClick={() => showCommentModal(record)}
                          >
                            Bình Luận
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "12px",
                    margin: "auto",
                    width: "50%",
                  }}
                >
                  <p className="mt-24 fs-14 fw-600 ml-30">
<<<<<<< HEAD
                    <Empty description="Không có ghi chú nào." />
=======
                    <Empty description="Không có tin tức nào." />
>>>>>>> hungmq
                  </p>
                </div>
              )}
            </Space>
            {notes.length !== 0 && (
              <div
                className="d-flex justify-content-flex-end"
                style={{ textAlign: "right", paddingRight: "12px" }}
              >
                <Pagination
                  className="d-flex"
                  total={notes.length}
                  onChange={handlePageChange}
                  pageSize={pagination.pageSize}
                  current={pagination.currentPage}
                />
              </div>
            )}
          </Col>
        </Row>
      </NoteStyle>

<<<<<<< HEAD
      {/* Modal thêm mới ghi chú */}
      <ModalInsertNews
        open={isModalOpen}
        onOk={handleSaveNote}
        onCancel={() => setIsModalOpen(false)}
        note={selectedNote}
      />

      {/* Modal cập nhật ghi chú */}
      <ModalUpdateNews
        open={isModalUpdateOpen}
        onOk={handleUpdateNote}
        onCancel={() => setIsModalUpdateOpen(false)}
        selectedNode={selectedNew}
      />

      <ModalComment
        open={isCommentModalOpen}
        onCancel={handleCommentModalCancel}
        post={selectedPost || {}}
        onSubmit={handleAddComment}
=======
      <ModalInsertNews
        open={isModalOpen}
        onOk={() => fetchNews(selectedHouse)}
        onCancel={() => setIsModalOpen(false)}
        note={selectedNote}
        houseId={selectedHouse}
      />

      <ModalUpdateNews
        open={isModalUpdateOpen}
        onOk={() => fetchNews(selectedHouse)}
        onCancel={() => setIsModalUpdateOpen(false)}
        selectedNode={selectedNew}
        houseId={selectedHouse}
      />

      <Modal
        visible={imageModalVisible}
        footer={null}
        onCancel={() => setImageModalVisible(false)}
      >
        <img src={selectedImage} alt="news-detail" style={{ width: "100%" }} />
      </Modal>

      <ModalComment
        open={isCommentModalOpen}
        onCancel={handleCommentModalCancel}
        post={selectedNew || {}}
>>>>>>> hungmq
      />
    </SpinCustom>
  )
}

export default News
<<<<<<< HEAD
=======

>>>>>>> hungmq
