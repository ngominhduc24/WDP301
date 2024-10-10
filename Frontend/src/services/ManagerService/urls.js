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

// House News
export const apiGetNews = houseId => `news/house/${houseId}`
