import { Spin } from "antd"
import React from "react"
import { useRoutes } from "react-router-dom"
import ROUTER from "./index"
import SpinCustom from "src/components/Spin"

// ANONYMOUS
const PublicRouters = React.lazy(() => import("src/pages/PublicRouters"))
const SvgViewer = React.lazy(() => import("src/pages/SvgViewer"))

const MeetingInvitation = React.lazy(() =>
  import("src/pages/SvgViewer/MeetingInvitation"),
)
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
const Dashboard = React.lazy(() => import("src/pages/ADMIN/DashBoard"))
const ManageUser = React.lazy(() => import("src/pages/ADMIN/ManageUser"))
const ManageStore = React.lazy(() => import("src/pages/ADMIN/ManageStore"))
const ManageProduct = React.lazy(() => import("src/pages/ADMIN/ManageProduct"))
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
// STAFF
const StaffRoutes = React.lazy(() => import("src/pages/Staff/StaffRoutes"))
const ManageOrders = React.lazy(() => import("src/pages/Staff/ManageOrders"))

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
        path: ROUTER.DASHBOARD,
        element: (
          <LazyLoadingComponent>
            <Dashboard />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGE_USER,
        element: (
          <LazyLoadingComponent>
            <ManageUser />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGE_STORE,
        element: (
          <LazyLoadingComponent>
            <ManageStore />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.MANAGE_PRODUCTS,
        element: (
          <LazyLoadingComponent>
            <ManageProduct />
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

  // STAFF
  {
    element: (
      <LazyLoadingComponent>
        <StaffRoutes />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: ROUTER.STAFF_DASHBOARD,
        element: (
          <LazyLoadingComponent>
            <Dashboard />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.STAFF_MANAGE_ORDER,
        element: (
          <LazyLoadingComponent>
            <ManageOrders />
          </LazyLoadingComponent>
        ),
      },
      {
        path: ROUTER.STAFF_PROFILE,
        element: (
          <LazyLoadingComponent>
            <PersonProfile />
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
        path: ROUTER.MANAGER_PROFILE,
        element: (
          <LazyLoadingComponent>
            <PersonProfile />
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