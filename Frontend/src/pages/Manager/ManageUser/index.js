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
import Search from "./components/Search"
import TreeAnchor from "./components/TreeAnchor"
import ImportUser from "./modal/ImportUser"
import ModalInsertUpdate from "./modal/InsertUpdate"
import UserDetail from "./modal/UserDetail"
import { ListUserStyled } from "./styled"
import { getStorage } from "src/lib/storage"
import STORAGE from "src/lib/storage"

const ManageUser = () => {
  const [managers, setManagers] = useState([])
  const [total, setTotal] = useState(0)
  const [pagination, setPagination] = useState({
    PageSize: 20,
    CurrentPage: 1,
    TextSearch: "",
  })

  const [loading, setLoading] = useState(false)
  const [openInsertUpdate, setOpenInsertUpdate] = useState(false)
  const [openImportUser, setOpenImportUser] = useState(false)
  const [detailInfo, setDetailInfo] = useState()
  const [selectedNode, setSelectedNote] = useState()
  const [openModalUserDetail, setOpenModalUserDetail] = useState(false)

  const columns = [
    {
      title: "STT",
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
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      align: "center",
    },
    {
      title: "Lương",
      dataIndex: "salary",
      key: "salary",
      align: "center",
    },
    {
      title: "Nhóm quyền",
      dataIndex: "role",
      key: "role",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Switch
          checked={record.status === "active"}
          onChange={(checked, e) => {
            e.stopPropagation()
            toggleStatus(record._id, checked)
          }}
        />
      ),
    },
  ]

  useEffect(() => {
    mockGetAllManagers() // Commented actual API call and used mockup data
  }, [pagination])

  const toggleStatus = (userId, checked) => {
    const updatedStatus = checked ? "active" : "inactive"
    const updatedDataSource = managers.map(user =>
      user._id === userId ? { ...user, status: updatedStatus } : user,
    )
    setManagers(updatedDataSource)
    Notice({
      isSuccess: true,
      msg: "Cập nhật trạng thái thành công",
    })
  }

  // Mockup data function
  const mockGetAllManagers = () => {
    setLoading(true)
    const fakeData = [
      {
        _id: "1",
        fullname: "Nguyễn Văn A",
        phone: "0123456789",
        email: "nguyenvana@gmail.com",
        dob: "01/01/1990",
        salary: "15,000,000 VND",
        role: "Admin",
        status: "active",
        image: "",
      },
      {
        _id: "2",
        fullname: "Trần Thị B",
        phone: "0987654321",
        email: "tranthib@gmail.com",
        dob: "02/02/1985",
        salary: "12,000,000 VND",
        role: "Manager",
        status: "inactive",
        image: "",
      },
    ]
    setManagers(fakeData)
    setTotal(fakeData.length)
    setLoading(false)
  }

  return (
    <ListUserStyled>
      <Search setPagination={setPagination} pagination={pagination} />
      <Divider className="mv-16" />
      <div className="title-type-1 d-flex justify-content-space-between align-items-center pb-16 pt-0 mb-16">
        <div className="fs-24">Danh sách quản lý</div>
        <Row gutter={[16, 16]}>
          <Col>
            <Button
              btntype="primary"
              className="btn-hover-shadow"
              onClick={() => setOpenInsertUpdate(true)}
            >
              Thêm nhân viên
            </Button>
          </Col>
        </Row>
      </div>
      <SpinCustom spinning={loading}>
        <TableCustom
          dataSource={managers}
          columns={columns}
          textEmpty="Không có nhân viên"
          rowKey="_id"
          pagination={{
            current: pagination.CurrentPage,
            pageSize: pagination.PageSize,
            total: total,
            onChange: (CurrentPage, PageSize) =>
              setPagination({ ...pagination, CurrentPage, PageSize }),
          }}
        />
      </SpinCustom>

      {openInsertUpdate && (
        <ModalInsertUpdate
          open={openInsertUpdate}
          detailInfo={detailInfo}
          onOk={mockGetAllManagers}
          onCancel={() => setOpenInsertUpdate(false)}
        />
      )}

      {openModalUserDetail && (
        <UserDetail
          open={openModalUserDetail}
          onCancel={() => setOpenModalUserDetail(false)}
          data={openModalUserDetail}
        />
      )}
    </ListUserStyled>
  )
}

export default ManageUser

