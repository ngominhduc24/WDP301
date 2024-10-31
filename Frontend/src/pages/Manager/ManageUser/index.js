import { UserOutlined } from "@ant-design/icons"
import { Avatar, Col, Divider, Row, Select, Space, Switch, Tooltip } from "antd"
import { useEffect, useState } from "react"
import Button from "src/components/MyButton/Button"
import Notice from "src/components/Notice"
import SpinCustom from "src/components/Spin"
import TableCustom from "src/components/Table/CustomTable"
import Search from "./components/Search"
import ImportUser from "./modal/ImportUser"
import ModalInsertUpdate from "./modal/InsertUpdate"
import UserDetail from "./modal/UserDetail"
import { ListUserStyled } from "./styled"
import STORAGE from "src/lib/storage"
import ManagerService from "src/services/ManagerService"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import CB1 from "src/components/Modal/CB1"
const { Option } = Select

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
  const [detailInfo, setDetailInfo] = useState()
  const [selectedNode, setSelectedNote] = useState()
  const [openModalUserDetail, setOpenModalUserDetail] = useState(false)
  const [houses, setHouses] = useState([])
  const [selectedHouse, setSelectedHouse] = useState(null)

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
      dataIndex: "avatar",
      key: "avatar",
      render: value => <Avatar src={value} icon={<UserOutlined />} size={40} />,
      width: 60,
      align: "center",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      render: value => value || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: value => value || "N/A",
    },
    {
      title: "Loại tài khoản",
      dataIndex: "accountType",
      key: "accountType",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Switch
          checked={record.status}
          onChange={(checked, e) => {
            e.stopPropagation()
            toggleStatus(record._id, checked)
          }}
        />
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
    getAllHouses()
  }, [])

  useEffect(() => {
    if (selectedHouse) {
      fetchAllUsers()
    }
  }, [pagination, selectedHouse])
  const toggleStatus = async (userId, checked) => {
    const updatedStatus = checked
    try {
      await ManagerService.updateUser(userId, { status: updatedStatus })
      const updatedDataSource = managers.map(user =>
        user._id === userId ? { ...user, status: updatedStatus } : user,
      )
      setManagers(updatedDataSource)
      Notice({
        isSuccess: true,
        msg: "Cập nhật trạng thái thành công",
      })
    } catch (error) {
      console.error("Error updating user status:", error)
      Notice({
        isSuccess: false,
        msg: "Cập nhật trạng thái thất bại",
      })
    }
  }

  const fetchAllUsers = async () => {
    setLoading(true)
    try {
      const response = await ManagerService.getUser(
        selectedHouse,
        pagination.CurrentPage,
        pagination.PageSize,
      )
      if (response?.data) {
        setManagers(
          response.data.map(user => ({
            ...user,
            status: user.status,
            accountType: user.accountType || "N/A",
            username: user.username || "N/A",
            phone: user.phone || "N/A",
            email: user.email || "N/A",
          })),
        )
        setTotal(response.pagination.totalAccounts)
      } else {
        setManagers([])
        setTotal(0)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getAllHouses = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getAllHouses()
      const housesData = response?.data?.houses || []
      if (housesData.length > 0) {
        setHouses(housesData)
        setSelectedHouse(housesData[0]?._id)
      } else {
        setHouses([])
      }
    } catch (error) {
      setHouses([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <ListUserStyled>
      <Search setPagination={setPagination} pagination={pagination} />
      <Divider className="mv-16" />
      <div className="title-type-1 d-flex justify-content-space-between align-items-center pb-16 pt-0 mb-16">
        <div className="fs-24">Danh sách quản lý</div>

        <Row gutter={[16, 16]}>
          <Col>
            <div className="d-flex">
              <Select
                value={selectedHouse}
                style={{ width: 150 }}
                onChange={value => setSelectedHouse(value)}
              >
                {houses.map(house => (
                  <Option key={house._id} value={house._id}>
                    {house.name}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col>
            <Button
              btntype="primary"
              className="btn-hover-shadow"
              onClick={() => setOpenInsertUpdate(true)}
            >
              Thêm người dùng
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
          onOk={fetchAllUsers}
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

