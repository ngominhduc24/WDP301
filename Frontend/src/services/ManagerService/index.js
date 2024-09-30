import http from "../index"
import { apiGetAllHouses } from "./urls"
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

const ManagerService = {
  getAllHouses,
}

export default ManagerService
