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
}

export default ManagerService
