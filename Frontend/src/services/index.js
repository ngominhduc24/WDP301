import axios from "axios"
import notice from "src/components/Notice"
import STORAGE, { deleteStorage, getStorage } from "src/lib/storage"
import { getMsgClient } from "src/lib/stringsUtils"
import { trimData } from "src/lib/utils"
import ROUTER from "src/router"
import Cookies from "js-cookie"

/**
 * Parse error response
 */
function parseError(messages) {
  if (messages) {
    if (messages instanceof Array) {
      return Promise.reject({ messages })
    }
    return Promise.reject({ messages: [messages] })
  }
  return Promise.reject({ messages: ["Server quá tải"] })
}

/**
 * Parse response
 */
export function parseBody(response) {
  const resData = response.data

  // Trường hợp lỗi >= 500
  if (+response?.status >= 500) {
    notice({
      msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ`,
      isSuccess: false,
    })
    return resData // Thêm return resData để tránh undefined
  }

  // Trường hợp không phải lỗi >= 500 nhưng không phải là thành công 200
  if (+response?.status < 500 && +response?.status !== 200) {
    return resData // Trả về resData để đảm bảo không bị undefined
  }

  // Trường hợp thành công 200
  if (response?.status === 200) {
    if (resData.StatusCode === 401) {
      deleteStorage(STORAGE.TOKEN)
      return window.location.replace(ROUTER.HOME)
    }
    if (resData.Status === -2) return resData
    if (resData.Status === 0) return resData

    if (resData.Status !== -1 && resData.Status !== 69 && resData.Object) {
      notice({
        msg: getMsgClient(resData.Object?.replace("[MessageForUser]", "")),
        isSuccess: false,
      })
    }
    if (resData.Status !== 1 && resData.Object) {
      return {
        ...resData,
        object: getMsgClient(resData.Object),
      }
    }
    return resData
  }

  // Trường hợp không có điều kiện nào khớp, trả về lỗi
  return parseError(resData?.messages)
}

/**
 * Axios instance
 */
const instance = axios.create({
  // baseURL: '',
  timeout: 60000,
  withCredentials: true,
})

// Request header interceptor
instance.interceptors.request.use(
  config => {
    // Gán baseURL cho config
    config.baseURL = process.env.REACT_APP_ROOT_API
    console.log("Base URL:", config.baseURL) // Kiểm tra baseURL

    // Lấy token từ storage
    const token = getStorage(STORAGE.TOKEN)
    console.log("Token:", token) // Thêm log để kiểm tra token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error.message),
)

// Response interceptor
instance.interceptors.response.use(
  response => {
    console.log("Response data:", response)
    return parseBody(response)
  },
  error => {
    // Lỗi kết nối hoặc không kết nối được tới API
    if (error.code === "ECONNABORTED") {
      notice({
        msg: "Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ",
        isSuccess: false,
      })
    } else if (+error?.response?.status >= 500) {
      notice({
        msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ`,
        isSuccess: false,
      })
    } else if (
      +error?.response?.status < 500 &&
      +error?.response?.status !== 200
    ) {
      notice({
        msg: `Hệ thống xảy ra lỗi. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ (SC${error?.response?.status})`,
        isSuccess: false,
      })
    } else if (error.code === "ERR_NETWORK") {
      notice({
        msg: `Hệ thống đang bị gián đoạn, vui lòng kiểm tra lại đường truyền!`,
        isSuccess: false,
      })
    } else if (typeof error.response === "undefined") {
      notice({ msg: error.message, isSuccess: false })
    } else if (error.response) {
      notice({
        msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ`,
        isSuccess: false,
      })
      return parseError(error.response.data)
    } else {
      notice({
        msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ`,
        isSuccess: false,
      })
    }
    return Promise.reject(error) // Thêm return Promise.reject để đảm bảo lỗi không bị mất
  },
)

export default instance

/**
 * Hàm GET file với axios
 */
export const httpGetFile = (path = "", optionalHeader = {}) =>
  instance({
    method: "GET",
    url: path,
    headers: { ...optionalHeader },
  })

