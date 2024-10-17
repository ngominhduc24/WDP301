import React, { useEffect, useMemo, useState } from "react"
import { Card, Col, Row, Statistic, Table, message } from "antd"
import ReactECharts from "echarts-for-react"
// import Cookies from "js-cookie"
import ManagerService from "src/services/ManagerService"

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
  const [generalInfo, setGeneralInfo] = useState({})
  const [revenueData, setRevenueData] = useState({})
  const [billData, setBillData] = useState([])
  const [issueData, setIssueData] = useState([])
  const [loading, setLoading] = useState(false)
  // const [month, setMonth] = useState("10-2024")
  const month = useMemo(() => "10-2024", [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [
          generalResponse,
          revenueResponse,
          billResponse,
          problemsResponse,
        ] = await Promise.all([
          ManagerService.getGeneralStatistic(),
          ManagerService.getRevenue(),
          ManagerService.getBillStatistic(month),
          ManagerService.getProblems(),
        ])

        setGeneralInfo(generalResponse?.data || {})
        setRevenueData(revenueResponse?.data || {})
        setBillData(formatBillData(billResponse?.data))
        setIssueData(formatIssueData(problemsResponse?.data))
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu từ API")
        console.error("API Error: ", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [month])

  const formatBillData = data => {
    if (!data) return []
    return [
      { status: "Paid", count: data.billIsPaid, total: data.totalBillIsPaid },
      {
        status: "Unpaid",
        count: data.billIsNotPaid,
        total: data.totalBillIsNotPaid,
      },
    ]
  }

  const formatIssueData = data => {
    if (!data) return []
    return [
      { type: "New", count: data.numberProblemNone },
      { type: "In Progress", count: data.numberProblemDoing },
      { type: "Resolved", count: data.numberProblemDone },
    ]
  }

  const barChartOption = {
    title: { text: "Thống Kê Doanh Thu Theo Tháng (Năm 2024)" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Doanh Thu"] },
    xAxis: {
      type: "category",
      data: Object.keys(revenueData?.revenueByMonth || {}),
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Doanh Thu",
        type: "bar",
        data: Object.values(revenueData?.revenueByMonth || {}),
        color: "#5470C6",
      },
    ],
  }

  const lineChartOption = {
    title: { text: "Biểu Đồ Doanh Thu Theo Tháng" },
    tooltip: { trigger: "axis" },
    legend: { data: ["Doanh Thu"] },
    xAxis: {
      type: "category",
      data: Object.keys(revenueData?.revenueByMonth || {}),
    },
    yAxis: { type: "value" },
    series: [
      {
        name: "Doanh Thu",
        type: "line",
        data: Object.values(revenueData?.revenueByMonth || {}),
        color: "#5470C6",
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
          <Card loading={loading}>
            <Statistic title="Số Nhà" value={generalInfo?.houseNumber || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic title="Số Phòng" value={generalInfo?.roomNumber || 0} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Phòng Trống"
              value={generalInfo?.roomNumberEmpty || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Phòng Đã Thuê"
              value={generalInfo?.roomNumberNotEmpty || 0}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Theo Dõi Thanh Toán" loading={loading}>
            <Table
              columns={columnsPayment}
              dataSource={billData}
              pagination={false}
              rowKey="status"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Theo Dõi Sự Cố" loading={loading}>
            <Table
              columns={columnsIssue}
              dataSource={issueData}
              pagination={false}
              rowKey="type"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Thống Kê Doanh Thu Theo Tháng">
            <ReactECharts option={barChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={24}>
          <Card title="Biểu Đồ Doanh Thu Theo Tháng">
            <ReactECharts option={lineChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ManagerDashBoard
