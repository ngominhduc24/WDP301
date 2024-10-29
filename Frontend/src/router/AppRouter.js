import { Spin } from "antd"
import React from "react"
import { useRoutes } from "react-router-dom"
import ROUTER from "./index"
import SpinCustom from "src/components/Spin"

// ANONYMOUS
const PublicRouters = React.lazy(() => import("src/pages/PublicRouters"))
const SvgViewer = React.lazy(() => import("src/pages/SvgViewer"))
const NotFound = React.lazy(() => import("src/pages/NotFound"))
const LoginPage = React.lazy(() => import("src/pages/ANONYMOUS/LoginPage"))

// USER
const PrivateRoutes = React.lazy(() => import("src/pages/PrivateRoutes"))
const ChangePassword = React.lazy(() =>
  import("src/components/Layouts/component/ChangePassword"),
)
const PersonProfile = React.lazy(() => import("src/pages/USER/PersonProfile"))
// ADMIN
const AdminRoutes = React.lazy(() => import("src/pages/ADMIN/AminRoutes"))
const AdminDashBoard = React.lazy(() =>
  import("src/pages/ADMIN/ManagerManageDashboard"),
)
const AdminManageHouses = React.lazy(() =>
  import("src/pages/ADMIN/ManageHouse"),
)
const AdminManageRoom = React.lazy(() => import("src/pages/ADMIN/ManageRoom"))
const AdminManageNews = React.lazy(() => import("src/pages/ADMIN/ManageNews"))
const AdminManageReport = React.lazy(() =>
  import("src/pages/ADMIN/ManageReport"),
)
const AdminUser = React.lazy(() => import("src/pages/ADMIN/ManageUser"))
// MANAGER
const ManagerRoutes = React.lazy(() =>
  import("src/pages/Manager/ManagerRoutes"),
)
const ManagerDashBoard = React.lazy(() =>
  import("src/pages/Manager/ManagerManageDashboard"),
)
const ManagerManageHouses = React.lazy(() =>
  import("src/pages/Manager/ManageHouse"),
)
const ManagerManageRoom = React.lazy(() =>
  import("src/pages/Manager/ManageRoom"),
)
const ManagerManageNews = React.lazy(() =>
  import("src/pages/Manager/ManageNews"),
)
const ManagerManageReport = React.lazy(() =>
  import("src/pages/Manager/ManageReport"),
)
const ManageBill = React.lazy(() => import("src/pages/Manager/ManageBill"))
const ManagerUser = React.lazy(() => import("src/pages/Manager/ManageUser"))
// RENTER
const RenterRoutes = React.lazy(() => import("src/pages/Renter/RenterRoutes"))
const RenterRoom = React.lazy(() => import("src/pages/Renter/ManageRoom"))
const RenterNews = React.lazy(() => import("src/pages/Renter/ManageNews"))
const RenterReport = React.lazy(() => import("src/pages/Renter/ManageReport"))

function LazyLoadingComponent({ children }) {
  return (
    <React.Suspense
      fallback={
        <div className="loading-center" style={{ height: "100vh" }}>
          <SpinCustom />
        </div>
      }
    >
      {children}
    </React.Suspense>
  )
}

const routes = [
  {
    path: ROUTER.SVG_VIEWER,
    element: (
      <LazyLoadingComponent>
        <SvgViewer />
      </LazyLoadingComponent>
    ),
  },

  // ADMIN
  {
    element: (
      <LazyLoadingComponent>
        <AdminRoutes />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: ROUTER.ADMIN_DASHBOARD,
        element: (
          <LazyLoadingComponent>
            <AdminDashBoard />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.ADMIN_HOUSE,
        element: (
          <LazyLoadingComponent>
            <AdminManageHouses />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.ADMIN_ROOM,
        element: (
          <LazyLoadingComponent>
            <AdminManageRoom />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.ADMIN_NEWS,
        element: (
          <LazyLoadingComponent>
            <AdminManageNews />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.ADMIN_REPORT,
        element: (
          <LazyLoadingComponent>
            <AdminManageReport />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.ADMIN_USER,
        element: (
          <LazyLoadingComponent>
            <AdminUser />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.PROFILE,
        element: (
          <LazyLoadingComponent>
            <PersonProfile />
          </LazyLoadingComponent>
        ),
      },
    ],
  },

  //  USER
  {
    element: (
      <LazyLoadingComponent>
        <PrivateRoutes />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: ROUTER.DOI_MAT_KHAU,
        element: (
          <LazyLoadingComponent>
            <ChangePassword />
          </LazyLoadingComponent>
        ),
      },
    ],
  },

  // MANAGER
  {
    element: (
      <LazyLoadingComponent>
        <ManagerRoutes />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: ROUTER.MANAGER_DASHBOARD,
        element: (
          <LazyLoadingComponent>
            <ManagerDashBoard />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGER_HOUSE,
        element: (
          <LazyLoadingComponent>
            <ManagerManageHouses />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGER_ROOM,
        element: (
          <LazyLoadingComponent>
            <ManagerManageRoom />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGER_NEWS,
        element: (
          <LazyLoadingComponent>
            <ManagerManageNews />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGER_REPORT,
        element: (
          <LazyLoadingComponent>
            <ManagerManageReport />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGER_BILLS,
        element: (
          <LazyLoadingComponent>
            <ManageBill />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGER_USER,
        element: (
          <LazyLoadingComponent>
            <ManagerUser />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGER_PROFILE,
        element: (
          <LazyLoadingComponent>
            <PersonProfile />
          </LazyLoadingComponent>
        ),
      },
    ],
  },

  // RENTER
  {
    element: (
      <LazyLoadingComponent>
        <RenterRoutes />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: ROUTER.RENTER_ROOM,
        element: (
          <LazyLoadingComponent>
            <RenterRoom />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.RENTER_NEWS,
        element: (
          <LazyLoadingComponent>
            <RenterNews />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.RENTER_REPORT,
        element: (
          <LazyLoadingComponent>
            <RenterReport />
          </LazyLoadingComponent>
        ),
      },
    ],
  },

  //  ANONYMOUS
  {
    element: (
      <LazyLoadingComponent>
        <PublicRouters />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: ROUTER.DEFAULT,
        element: (
          <LazyLoadingComponent>
            <LoginPage />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.DANG_NHAP,
        element: (
          <LazyLoadingComponent>
            <LoginPage />
          </LazyLoadingComponent>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <LazyLoadingComponent>
        <NotFound />
      </LazyLoadingComponent>
    ),
  },
]
const AppRouter = () => {
  const renderRouter = useRoutes(routes)
  return renderRouter
}
export default AppRouter

