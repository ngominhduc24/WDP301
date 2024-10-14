import { Col, Divider, Form, Row, Upload } from "antd"
import React, { useEffect, useState } from "react"
import Button from "src/components/MyButton/Button"
import { normFile } from "src/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { UserOutlined } from "@ant-design/icons"
import SvgIcon from "src/components/SvgIcon"
import { StyleMyAccount } from "./styled"
import STORAGE, { getStorage } from "src/lib/storage"
import Notice from "src/components/Notice"
import LayoutCommon from "src/components/Common/Layout"
import useWindowSize from "src/lib/useWindowSize"
import UserService from "src/services/UserService"
import moment from "moment/moment"
import ModalInsertUpdateProfile from "./components/UpdatePersonProfile"
const PersonProfile = () => {
  const dispatch = useDispatch()
  const [modalUpdatePersonProfile, setModalUpdatePersonProfile] =
    useState(false)
  const [loading, setLoading] = useState(false)
  // const [user, setUser] = useState({})
  const [avatarUpload, setAvatarUpload] = useState("")
  const [avatarUpdated, setAvatarUpdated] = useState(false)
  const userID = getStorage(STORAGE.USER_ID)
  const user = getStorage(STORAGE.USER_INFO)
  console.log(user)
  const uploadImg = async file => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("image", file)
      const res = await UserService.uploadFile(formData)
      setAvatarUpload(file)
    } catch {
      console.log("Upload file error")
    } finally {
      setLoading(false)
    }
  }

  // Đổi ảnh đại diện
  // const changeAvatar = async () => {
  //   try {
  //     setLoading(true)
  //     const formData = new FormData()
  //     formData.append("image", avatarUpload)
  //     const res = await UserService.changeAvatar(userID, formData)
  //     if (res?.status === 200) {
  //       setUser(prevUser => ({
  //         ...prevUser,
  //         avatar: res?.image,
  //       }))
  //       Notice({ msg: "Cập nhật thành công!" })
  //       setAvatarUpload("")
  //       setAvatarUpdated(!avatarUpdated)
  //     } else {
  //       throw new Error("Failed to update avatar")
  //     }
  //   } catch {
  //     console.log("Change avatar error")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Hủy thay đổi ảnh đại diện
  const cancelUpload = () => {
    setAvatarUpload("")
  }

  const isMobile = useWindowSize.isMobile() || false

  return (
    <StyleMyAccount>
      <LayoutCommon>
        <div className="account-infor mb-20">
          <div className="title-type-1 mb-20 d-flex-sb">
            Thông tin tài khoản
            <Button
              btntype="primary"
              onClick={() => setModalUpdatePersonProfile(true)}
            >
              Chỉnh sửa
            </Button>
          </div>
          <Row gutter={[16, 16]}>
            <Col
              xs={24}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              xxl={6}
              className="d-flex-center p-24"
            >
              <div style={{ width: "200px", height: "200px" }}>
                <Form.Item
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  name="Avatar"
                  className="d-flex-center "
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (!!value?.find(i => i?.size > 5 * 1024 * 1024)) {
                          return Promise.reject(
                            new Error("Dung lượng file tối đa 5MB"),
                          )
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Upload
                    beforeUpload={file => {
                      uploadImg(file)
                      return false
                    }}
                    accept="image/*"
                    multiple={false}
                    maxCount={1}
                    fileList={[]}
                  >
                    <div className="upload-avatar">
                      <div className="d-flex justify-content-center">
                        <div className="wrap-avatar">
                          <div className="user-img-box">
                            {!!avatarUpload || !!user?.avatar ? (
                              <img
                                className="user-avatar"
                                src={
                                  avatarUpload
                                    ? URL.createObjectURL(avatarUpload)
                                    : user?.avatar
                                }
                                alt="avatar"
                              />
                            ) : (
                              <div
                                className="user-avatar"
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  backgroundColor: "#ddd",
                                  width: "150px",
                                  height: "150px",
                                  color: "#fff",
                                }}
                              >
                                <UserOutlined style={{ fontSize: "50px" }} />
                              </div>
                            )}
                            <div className="camera-icon mr-20">
                              <SvgIcon name="camera" />
                            </div>
                          </div>
                          <div className="d-flex">
                            {!!avatarUpload && (
                              <>
                                <Button
                                  btntype="third"
                                  className="ml-12 mt-8"
                                  style={{ width: 60 }}
                                  onClick={e => {
                                    e.stopPropagation()
                                    cancelUpload()
                                  }}
                                >
                                  Hủy
                                </Button>
                                <Button
                                  btntype="primary"
                                  className="ml-12 mt-8"
                                  style={{ width: 100 }}
                                  onClick={e => {
                                    e.stopPropagation()
                                    // changeAvatar()
                                    console.log("Lưu ảnh")
                                  }}
                                >
                                  Lưu ảnh
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Upload>
                </Form.Item>
              </div>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={1} xxl={1}>
              <div className="d-flex-center " style={{ height: "100%" }}>
                <Divider
                  className="p-0 m-0"
                  type="vertical"
                  style={{ height: "120px" }}
                />
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={8} xxl={8}>
              <div className={isMobile ? "" : "p-24"}>
                <div className="infor-box">
                  <div className="title-infor">Họ và tên:</div>
                  <div>{user?.name}</div>
                </div>
                <div className="infor-box">
                  <div className="title-infor">Tên tài khoản:</div>
                  <div>{user?.username}</div>
                </div>
                <div className="infor-box">
                  <div className="title-infor">Email:</div>
                  <div>{user?.email}</div>
                </div>
                <div className="infor-box">
                  <div className="title-infor">Loại tài khoản:</div>
                  <div>{user?.accountType}</div>
                </div>
                <div className="infor-box">
                  <div className="title-infor">Ngày tạo:</div>
                  <div>{moment(user?.createdAt).format("DD/MM/YYYY")}</div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={8} xxl={8}>
              <div className={isMobile ? "" : "p-24"}>
                <div className="infor-box">
                  <div className="title-infor">Số điện thoại:</div>
                  <div>{user?.phone || "Chưa cập nhật"}</div>
                </div>
                <div className="infor-box">
                  <div className="title-infor">Trạng thái tài khoản:</div>
                  <div>
                    {user?.status ? "Đang hoạt động" : "Dừng hoạt động"}
                  </div>
                </div>

                <div className="infor-box">
                  <div className="title-infor">payosClientId:</div>
                  <div>{user?.payosClientId || "Chưa cập nhật"}</div>
                </div>
                <div className="infor-box">
                  <div className="title-infor">payosAPIKey:</div>
                  <div>{user?.payosAPIKey || "Chưa cập nhật"}</div>
                </div>
                <div className="infor-box">
                  <div className="title-infor">payosCheckSum:</div>
                  <div>{user?.payosCheckSum || "Chưa cập nhật"}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </LayoutCommon>

      {!!modalUpdatePersonProfile && (
        <ModalInsertUpdateProfile
          open={modalUpdatePersonProfile}
          userProfile={user}
          onCancel={() => setModalUpdatePersonProfile(false)}
          onOk={() => {
            // getInfo()
            setModalUpdatePersonProfile(false)
          }}
        />
      )}
    </StyleMyAccount>
  )
}

export default PersonProfile

