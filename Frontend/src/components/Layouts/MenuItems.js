import ROUTER from "src/router"
import SvgIcon from "../SvgIcon"
import { useSelector } from "react-redux"
import STORAGE, { clearStorage, getStorage, setStorage } from "src/lib/storage"

const role = getStorage(STORAGE.USER_INFO)

const MenuItemBreadcrumb = () => {
  return [
    {
      label: "Đăng nhập",
      key: ROUTER?.DANG_NHAP,
    },
    {
      label: "Thông tin tài khoản",
      key: ROUTER?.PROFILE,
    },
    {
      label: "Đổi mật khẩu",
      key: ROUTER?.DOI_MAT_KHAU,
    },
    {
      label: "Đăng xuất",
      key: "dang-xuat",
    },
  ]
}

export default MenuItemBreadcrumb

export const MenuItemAdmin = () => {
  return [
    {
      key: ROUTER.ADMIN_DASHBOARD,
      label: "Thống Kê",
      icon: <SvgIcon name="dashboard" />,
      tabid: [1],
    },
    {
      key: ROUTER.ADMIN_HOUSE,
      label: "Danh Sách Nhà",
      icon: <SvgIcon name="warehouse" />,
      tabid: [2],
    },
    {
      key: ROUTER.ADMIN_ROOM,
      label: "Danh Sách Phòng",
      icon: <SvgIcon name="store" />,
      tabid: [3],
    },
    {
      key: ROUTER.ADMIN_NEWS,
      label: "Bảng Tin",
      icon: <SvgIcon name="notes" />,
      tabid: [4],
    },
    {
      key: ROUTER.ADMIN_REPORT,
      label: "Báo Cáo",
      icon: <SvgIcon name="filevankien" />,
      tabid: [5],
    },
    {
      key: ROUTER.ADMIN_BILLS,
      label: "Hóa Đơn",
      icon: <SvgIcon name="menu20" />,
      tabid: [6],
    },
    {
      key: ROUTER.ADMIN_USER,
      label: "Quản lý tài khoản",
      icon: <SvgIcon name="menu13" />,
      tabid: [7],
    },
  ]
}
export const MenuItemManager = () => {
  return [
    {
      key: ROUTER.MANAGER_DASHBOARD,
      label: "Thống Kê",
      icon: <SvgIcon name="dashboard" />,
      tabid: [1],
    },
    {
      key: ROUTER.MANAGER_HOUSE,
      label: "Danh Sách Nhà",
      icon: <SvgIcon name="warehouse" />,
      tabid: [2],
    },
    {
      key: ROUTER.MANAGER_ROOM,
      label: "Danh Sách Phòng",
      icon: <SvgIcon name="store" />,
      tabid: [3],
    },
    {
      key: ROUTER.MANAGER_NEWS,
      label: "Bảng Tin",
      icon: <SvgIcon name="notes" />,
      tabid: [4],
    },
    {
      key: ROUTER.MANAGER_REPORT,
      label: "Báo Cáo",
      icon: <SvgIcon name="filevankien" />,
      tabid: [5],
    },
    {
      key: ROUTER.MANAGER_BILLS,
      label: "Hóa Đơn",
      icon: <SvgIcon name="menu20" />,
      tabid: [6],
    },
    {
      key: ROUTER.MANAGER_USER,
      label: "Quản lý tài khoản",
      icon: <SvgIcon name="menu13" />,
      tabid: [7],
    },
  ]
}

export const MenuItemRenter = () => {
  return [
    {
      key: ROUTER.RENTER_ROOM,
      label: "Thông tin phòng",
      icon: <SvgIcon name="store" />,
      tabid: [1],
    },
    {
      key: ROUTER.RENTER_NEWS,
      label: "Bảng Tin",
      icon: <SvgIcon name="notes" />,
      tabid: [1],
    },
    {
      key: ROUTER.RENTER_REPORT,
      label: "Báo cáo vấn đề",
      icon: <SvgIcon name="filevankien" />,
      tabid: [1],
    },
  ]
}

export const MenuItemUser = () => {
  return [
    // {
    //   key: ROUTER.TONG_QUAN,
    //   label: "Tổng quan",
    //   icon: <SvgIcon name="user-info" />,
    //   tabid: [1],
    // },
    // {
    //   key: ROUTER.THONG_TIN_TAI_KHOAN,
    //   label: "Thông tin cá nhân",
    //   icon: <SvgIcon name="user-info" />,
    //   tabid: [1],
    // },
    // {
    //   key: ROUTER.LS_HOAT_DONG_USER,
    //   label: "Lịch sử hoạt động",
    //   icon: <SvgIcon name="history-company" />,
    //   tabid: [1],
    // },
  ]
}

