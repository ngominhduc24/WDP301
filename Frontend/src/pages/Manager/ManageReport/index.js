import React, { useState, useEffect } from "react"
import { Col, Row, Space, Select, Table, Button } from "antd"
import SpinCustom from "src/components/Spin"
import Notice from "src/components/Notice"
import ManagerService from "src/services/ManagerService"
import TableCustom from "src/components/TableCustom"
const ManageReport = () => {
  const { Option } = Select
  const [houses, setHouses] = useState([])
  const [selectedHouse, setSelectedHouse] = useState(null)
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHouses()
  }, [])

  useEffect(() => {
    if (selectedHouse) {
      fetchProblems(selectedHouse)
    }
  }, [selectedHouse])

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
      const data = response.data.data
      setProblems(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching problems:", error)
      Notice({ msg: "Không thể lấy danh sách vấn đề" })
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
    { title: "Trạng Thái", dataIndex: "status", key: "status" },
    { title: "Phòng", dataIndex: ["roomId", "name"], key: "room" },
    {
      title: "Hành Động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary">UPDATE</Button>
          <Button type="default" style={{ backgroundColor: "yellow" }}>
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <SpinCustom spinning={loading}>
      <Row style={{ marginBottom: "20px" }}>
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
        dataSource={problems}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </SpinCustom>
  )
}

export default ManageReport

