import axios from "axios"
import notice from "src/components/Notice"
import STORAGE, { deleteStorage, getStorage } from "src/lib/storage"
import { getMsgClient } from "src/lib/stringsUtils"
import { trimData } from "src/lib/utils"
import ROUTER from "src/router"

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
  if (+response?.status >= 500) {
    return notice({
      msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ`,
      isSuccess: false,
    })
  }
  if (+response?.status < 500 && +response?.status !== 200) {
    return
  }

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
  return parseError(resData?.messages)
}

/**
 * Axios instance
 */
const instance = axios.create({
  // baseURL: '',
  timeout: 60000,
  withCredentials: true, // Thêm thuộc tính withCredentials để gửi kèm cookies với request
})

// Request header
instance.interceptors.request.use(
  config => {
    config.baseURL = process.env.REACT_APP_ROOT_API

    // Lấy token từ storage
    const token = getStorage(STORAGE.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error.message),
)

// Response parse
instance.interceptors.response.use(
  response => parseBody(response),
  error => {
    // can not connect API
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
      notice({ msg: error.response, isSuccess: false })
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
    return Promise.reject(error)
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
