import React, { useState, useEffect } from "react"
import { Col, Row, Select, Space } from "antd"
import SpinCustom from "src/components/Spin"
import Notice from "src/components/Notice"
import ManagerService from "src/services/ManagerService"
import TableCustom from "src/components/TableCustom"
import InsertUpdateReport from "./components/InsertUpdateReport"
import ModalViewDetailReport from "./components/ModalViewReport"
import SearchAndFilter from "./components/SearchAndFilter"
import Button from "src/components/MyButton/Button"

const ManageReport = () => {
  const { Option } = Select
  const [houses, setHouses] = useState([])
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [allProblems, setAllProblems] = useState([])
  const [filteredProblems, setFilteredProblems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalViewDetailProblem, setIsModalViewDetailProblem] =
    useState(false)

  const [pagination, setPagination] = useState({
    PageSize: 10,
    CurrentPage: 1,
    TextSearch: "",
    Status: "all",
  })

  useEffect(() => {
    fetchHouses()
  }, [])

  useEffect(() => {
    if (selectedHouse) fetchProblems(selectedHouse)
  }, [selectedHouse])

  useEffect(() => {
    applyFiltersAndSearch()
  }, [pagination, allProblems])

  const fetchHouses = async () => {
    try {
      setLoading(true)
      const response = await ManagerService.getAllHouses()
      setHouses(response.data.houses || [])
      if (response.data.houses.length > 0) {
        setSelectedHouse(response.data.houses[0]._id)
      }
    } catch (error) {
      console.error("Error fetching houses:", error)
      Notice({ msg: "Không thể lấy danh sách nhà" })
    } finally {
      setLoading(false)
    }
  }

  const fetchProblems = async houseId => {
    try {
      setLoading(true)
      const response = await ManagerService.getManagerProblems(houseId)
      setAllProblems(response.data.data || [])
    } catch (error) {
      console.error("Error fetching problems:", error)
      Notice({ msg: "Không thể lấy danh sách vấn đề" })
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSearch = () => {
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
  }

  const handleUpdate = problem => {
    setSelectedProblem(problem)
    setIsModalOpen(true)
  }

  const handleOpenView = problem => {
    setSelectedProblem(problem)
    setIsModalViewDetailProblem(true)
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
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button btntype="primary" onClick={() => handleUpdate(record)}>
            UPDATE
          </Button>
          <Button
            btntype="default"
            onClick={() => handleOpenView(record)}
            style={{ backgroundColor: "yellow" }}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
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

  return (
    <SpinCustom spinning={loading}>
      <div className="title-type-1 d-flex justify-content-space-between align-items-center mt-12 mb-30">
        <span style={{ fontWeight: "bold", marginRight: "8px" }}>
          Vấn Đề Nhà Trọ
        </span>
      </div>

      <Row className="mt-8 mb-8 mr-12 ml-12">
        <Col span={24}>
          <SearchAndFilter
            pagination={pagination}
            setPagination={setPagination}
          />
        </Col>
      </Row>

      <Row className="mt-8 mb-20 mr-12 ml-12">
        <Col span={6}>
          <Select
            value={selectedHouse}
            style={{ width: "100%" }}
            onChange={setSelectedHouse}
          >
            {houses.map(house => (
              <Option key={house._id} value={house._id}>
                {house.name}
              </Option>
            ))}
          </Select>
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
        onOk={() => fetchProblems(selectedHouse)}
        problem={selectedProblem}
        defaultStatus={selectedProblem?.status}
      />

      <ModalViewDetailReport
        open={isModalViewDetailProblem}
        onCancel={() => setIsModalViewDetailProblem(false)}
        problemId={selectedProblem?._id}
        onOk={() => fetchProblems(selectedHouse)}
      />
    </SpinCustom>
  )
}

export default ManageReport

