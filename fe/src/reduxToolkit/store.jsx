import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import houseReducer from "./HouseSlice";
import utilsReducer from "./UtilSlice";
import defaultUtilReducer from "./UtilSliceDefault";
import roomReducer from "./RoomSlice";
import newReducer from "./NewsSlice";
import commentReducer from "./CommentSlice";
import defaultPriceReducer from "./DefaultPrice";
const rootReducer = {
  // counter : tên đặt tự do nó sẽ tương ứng với state sẽ truy cập ở component
  //counterReducer : import Reducer từ CounterSlice
  //  counter : counterReducer,
  user: userReducer,
  house: houseReducer,
  utilOther: utilsReducer,
  defaultUtil: defaultUtilReducer,
  room: roomReducer,
  new: newReducer,
  comment: commentReducer,
  defaultPrice:defaultPriceReducer
};
const store = configureStore({
  reducer: rootReducer,
});
export default store;
