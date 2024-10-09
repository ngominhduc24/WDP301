import { UserOutlined } from "@ant-design/icons"
import { Anchor, Avatar, Col, Divider, Row, Space, Switch, Tooltip } from "antd"
import { useEffect, useState } from "react"
import { FloatActionWrapper } from "src/components/FloatAction/styles"
import CB1 from "src/components/Modal/CB1"
import Button from "src/components/MyButton/Button"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import TableCustom from "src/components/Table/CustomTable"
import {
  MainTableData,
  MainTableHeader,
  SubTableData,
  SubTableHeader,
} from "src/components/Table/CustomTable/styled"
import Search from "./components/Search"
import TreeAnchor from "./components/TreeAnchor"
import ImportUser from "./modal/ImportUser"
import ModalInsertUpdate from "./modal/InsertUpdate"
import UserDetail from "./modal/UserDetail"
import { ListUserStyled } from "./styled"
import { getListComboByKey } from "src/lib/utils"
import { SYSTEM_KEY } from "src/constants/constants"
import { useSelector } from "react-redux"
import AdminServices from "src/services/AdminService"
import { jwtDecode } from "jwt-decode"
import STORAGE, { getStorage } from "src/lib/storage"

const ManageUser = () => {
  const [managers, setManagers] = useState([])
  const [total, setTotal] = useState([])
  const { listSystemKey } = useSelector(state => state.appGlobal)
  const [pagination, setPagination] = useState({
    PageSize: 20,
    CurrentPage: 1,
    TextSearch: "",
  })

  const [loading, setLoading] = useState(false)
  const [openInsertUpdate, setOpenInsertUpdate] = useState(false)
  const [openImportUser, setOpenImportUser] = useState(false)
  const [detailInfo, setDetailInfo] = useState()
  const [listButtonShow, setListButtonShow] = useState()
  const [selectedNode, setSelectedNote] = useState()
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [openModalUserDetail, setOpenModalUserDetail] = useState(false)
  const columns = [
    {
      title: "STT",
      // dataIndex: "Index",
      key: "_id",
      width: 60,
      align: "center",

      render: (value, record, idx) => idx + 1,
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: value => <Avatar src={value} icon={<UserOutlined />} size={40} />,
      width: 60,
      align: "center",
    },
    {
      title: (
        <>
          <MainTableHeader>Họ tên</MainTableHeader>
          {/* <SubTableHeader>Họ tên</SubTableHeader> */}
        </>
      ),
      dataIndex: "fullname",
      key: "FullName",
      align: "center",
      render: (val, record) => (
        <>
          <MainTableData>{record?.fullname}</MainTableData>
        </>
      ),
    },
    {
      title: (
        <>
          <MainTableHeader>Số điện thoại</MainTableHeader>
          {/* <SubTableHeader>Họ tên</SubTableHeader> */}
        </>
      ),
      dataIndex: "phobe",
      key: "phone",
      align: "center",
      render: (val, record) => (
        <>
          <MainTableData>{record?.phone}</MainTableData>
        </>
      ),
    },
    {
      title: (
        <>
          <MainTableHeader>Email</MainTableHeader>
          {/* <SubTableHeader>Số điện thoại</SubTableHeader> */}
        </>
      ),
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (val, record) => (
        <>
          <MainTableData>{record?.email}</MainTableData>
        </>
      ),
    },
    {
      title: (
        <>
          <MainTableHeader>Ngày sinh</MainTableHeader>
          {/* <SubTableHeader>Số điện thoại</SubTableHeader> */}
        </>
      ),
      dataIndex: "dob",
      key: "dob",
      align: "center",
      render: (val, record) => (
        <>
          <MainTableData>{record?.dob}</MainTableData>
        </>
      ),
    },
    {
      title: (
        <>
          <MainTableHeader>Lương</MainTableHeader>
          {/* <SubTableHeader>Số điện thoại</SubTableHeader> */}
        </>
      ),
      dataIndex: "salary",
      key: "salary",
      align: "center",
      render: (val, record) => (
        <>
          <MainTableData>{record?.salary}</MainTableData>
        </>
      ),
    },
    // {
    //   title: "Nhóm quyền",
    //   dataIndex: "role",
    //   key: "role",
    // width: 180,
    // align: "center",
    // render: (text, record) => (
    //   <Tooltip
    //     title={
    //       Array.isArray(text) && text.length > 0
    //         ? text?.map((i, idx) => (
    //             <span key={`${record?._id}-role-${idx}`}>
    //               {i}
    //               {!!(idx > 0 && idx < text?.length - 1) && " | "}
    //             </span>
    //           ))
    //         : ""
    //     }
    //   >
    //     <div className="max-line2">
    //       {Array.isArray(text) && text.length > 0 &&
    //         text.map((i, idx) => (
    //           <span key={`${record?._id}-role-${idx}`}>
    //             {!!(idx > 0) && " | "}
    //             {i}
    //           </span>
    //         ))}
    //     </div>
    //   </Tooltip>
    // ),
    //   render: (val, record) => {
    //     <>
    //     <MainTableData>{record?.role}</MainTableData>
    //     <SubTableData>{val}</SubTableData>
    //     </>
    //   }
    // },
    {
      title: (
        <>
          <MainTableHeader>Nhóm quyền</MainTableHeader>
          {/* <SubTableHeader>Số điện thoại</SubTableHeader> */}
        </>
      ),
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (val, record) => (
        <>
          <MainTableData>{record?.role}</MainTableData>
        </>
      ),
    },
    {
      title: "Action",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (_, record) => (
        // <div className="d-flex justify-content-center align-items-center mh-36">
        //   <div className="text-center">
        //     {record?.status === "active" ? "Đang hoạt động" : "Dừng hoạt động"}
        //   </div>
        //   <FloatActionWrapper size="small" className="float-action__wrapper">
        //     {renderListButton(record)}
        //   </FloatActionWrapper>
        // </div>
        <Switch
          checked={record.status === "active"}
          onChange={(checked, e) => {
            e.stopPropagation()
            toggleStatus(record._id, checked)
          }}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 160,
      render: (_, record) => (
        <div className="d-flex justify-content-center align-items-center mh-36">
          <div className="text-center">
            {record?.status === "active" ? "Đang hoạt động" : "Dừng hoạt động"}
          </div>
        </div>
      ),
    },
    {
      title: "Chức năng",
      align: "center",
      key: "Action",
      width: 100,
      render: (_, record) => <Space>{renderListButton(record)}</Space>,
    },
  ]
  useEffect(() => {
    // if (!!selectedNode?.DepartmentID) {
    getAllManagers()
    // }
  }, [pagination])
  useEffect(() => {
    setPagination(pre => ({ ...pre, CurrentPage: 1 }))
  }, [selectedNode])
  // const onReset = async UserID => {
  //   const res = await UserService.resetPassword({ UserID: UserID })
  //   if (res?.isError) return
  //   Notice({ msg: "Reset mật khẩu thàng công !" })
  // }
  const renderListButton = record => (
    <Space>
      <ButtonCircle
        title="Cập nhật"
        iconName="edit"
        onClick={() => {
          setOpenInsertUpdate(true)
          setDetailInfo(record)
        }}
      />
      <ButtonCircle
        title="Reset mật khẩu"
        iconName="reset-pass"
        style={{ background: "#fff" }}
        onClick={e => {
          e.stopPropagation()
          CB1({
            title: `Bạn có chắc chắn muốn Reset mật khẩu tài khoản ${record?.UserName} không?`,
            icon: "warning-usb",
            okText: "Đồng ý",
            onOk: async close => {
              // onReset(record?.UserID)
              close()
            },
          })
        }}
      />
    </Space>
  )

  const toggleStatus = async (userId, checked) => {
    setLoading(true)
    try {
      const updatedStatus = checked ? "active" : "inactive"
      await AdminServices.updateStatusUsers(userId, { status: updatedStatus })
      const updatedDataSource = managers.map(user =>
        user._id === userId ? { ...user, status: updatedStatus } : user,
      )
      setManagers(updatedDataSource)
      Notice({
        isSuccess: true,
        msg: "Cập nhật trạng thái thành công",
      })
    } catch (error) {
      Notice({
        isSuccess: true,
        msg: "Cập nhật trạng thái thất bại",
      })
    } finally {
      setLoading(false)
    }
  }

  const getAllManagers = async () => {
    try {
      setLoading(true)
      const token = getStorage(STORAGE.TOKEN)
      const res = await AdminServices.getAllManagers(token)
      console.log("responses: ", res)
      if (res) {
        setManagers(res)
        setTotal(res?.length)
      }
    } catch (error) {
      console.log("error")
    } finally {
      setLoading(false)
    }
  }

  // const exportUser = async () => {
  //   try {
  //     const res = await UserService.exportUser({
  //       DepartmentID: selectedNode?.DepartmentID,
  //     })
  //     const href = URL.createObjectURL(res)
  //     const link = document.createElement("a")
  //     link.href = href
  //     link.setAttribute("download", "danh sách nhân viên.xlsx") //or any other extension
  //     document.body.appendChild(link)
  //     link.click()
  //     // clean up "a" element & remove ObjectURL
  //     document.body.removeChild(link)
  //     URL.revokeObjectURL(href)
  //   } finally {
  //   }
  // }
  return (
    <ListUserStyled>
      <div>
        <Search setPagination={setPagination} pagination={pagination} />
        <Divider className="mv-16" />
        <div className="title-type-1 d-flex justify-content-space-between align-items-center pb-16 pt-0 mb-16">
          <div className="fs-24">Danh sách quản lý</div>
          <Row gutter={[16, 16]}>
              <Col>
                <Button
                  btntype="primary"
                  className="btn-hover-shadow"
                  onClick={() => setOpenInsertUpdate(selectedNode || true)}
                >
                  Thêm nhân viên
                </Button>
              </Col>
              <Col>
                <Button
                  // onClick={exportUser}
                  className="btn-hover-shadow"
                  btntype="third"
                >
                  Xuất Excel
                </Button>
              </Col>
          </Row>
        </div>
      </div>
      <Anchor
        affix={false}
        getContainer={() => document.getElementById("body-admin-scroll")}
      >
        <Row gutter={[16, 16]}>
          <Col style={{ width: 300 }}>
            <TreeAnchor
              selectedNode={selectedNode}
              setSelectedNote={setSelectedNote}
              keyId={2}
            />
          </Col>
          <Col style={{ width: 0 }} flex="auto">
            <SpinCustom spinning={loading}>
              <TableCustom
                isPrimary
                onRow={record => {
                  return {
                    onClick: () => {
                      setOpenModalUserDetail(record)
                      // setSelectedUserId(record._id)
                    },
                  }
                }}
                className="mb-6"
                dataSource={managers}
                columns={columns}
                textEmpty="Không có nhân viên"
                rowKey="_id"
                sticky={{ offsetHeader: -12 }}
                scroll={{ x: "800px" }}
                pagination={{
                  hideOnSinglePage: total <= 10,
                  current: pagination?.CurrentPage,
                  pageSize: pagination?.PageSize,
                  responsive: true,
                  total: total,
                  locale: { items_per_page: "" },
                  showSizeChanger: total > 10,
                  onChange: (CurrentPage, PageSize) =>
                    setPagination({
                      ...pagination,
                      CurrentPage,
                      PageSize,
                    }),
                }}
              />
              {/* {dataSource?.length > 0 &&
                dataSource?.map(i => (
                  <div key={`anchor-item${i?.DepartmentID}`}>
                    <div
                      id={i?.DepartmentID}
                      className="fs-16 fw-600 mt-10 mb-10"
                    >
                      {i?.DepartmentName}
                    </div>
                    <TableCustom
                      isPrimary
                      onRow={record => {
                        return {
                          onClick: () => {
                            setOpenModalUserDetail(record)
                          },
                        }
                      }}
                      className="mb-6"
                      dataSource={i?.UserInfoOutputList}
                      columns={columns}
                      textEmpty="Không có nhân viên"
                      pagination={false}
                      rowKey="UserID"
                      sticky={{ offsetHeader: -12 }}
                      scroll={{ x: "800px" }}
                    />
                  </div>
                ))} */}
            </SpinCustom>
          </Col>
        </Row>
      </Anchor>
      {!!openInsertUpdate && (
        <ModalInsertUpdate
          open={openInsertUpdate}
          detailInfo={detailInfo}
          onOk={getAllManagers}
          onCancel={() => {
            setDetailInfo(undefined)
            setOpenInsertUpdate(false)
          }}
        />
      )}

      {!!openImportUser && (
        <ImportUser
          open={openImportUser}
          onCancel={() => setOpenImportUser(false)}
          onOk={getAllManagers}
          // department={selectedNode}
        />
      )}

      {!!openModalUserDetail && (
        <UserDetail
          open={!!openModalUserDetail}
          onCancel={() => setOpenModalUserDetail(false)}
          data = {openModalUserDetail}
          onOk={getAllManagers}
          // department={selectedNode}
          // listButtonShow={listButtonShow}
          // userId={selectedUserId}
        />
      )}
    </ListUserStyled>
  )
}

export default ManageUser