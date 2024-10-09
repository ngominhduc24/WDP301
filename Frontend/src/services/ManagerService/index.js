import http from "../index"
import {
  apiGetAllHouses,
  apiCreateHouse,
  apiUtilities,
  apiOtherUtilities,
  apiUpdateHouse,
} from "./urls"
import QueryString from "qs"

const generateRequestId = () => Math.random().toString(36).substring(2, 15)

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
  getUtilities,
  createHouse,
  updateHouse,
  otherUtilities,
  getOtherUtilities,
}

export default ManagerService
