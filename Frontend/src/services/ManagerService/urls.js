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

