import http from "../index"
import {
  apiGetRoomDetail,
  apiGetBillRoom,
  apiGetBillDetail,
  apiUpdateMember,
  apiInsertMember,
  apiDeleteMember,
  apiMemberDetail,
  apiGetComment,
  apiUpdateNew,
  apiGetNews,
  apiCreateNews,
  apiAddComment,
  apiGetProblems,
  apiUpdateProblems,
  apiGetDetailProblem,
  apiGetRoomProblems,
  apiInsertProblems,
} from "./urls"
import axios from "axios"
// Room Detail
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
// problems của House
const getManagerProblems = houseId => {
  return http.get(apiGetProblems(houseId))
}
const updateProblems = (problemId, problemData) => {
  return http.put(apiUpdateProblems(problemId), problemData)
}
const getDetailProblem = houseId => {
  return http.get(apiGetDetailProblem(houseId))
}
const getRoomProblems = roomId => {
  return http.get(apiGetRoomProblems(roomId))
}
const deleteProblems = problemId => {
  return http.delete(apiUpdateProblems(problemId))
}
const addProblem = roomData => {
  return http.post(apiInsertProblems(), roomData)
}
const RenterService = {
  getRoomDetail,
  getBillRoom,
  getBillDetail,
  getMemberDetail,
  deleteMember,
  insertMember,
  updateMember,
  getNews,
  createNews,
  updateNew,
  deleteNew,
  getComment,
  uploadImageInstance,
  addComment,
  getManagerProblems,
  updateProblems,
  getDetailProblem,
  getRoomProblems,
  deleteProblems,
  addProblem,
}

export default RenterService
