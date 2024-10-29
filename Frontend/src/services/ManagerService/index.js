import http from "../index"
import {
  apiGetHouseDetail,
  apiGetHouseFloors,
  apiGetRoomFloor,
  apiGetAllRoomInHouse,
  apiGetAllHouses,
  apiCreateHouse,
  apiUtilities,
  apiOtherUtilities,
  apiUpdateHouse,
  apiGetBillDetail,
  apiGetRoomDetail,
  apiGetBillRoom,
  apiMemberDetail,
  apiDeleteMember,
  apiInsertMember,
  apiUpdateMember,
  apiInsertRoom,
  apiInsertListRoom,
  apiDownloadTemplate,
  apiDefaultPrice,
  apiRemovePriceItem,
  apiAddPriceItem,
  apiAddBill,
  apiGetDebt,
  apiGetNews,
  apiCreateNews,
  apiUploadImage,
  apiAddComment,
  apiGetComment,
  apiUpdateNew,
  apiDeleteNew,
  apiBillStatistic,
  apiRevenue,
  apiProblems,
  apiGeneral,
  apiGetProblems,
  apiUpdateProblems,
  apiGetDetailProblem,
  apiGetUser,
  apiGetRoomWithBill,
  apiGetDetailBill,
  apiPaymentByCash,
  apiCreateUser,
  apiUpdateUser,
} from "./urls"
import QueryString from "qs"
import axios from "axios"
const generateRequestId = () => Math.random().toString(36).substring(2, 15)

const getHouseDetail = id => {
  return http.get(apiGetHouseDetail(id))
}

const getHouseFloors = id => {
  return http.get(apiGetHouseFloors(id))
}

const getRoomFloor = (id, floor) => {
  return http.get(apiGetRoomFloor(id, floor))
}

const getAllRoomInHouse = id => {
  return http.get(apiGetAllRoomInHouse(id))
}

const getAllHouses = (page = 1, limit = 10) => {
  const limitObject = {
    requestId: generateRequestId(),
  }

  const params = {
    page: page,
    limit: JSON.stringify(limitObject),
  }

  return http.get(apiGetAllHouses, {
    params,
    paramsSerializer: params => {
      return QueryString.stringify(params, { encode: false, indices: false })
    },
    transformRequest: [
      (data, headers) => {
        headers["Content-Type"] = "application/json"
        return data
      },
    ],
  })
}

const getUtilities = () => {
  return http.get(apiUtilities)
}

const createHouse = body => http.post(apiCreateHouse, body)

const updateHouse = (id, body) => {
  return http.post(apiUpdateHouse(id), body)
}

const otherUtilities = body => {
  return http.post(apiOtherUtilities, body)
}

const getOtherUtilities = () => {
  return http.get(apiOtherUtilities)
}

const getRoomDetail = id => {
  return http.get(apiGetRoomDetail(id))
}

const getBillRoom = id => {
  return http.get(apiGetBillRoom(id))
}
const getBillDetail = id => {
  return http.get(apiGetBillDetail(id))
}
const getMemberDetail = (roomId, memberId) => {
  return http.get(apiMemberDetail(roomId, memberId))
}

const deleteMember = (roomId, memberData) => {
  return http.put(apiDeleteMember(roomId), memberData)
}

const insertMember = (roomId, memberData) => {
  return http.post(apiInsertMember(roomId), memberData)
}

const updateMember = (roomId, memberData) => {
  return http.put(apiUpdateMember(roomId), memberData)
}
// Xóa Phòng
const deleteRoom = roomId => {
  return http.delete(apiGetRoomDetail(roomId))
}
// Thêm phòng
const insertRoom = (houseId, roomData) => {
  return http.post(apiInsertRoom(houseId), roomData)
}

const insertListRoom = body => http.post(apiInsertListRoom, body)

const downloadTemplate = () => {
  return http.get(apiDownloadTemplate)
}
// Config Price List
const getPriceList = () => {
  return http.get(apiDefaultPrice)
}
const removePrice = (houseId, baseId) => {
  return http.put(apiRemovePriceItem(houseId, baseId))
}
const addPrice = (houseId, priceData) => {
  return http.put(apiAddPriceItem(houseId), priceData)
}
// Room Bill
const getDebt = roomId => {
  return http.get(apiGetDebt(roomId))
}
const addBill = (roomId, billData) => {
  return http.post(apiAddBill(roomId), billData)
}
const getRoomWithBill = (houseId, month) => {
  return http.get(apiGetRoomWithBill(houseId, month))
}
const getDetailBill = billId => {
  return http.get(apiGetDetailBill(billId))
}
const paymentByCash = (billId, billData) => {
  return http.post(apiPaymentByCash(billId), billData)
}
// Room News
const getNews = houseId => {
  return http.get(apiGetNews(houseId))
}
const createNews = roomData => {
  return http.post(apiCreateNews(), roomData)
}
const updateNew = (newId, roomData) => {
  return http.put(apiUpdateNew(newId), roomData)
}
const deleteNew = newId => {
  return http.delete(apiUpdateNew(newId))
}
const uploadImageInstance = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/debiqwc2z/image/upload",
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
})
// News Comment
const getComment = newId => {
  return http.get(apiGetComment(newId))
}
const addComment = (newId, roomData) => {
  return http.post(apiAddComment(newId), roomData)
}
const getBillStatistic = month => {
  const url = `${apiBillStatistic}?month=${month}`
  return http.get(url)
}
// Dashboard
const getRevenue = () => {
  return http.get(apiRevenue)
}

const getProblems = () => {
  return http.get(apiProblems)
}

const getGeneralStatistic = () => {
  return http.get(apiGeneral)
}
// problems
const getManagerProblems = houseId => {
  return http.get(apiGetProblems(houseId))
}
const updateProblems = (problemId, problemData) => {
  return http.put(apiUpdateProblems(problemId), problemData)
}
const getDetailProblem = houseId => {
  return http.get(apiGetDetailProblem(houseId))
}

// user
const getUser = (houseId, page = 1, limit = 10) => {
  return http.get(apiGetUser(houseId, page, limit))
}
const updateUser = (id, body) => {
  http.put(apiUpdateUser(id), body)
}
const createUser = body => {
  http.post(apiCreateUser(body))
}
// Get information CCCD
const getIn4CCCD = () => {
  return http.post("https://api.fpt.ai/vision/idr/vnm")
}
const ManagerService = {
  getAllHouses,
  getHouseDetail,
  getHouseFloors,
  getRoomFloor,
  getAllRoomInHouse,
  getUtilities,
  createHouse,
  updateHouse,
  otherUtilities,
  getOtherUtilities,
  getRoomDetail,
  getBillRoom,
  getBillDetail,
  getMemberDetail,
  deleteMember,
  insertMember,
  updateMember,
  insertRoom,
  insertListRoom,
  downloadTemplate,
  getPriceList,
  removePrice,
  addPrice,
  getDebt,
  addBill,
  deleteRoom,
  getNews,
  createNews,
  uploadImageInstance,
  getComment,
  addComment,
  updateNew,
  deleteNew,
  getBillStatistic,
  getRevenue,
  getProblems,
  getGeneralStatistic,
  getManagerProblems,
  updateProblems,
  getDetailProblem,
  getUser,
  getRoomWithBill,
  getDetailBill,
  paymentByCash,
  getIn4CCCD,
  updateUser,
  createUser,
}

export default ManagerService

