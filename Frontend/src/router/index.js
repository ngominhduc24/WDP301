const CA_NHAN = "ca_nhan"
const ROUTER = {
  SVG_VIEWER: "/svg-viewer",
  HOME: "/dashboard",
  DEFAULT: "/",
  DANG_NHAP: "/dang-nhap",
  DOI_MAT_KHAU: "/doi-mat-khau",
  TEST_PRINT: "/test-print",

  // ADMIN
  DASHBOARD: "/admin/dashboard",
  MANAGE_USER: "/admin/manage-user",
  MANAGE_STORE: "/admin/manage-store",
  MANAGE_PRODUCTS: "/admin/manage-products",
  PROFILE: `/thong-tin-ca-nhan`,

  // USER

  // STAFF
  RENTER_ROOM: "/renter/room",
  RENTER_PROFILE: `/staff/thong-tin-ca-nhan`,

  // MANAGER
  MANAGER_DASHBOARD: "/manager/dashboard",
  MANAGER_HOUSE: "/manager/house",
  MANAGER_ROOM: "/manager/room",
  MANAGER_REPORT: "/manager/report",
  MANAGER_NEWS: "/manager/new",
  MANAGER_BILLS: "/manager/bills",
  MANAGER_PROFILE: `/manager/personal`,
  // WAREHOUSE MANAGER
  WAREHOUSE_MANAGER_DASHBOARD: "/warehouse-manager/dashboard",
  WAREHOUSE_MANAGER_MANAGE_INVOICE_TO_SHOP:
    "/warehouse-manager/manage-invoices/to-shop",
  WAREHOUSE_MANAGER_MANAGE_INVOICE_TO_WAREHOUSE:
    "/warehouse-manager/manage-invoices/to-warehouse",
  WAREHOUSE_MANAGER_MANAGE_WAREHOUSE: "/warehouse-manager/manage-warehouse",
  WAREHOUSE_MANAGER_PROFILE: `/warehouse-manager-thong-tin-ca-nhan`,
  WAREHOUSE_MANAGER_MANAGE_PRODUCT: "/warehouse-manager/manage-product",
  WAREHOUSE_MANAGER_MANAGE_STORE: "/warehouse-manager/manage-store",
  WAREHOUSE_MANAGER_REQUEST_TO: "/warehouse-manager/request-to",
}
export default ROUTER

