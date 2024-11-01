import { Checkbox, Col, Divider, Form, Input, Row } from "antd"
import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import Button from "src/components/MyButton/Button"
import STORAGE, { getStorage, setStorage } from "src/lib/storage"
import { StoreContext } from "src/lib/store"
import {
  setIsAdmin,
  setIsRepresentative,
  setIsUser,
  setListTabs,
  setUserInfo,
} from "src/redux/appGlobal"
import ROUTER from "src/router"
import AuthService from "src/services/AuthService"
import { StyleLoginPage } from "./styled"
import { hasPermission } from "src/lib/utils"
import { MenuItemAdmin, MenuItemUser } from "src/components/Layouts/MenuItems"
import { setOpenChangePassModal } from "src/redux/loginModal"
import login from "src/assets/images/modalLogin/login.png"
import useWindowSize from "src/lib/useWindowSize"
import { jwtDecode } from "jwt-decode"
import Notice from "src/components/Notice"
import UserService from "src/services/UserService"
const LoginPage = () => {
  const isLogin = getStorage(STORAGE.TOKEN)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const userInfo = getStorage(STORAGE.USER_INFO)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { routerStore } = useContext(StoreContext)
  const isLaptop = useWindowSize.isLaptop() || false
  const isDesktop = useWindowSize.isDesktop() || false
  const isMobile = useWindowSize.isMobile() || false
  const isTablet = useWindowSize.isTablet() || false
  const [routerBeforeLogin, setRouterBeforeLogin] = routerStore
  useEffect(() => {
    if (!!isLogin) {
      loginSuccess(userInfo)
    }
  }, [])

  const handleError = error => {
    console.error("Login error:", error)
    Notice({
      isSuccess: false,
      msg: "Sai tài khoản hoặc mật khẩu không đúng. Vui lòng thử lại.",
      place: "topRight",
    })
  }

  const handleSuccess = () => {
    Notice({
      isSuccess: true,
      msg: "Đăng nhập thành công!",
      place: "topRight",
    })
  }
  const loginSuccess = data => {
    handleSuccess()
    const userID = getStorage(STORAGE.USER_ID)
    if (routerBeforeLogin) navigate(routerBeforeLogin)
    if (data) {
      if (data.accountType === "admin") {
        dispatch(setIsAdmin(true))
        navigate(ROUTER.ADMIN_DASHBOARD)
      } else if (data.accountType === "renter") {
        navigate(ROUTER.RENTER_ROOM)
      } else if (data.accountType === "host") {
        navigate(ROUTER.MANAGER_DASHBOARD)
      } else if (data.roaccountTypele === "WAREHOUSE MANAGER") {
        navigate(ROUTER.WAREHOUSE_MANAGER_DASHBOARD)
      }
      if (data.IsFirstLogin) {
        dispatch(setOpenChangePassModal(true))
      }
    } else {
      console.error("User data is undefined.")
    }
  }

  const onLogin = async () => {
    console.log("hello")
    try {
      setLoading(true)
      const values = await form.validateFields()
      const res = await AuthService.login({ ...values })
      // const decodedToken = jwtDecode(res?.token)
      console.log(res)
      if (res) {
        setStorage(STORAGE.TOKEN, res?.accessToken)
        // setStorage(STORAGE.USER_ID, decodedToken.payload.id)
        setStorage(STORAGE.USER_INFO, res?.data)
        // const userInfo = await getInfo(decodedToken.payload.id)
        // dispatch(setUserInfo(decodedToken.payload))
        setRouterBeforeLogin(undefined)
        loginSuccess(res?.data)
      } else if (res?.status === 500) {
        Notice({
          isSuccess: false,
          msg: "Vui lòng thử lại.",
          place: "topRight",
        })
      }
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const getInfo = async id => {
    try {
      const res = await UserService.getUserById(id)
      console.log("res", res)
      setStorage(STORAGE.USER_INFO, res)
      if (res?.isError) return
      return res
    } catch (error) {
      console.error("Error fetching warehouse info:", error)
    }
  }

  return (
    <div>
      <StyleLoginPage>
        <div className="d-flex-center">
          <div style={{ maxWidth: isMobile ? "330px" : "1000px" }}>
            <Row className="d-flex-center">
              <Col className="content-wrap" span={24}>
                <Row gutter={[16, 16]} justify="center" align="middle">
                  <Col lg={10} md={12} sm={20} xs={20}>
                    <div className="d-flex flex-column justify-content-center h-100">
                      <div className="text-center mb-30">
                        <div
                          style={{
                            fontSize: isMobile || isTablet ? "22px" : "28px",
                          }}
                          className=" fw-600 title-form"
                        >
                          Đăng nhập
                        </div>
                      </div>
                      <div className="pl-20 pr-20">
                        <Form form={form} layout="vertical">
                          <Form.Item
                            label="Tài khoản"
                            required
                            rules={[
                              {
                                required: true,
                                message: "Thông tin không được để trống!",
                              },
                            ]}
                            name="email"
                          >
                            <Input placeholder="Nhập tài khoản" />
                          </Form.Item>
                          <Form.Item
                            label="Mật khẩu"
                            rules={[
                              {
                                required: true,
                                message: "Bạn chưa nhập mật khẩu!",
                              },
                            ]}
                            name="password"
                          >
                            <Input.Password placeholder="Nhập mật khẩu" />
                          </Form.Item>
                          <Form.Item name="remember" valuePropName="checked">
                            <Checkbox
                              onChange={val =>
                                localStorage.setItem(
                                  STORAGE.REMEMBER_LOGIN,
                                  JSON.stringify(val.target.checked),
                                )
                              }
                              value={getStorage(STORAGE.REMEMBER_LOGIN)}
                            >
                              Duy trì đăng nhập
                            </Checkbox>
                          </Form.Item>
                          <Row>
                            <Button
                              loading={loading}
                              btntype="primary"
                              className="btn-login"
                              type="submit"
                              htmlType="submit"
                              onClick={onLogin}
                            >
                              Đăng nhập
                            </Button>
                          </Row>
                        </Form>
                      </div>
                    </div>
                  </Col>
                  {!isMobile && !isTablet && (
                    <Col lg={10} md={12} sm={20} xs={20}>
                      <div
                        style={{ width: "500px", height: "500px" }}
                        className="d-flex justify-content-center"
                      >
                        <img
                          style={{
                            maxWidth: "100%",
                          }}
                          src={login}
                          alt="login"
                        />
                      </div>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      </StyleLoginPage>
    </div>
  )
}

export default LoginPage

