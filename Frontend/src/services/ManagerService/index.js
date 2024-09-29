import axios from "axios"
import http from "../index"
import {
  apiGetShopById,
  apiGetListProductsInShop,
  apiGetListProductsNotInShop,
  apiAddProductsToShop,
  apiUpdateProductsToShop,
  apiGetDetailProductsInShop,
  apiGetListStaff,
  apiUpdateStatusStaff,
  apiGetStaffDetail,
  apiCreateInvoice,
  apiGetInvoiceById,
  apiUpdateInfoInvoice,
  apiUpdateStatusInvoice,
  apiGetAllInvoice,
  apiGetInvoicesByShopId,
  apiGetOrdersByShopId,
  apiUpdateInfoRequest,
  apiUpdateStatusRequest,
  apiCreateRequest,
  apiGetRequestWarehouse,
  apiGetRequestShop,
  apiGetRequestById,
  apiExportInvoice,
  apiImportInvoice,
} from "./urls"
import QueryString from "qs"

import { apiGetAllHouses } from "./urls"

const getAllHouses = (page = 1, limit = 10) =>
  http.get(apiGetAllHouses, {
    params: {
      page: page,
      limit: limit,
    },
  })

const ManagerService = {
  getAllHouses,
}

export default ManagerService

