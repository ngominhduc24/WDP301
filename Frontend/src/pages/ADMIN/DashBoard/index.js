import React, { useEffect, useState } from "react"
import { Card, Col, Row, Statistic, Table } from "antd"
import ReactECharts from "echarts-for-react"
import Cookies from "js-cookie"
import PropTypes from "prop-types"

const StatisticCard = ({ title, value }) => (
  <Col span={6}>
    <Card>
      <Statistic title={title} value={value} />
    </Card>
  </Col>
)

StatisticCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
}

const Dashboard = ({ info }) => {
  const { numberOfHouses, numberOfRooms, availableRooms, rentedRooms } = info

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Quản Lý Phòng Trọ - Dashboard
      </h2>
      <Row gutter={16}>
        <StatisticCard title="Số Nhà" value={numberOfHouses} />
        <StatisticCard title="Số Phòng" value={numberOfRooms} />
        <StatisticCard title="Phòng Trống" value={availableRooms} />
        <StatisticCard title="Phòng Đã Thuê" value={rentedRooms} />
      </Row>
    </div>
  )
}

Dashboard.propTypes = {
  info: PropTypes.shape({
    numberOfHouses: PropTypes.number.isRequired,
    numberOfRooms: PropTypes.number.isRequired,
    availableRooms: PropTypes.number.isRequired,
    rentedRooms: PropTypes.number.isRequired,
  }).isRequired,
}

Dashboard.propTypes = {
  info: PropTypes.shape({
    numberOfHouses: PropTypes.number.isRequired,
    numberOfRooms: PropTypes.number.isRequired,
    availableRooms: PropTypes.number.isRequired,
    rentedRooms: PropTypes.number.isRequired,
  }).isRequired,
}

// Dữ liệu mẫu
const dataFake = {
  numberOfHouses: 5,
  numberOfRooms: 20,
  availableRooms: 5,
  rentedRooms: 15,
  paymentTracking: [
    { status: "Paid", count: 10, total: 10000 },
    { status: "Unpaid", count: 5, total: 5000 },
  ],
  issueTracking: [
    { type: "New", count: 2 },
    { type: "In Progress", count: 1 },
    { type: "Resolved", count: 3 },
  ],
}

const monthlyData = [
  { month: "Jan", rented: 10, available: 10 },
  { month: "Feb", rented: 12, available: 8 },
  { month: "Mar", rented: 15, available: 5 },
  { month: "Apr", rented: 16, available: 4 },
  { month: "May", rented: 18, available: 2 },
]

const columnsPayment = [
  { title: "Status", dataIndex: "status", key: "status" },
  { title: "Number of Invoices", dataIndex: "count", key: "count" },
  { title: "Total Amount", dataIndex: "total", key: "total" },
]

const columnsIssue = [
  { title: "Issue Type", dataIndex: "type", key: "type" },
  { title: "Number of Issues", dataIndex: "count", key: "count" },
]

const ManagerDashBoard = () => {
  const [info, setInfo] = useState(dataFake)
  useEffect(() => {
    const accessToken = Cookies.get("accessToken")
    console.log(accessToken)
  })
  // Cấu hình biểu đồ cột (Bar Chart)
  const barChartOption = {
    title: { text: "Thống Kê Phòng Trọ Theo Tháng (Năm 2024)" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Phòng Đã Thuê", "Phòng Trống"] },
    xAxis: { type: "category", data: monthlyData.map(item => item.month) },
    yAxis: { type: "value" },
    series: [
      {
        name: "Phòng Đã Thuê",
        type: "bar",
        data: monthlyData.map(item => item.rented),
        color: "#5470C6",
      },
      {
        name: "Phòng Trống",
        type: "bar",
        data: monthlyData.map(item => item.available),
        color: "#91CC75",
      },
    ],
  }

  // Cấu hình biểu đồ đường (Line Chart)
  const lineChartOption = {
    title: { text: "Biểu Đồ Theo Dõi Số Lượng Phòng" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Phòng Đã Thuê", "Phòng Trống"] },
    xAxis: { type: "category", data: monthlyData.map(item => item.month) },
    yAxis: { type: "value" },
    series: [
      {
        name: "Phòng Đã Thuê",
        type: "line",
        data: monthlyData.map(item => item.rented),
        color: "#5470C6",
      },
      {
        name: "Phòng Trống",
        type: "line",
        data: monthlyData.map(item => item.available),
        color: "#91CC75",
      },
    ],
  }

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Quản Lý Phòng Trọ - Dashboard
      </h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic title="Số Nhà" value={info.numberOfHouses} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Số Phòng" value={info.numberOfRooms} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Phòng Trống" value={info.availableRooms} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Phòng Đã Thuê" value={info.rentedRooms} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Theo Dõi Thanh Toán">
            <Table
              columns={columnsPayment}
              dataSource={info.paymentTracking}
              pagination={false}
              rowKey="status"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Theo Dõi Sự Cố">
            <Table
              columns={columnsIssue}
              dataSource={info.issueTracking}
              pagination={false}
              rowKey="type"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Thống Kê Phòng Trọ Theo Tháng">
            <ReactECharts option={barChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Biểu Đồ Theo Dõi Số Lượng Phòng">
            <ReactECharts option={lineChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ManagerDashBoard
