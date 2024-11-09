import React, { useEffect, useState } from "react"
import { Card, Col, Row, Statistic, Table, message, Select } from "antd"
import ReactECharts from "echarts-for-react"
import ManagerService from "src/services/ManagerService"

const { Option } = Select

const columnsPayment = [
  { title: "Trạng thái", dataIndex: "status", key: "status" },
  { title: "Số lượng hóa đơn", dataIndex: "count", key: "count" },
  { title: "Tổng số tiền", dataIndex: "total", key: "total" },
]

const columnsIssue = [
  { title: "Loại vấn đề", dataIndex: "type", key: "type" },
  { title: "Số lượng vấn đề", dataIndex: "count", key: "count" },
]

const ManagerDashBoard = () => {
  const [generalInfo, setGeneralInfo] = useState({})
  const [revenueData, setRevenueData] = useState({})
  const [billData, setBillData] = useState([])
  const [issueData, setIssueData] = useState([])
  const [loading, setLoading] = useState(false)
  const [month, setMonth] = useState(10)
  const [year, setYear] = useState(2024)

  useEffect(() => {
    fetchData()
  }, [month, year])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [generalResponse, revenueResponse, billResponse, problemsResponse] =
        await Promise.all([
          ManagerService.getGeneralStatistic(),
          ManagerService.getRevenue(),
          ManagerService.getBillStatistic(`${month}-${year}`), // Format month and year for API call
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

  const formatBillData = data => {
    if (!data) return []
    return [
      { status: "Đã thanh toán", count: data.billIsPaid, total: data.totalBillIsPaid },
      {
        status: "Chưa thanh toán",
        count: data.billIsNotPaid,
        total: data.totalBillIsNotPaid,
      },
    ]
  }

  const formatIssueData = data => {
    if (!data) return []
    return [
      { type: "Mới", count: data.numberProblemNone },
      { type: "Đang xử lý", count: data.numberProblemDoing },
      { type: "Đã xử lý", count: data.numberProblemDone },
    ]
  }

  const handleMonthChange = value => {
    setMonth(value)
  }

  const handleYearChange = value => {
    setYear(value)
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
    title: { text: "" },
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
            <div style={{ display: "flex", marginBottom: 16 }}>
              <Select
                defaultValue={month}
                style={{ width: 100, marginRight: 8 }}
                onChange={handleMonthChange}
              >
                {Array.from({ length: 12 }, (_, k) => (
                  <Option key={k + 1} value={k + 1}>
                    Tháng {k + 1}
                  </Option>
                ))}
              </Select>
              <Select
                defaultValue={year}
                style={{ width: 100 }}
                onChange={handleYearChange}
              >
                {Array.from({ length: 5 }, (_, k) => (
                  <Option key={2022 + k} value={2022 + k}>
                    {2022 + k}
                  </Option>
                ))}
              </Select>
            </div>
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
          <Card title="Biểu Đồ Doanh Thu Theo Tháng">
            <ReactECharts option={lineChartOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ManagerDashBoard

