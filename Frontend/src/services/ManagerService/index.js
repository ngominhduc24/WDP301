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
} from "./urls"
import QueryString from "qs"

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
  return http.post(apiInsertRoom(roomId), billData)
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
}

export default ManagerService

