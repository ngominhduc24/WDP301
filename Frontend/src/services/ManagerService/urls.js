export const apiGetAllHouses = `house?option=all`
export const apiCreateHouse = `house`
export const apiUtilities = `utilities/`
export const apiOtherUtilities = `utilities/otherUtilities`
export const apiUpdateHouse = id => `house/${id}`

// Rooms APIs
export const apiGetHouseDetail = id => `house/${id}`
export const apiGetHouseFloors = id => `house/${id}/floor`
export const apiGetRoomFloor = (id, floor) =>
  `house/${id}/room?option=all&floor=${floor}&page=1&limit=30`
export const apiGetAllRoomInHouse = id => `house/${id}/room?option=all`
export const apiInsertRoom = houseId => `house/room/addOne/${houseId}`
export const apiInsertListRoom = `house/room`
export const apiDownloadTemplate = `downloadTemplate`

// Room Detail
export const apiGetRoomDetail = id => `house/room/${id}`
export const apiGetBillRoom = id => `bill/dept/room/${id}`
export const apiGetBillDetail = id => `bill?roomId=${id}`

// Room Members API
export const apiMemberDetail = (roomId, memberId) =>
  `house/room/${roomId}/member/${memberId}`
export const apiDeleteMember = id => `house/room/${id}/delete/member`
export const apiInsertMember = id => `house/room/${id}/member`
export const apiUpdateMember = id => `house/room/${id}/member`

// Room Config
export const apiDefaultPrice = `defaultPrice`
export const apiRemovePriceItem = (houseId, baseId) =>
  `house/${houseId}/removePriceItem/${baseId}`
export const apiAddPriceItem = houseId => `house/${houseId}/addPriceItem`

// Room Bill
export const apiAddBill = roomId => `bill/room/${roomId}`
export const apiGetDebt = roomId => `bill/debt/room/${roomId}`
export const apiGetRoomWithBill = (houseId, month) =>
  `house/${houseId}/getRoomWithBills?month=${month}`
export const apiGetDetailBill = billId => `bill/${billId}`
export const apiPaymentByCash = billId => `bill/${billId}`

// House News
export const apiGetNews = houseId => `news/house/${houseId}`
export const apiCreateNews = houseId => `news`
export const apiUpdateNew = newId => `news/${newId}`
export const apiDeleteNew = newId => `news/${newId}`
export const apiUploadImage = `https://api.cloudinary.com/v1_1/debiqwc2z/image/upload`

// News Comment
export const apiAddComment = newId => `news/${newId}/comment`
export const apiGetComment = newId => `news/${newId}/comment`

// Manager Host Statistic
export const apiBillStatistic = `statistic/bills`
export const apiRevenue = `statistic/revenue`
export const apiProblems = `statistic/problems`
export const apiGeneral = `statistic/general`

// Problems
export const apiGetProblems = houseId => `/problem/house/${houseId}`
export const apiUpdateProblems = problemId => `/problem/${problemId}`
export const apiGetDetailProblem = problemId => `/problem/${problemId}`

// Users
export const apiGetUser = (houseId, page = 1, limit = 10) =>
  `/account/house/${houseId}?page=${page}&limit=${limit}`

