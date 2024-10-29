import React, { useState, useEffect } from "react"
import {
  Row,
  Col,
  Dropdown,
  Menu,
  Modal,
  Button,
  Space,
  Pagination,
  Select,
  Empty,
} from "antd"
import { EllipsisOutlined, MessageOutlined } from "@ant-design/icons"
import SpinCustom from "src/components/Spin"
import { NoteStyle } from "./styled"
import FlInput from "src/components/FloatingLabel/Input"
import SvgIcon from "src/components/SvgIcon"
import ModalInsertNews from "./modal/ModalInsertNews"
import ModalUpdateNews from "./modal/ModalUpdateNews"
import ModalComment from "./modal/ModalComment"
import Notice from "src/components/Notice"
import CB1 from "src/components/Modal/CB1"
import RenterService from "src/services/RenterService"
import STORAGE, { getStorage, setStorage } from "src/lib/storage"

const { Option } = Select

const News = () => {
  const [notes, setNotes] = useState([])
  const userInfo = getStorage(STORAGE.USER_INFO)
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [selectedNote, setSelectedNote] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [imageModalVisible, setImageModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedNew, setSelectedNew] = useState(null)
  const [pagination, setPagination] = useState({
    pageSize: 5,
    currentPage: 1,
  })
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

  const showModal = () => {
    setSelectedNote(null)
    setIsModalOpen(true)
  }

  const showModalUpdate = note => {
    setSelectedNew(note)
    setIsModalUpdateOpen(true)
  }

  const showCommentModal = post => {
    setSelectedNew(post)
    setIsCommentModalOpen(true)
  }

  const handleCommentModalCancel = () => {
    setIsCommentModalOpen(false)
  }

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
      },
    })
  }

  const handlePageChange = page => {
    setPagination({ ...pagination, currentPage: page })
  }

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
                    <span className="mt-2 mr-10">Tạo Tin</span>
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
                      key={record._id}
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
                            >{`Tin tức tại nhà: ${record.title}`}</div>
                            <div
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
                            </div>
                          </div>
                          <div
                            style={{ maxWidth: "100%" }}
                            className="notify-content"
                          >
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
                          </div>
                          <div
                            style={{
                              opacity: 0.5,
                              textAlign: "right",
                              paddingRight: "8px",
                            }}
                          >
                            {new Date(record.createdAt).toLocaleString("vi-VN")}
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
                    <Empty description="Không có tin tức nào." />
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
      />
    </SpinCustom>
  )
}

export default News

