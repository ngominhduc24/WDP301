import React, { useState, useEffect, useCallback } from "react"
import { Col, Row, Space } from "antd"
import SpinCustom from "src/components/Spin"
import Notice from "src/components/Notice"
import TableCustom from "src/components/TableCustom"
import InsertUpdateReport from "./components/InsertUpdateReport"
import ModalViewDetailReport from "./components/ModalViewReport"
import SearchAndFilter from "./components/SearchAndFilter"
import Button from "src/components/MyButton/Button"
import RenterService from "src/services/RenterService"
import STORAGE, { getStorage } from "src/lib/storage"
import CB1 from "src/components/Modal/CB1"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import InsertReport from "./components/InsertReport"
const ManageReport = () => {
  const userInfo = getStorage(STORAGE.USER_INFO)
  // const { Option } = Select
  // const [selectedHouse, setSelectedHouse] = useState(null)
  const [allProblems, setAllProblems] = useState([])
  const [filteredProblems, setFilteredProblems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openInsertProblem, setOpenInsertProblem] = useState(false)
  const [isModalViewDetailProblem, setIsModalViewDetailProblem] =
    useState(false)

  const [pagination, setPagination] = useState({
    PageSize: 10,
    CurrentPage: 1,
    TextSearch: "",
    Status: "all",
  })

  const fetchHouse = useCallback(async () => {
    try {
      setLoading(true)
      const response = await RenterService.getRoomDetail(userInfo?.roomId)
      console.log(response)

      // const housesData = response?.data?.houseId || []
      // if (housesData) {
      //   setSelectedHouse(housesData._id)
      // }
    } catch (error) {
      console.error("Error fetching houses:", error)
    } finally {
      setLoading(false)
    }
  }, [userInfo?.roomId])

  useEffect(() => {
    fetchHouse()
  }, [fetchHouse])

  useEffect(() => {
    if (userInfo?.roomId) fetchProblems(userInfo?.roomId)
  }, [userInfo?.roomId])

  const applyFiltersAndSearch = useCallback(() => {
    const { TextSearch, Status } = pagination

    let filtered = allProblems.filter(problem =>
      Status === "all" ? true : problem.status === Status,
    )

    if (TextSearch) {
      filtered = filtered.filter(
        problem =>
          problem.title.toLowerCase().includes(TextSearch.toLowerCase()) ||
          problem.content.toLowerCase().includes(TextSearch.toLowerCase()),
      )
    }

    setFilteredProblems(filtered)
  }, [allProblems, pagination])

  useEffect(() => {
    applyFiltersAndSearch()
  }, [pagination, allProblems, applyFiltersAndSearch])

  const fetchProblems = async roomId => {
    try {
      setLoading(true)
      const response = await RenterService.getRoomProblems(roomId)
      setAllProblems(response.data.data || [])
    } catch (error) {
      console.error("Error fetching problems:", error)
      Notice({ msg: "Không thể lấy danh sách vấn đề" })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = problem => {
    setSelectedProblem(problem)
    setIsModalOpen(true)
  }

  const handleOpenView = problem => {
    setSelectedProblem(problem)
    setIsModalViewDetailProblem(true)
  }
  const handleDeleteProblem = async problemId => {
    try {
      setLoading(true)
      const res = await RenterService.deleteProblems(problemId)
      if (res?.isError) return
      fetchProblems(userInfo?.roomId)
      Notice({
        msg: "Xóa thành công.",
      })
    } catch (error) {
      console.error("Error deleting booking note:", error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    { title: "Tiêu Đề", dataIndex: "title", key: "title" },
    { title: "Nội Dung", dataIndex: "content", key: "content" },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: status => <span>{renderStatus(status)}</span>,
    },
    { title: "Phòng", dataIndex: ["roomId", "name"], key: "room" },
    {
      title: "Chức năng",
      align: "center",
      key: "Action",
      width: 100,
      render: (_, record) => (
        <Space>
          {listBtn(record).map(
            (i, idx) =>
              !!i?.isEnable && (
                <ButtonCircle
                  key={idx}
                  title={i.name}
                  iconName={i.icon}
                  onClick={i.onClick}
                />
              ),
          )}
        </Space>
      ),
    },
    // {
    //   title: "Hành Động",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space>
    //       <Button btntype="primary" onClick={() => handleUpdate(record)}>
    //         UPDATE
    //       </Button>
    //       <Button
    //         btntype="default"
    //         onClick={() => handleOpenView(record)}
    //         style={{ backgroundColor: "yellow" }}
    //       >
    //         Xem chi tiết
    //       </Button>
    //     </Space>
    //   ),
    // },
  ]

  const renderStatus = status => {
    switch (status) {
      case "none":
        return "Chưa tiếp nhận"
      case "pending":
        return "Đang chờ giải quyết"
      case "doing":
        return "Đang xử lý vấn đề"
      case "done":
        return "Đã giải quyết"
      default:
        return status
    }
  }
  const listBtn = record => [
    {
      isEnable: true,
      name: "Xem chi tiết",
      icon: "eye",
      onClick: () => {
        handleOpenView(record)
      },
    },
    {
      isEnable: true,
      name: "Chỉnh sửa",
      icon: "edit-green",
      onClick: () => {
        handleUpdate(record)
      },
    },
    {
      isEnable: true,
      name: "Xóa",
      icon: "delete-red-row",
      onClick: () =>
        CB1({
          record,
          title: `bạn chắc chắn muốn xóa?`,
          icon: "warning-usb",
          okText: "Có",
          cancelText: "Không",
          onOk: async close => {
            handleDeleteProblem(record?._id)
            close()
          },
        }),
    },
  ]

  return (
    <SpinCustom spinning={loading}>
      <div className="title-type-1 d-flex justify-content-space-between align-items-center mt-12 mb-30">
        <span style={{ fontWeight: "bold", marginRight: "8px" }}>
          Vấn Đề Nhà Trọ
        </span>
        <div>
          <Button
            btntype="third"
            onClick={() => {
              setOpenInsertProblem(true)
            }}
          >
            Thêm vấn đề
          </Button>
        </div>
      </div>

      <Row className="mt-8 mb-8 mr-12 ml-12">
        <Col span={24}>
          <SearchAndFilter
            pagination={pagination}
            setPagination={setPagination}
          />
        </Col>
      </Row>

      <TableCustom
        dataSource={filteredProblems}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: pagination.PageSize }}
      />

      <InsertUpdateReport
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => fetchProblems(userInfo?.roomId)}
        problem={selectedProblem}
        defaultStatus={selectedProblem?.status}
      />
      <InsertReport
        open={openInsertProblem}
        onCancel={() => setOpenInsertProblem(false)}
        onOk={() => fetchProblems(userInfo?.roomId)}
        roomId={userInfo?.roomId}
      />
      <ModalViewDetailReport
        open={isModalViewDetailProblem}
        onCancel={() => setIsModalViewDetailProblem(false)}
        problemId={selectedProblem?._id}
        onOk={() => fetchProblems(userInfo?.roomId)}
      />
    </SpinCustom>
  )
}

export default ManageReport
