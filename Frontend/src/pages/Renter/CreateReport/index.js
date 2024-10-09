import React, { useState, useEffect } from "react"
import {
  Col,
  Row,
  Space,
  Tooltip,
  Modal,
  Table,
  Pagination,
  Select,
  Input,
} from "antd"
import {
  InfoCircleOutlined,
  FileExcelOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import SpinCustom from "src/components/Spin"
import Notice from "src/components/Notice"
import SearchAndFilter from "./components/SearchAndFilter"
import ModalViewDetailReport from "./components/ModalViewReport"
import TableCustom from "src/components/TableCustom"
import Button from "src/components/MyButton/Button"
import InsertUpdateReport from "./components/InsertUpdateReport" // Đảm bảo import đúng component

const ManageReport = () => {
  const { Option } = Select

  // Dữ liệu giả cho báo cáo
  const fakeData = [
    {
      id: 1,
      reportName: "Báo cáo dột trần phòng trọ",
      reportType: "Cơ sơ vật chất",
      createdBy: "Ngô Minh Vũ",
      createdDate: new Date(),
      status: "Hoàn thành",
    },
    {
      id: 2,
      reportName: "Báo cáo bốc mùi hôi",
      reportType: "Cơ sở vật chất",
      createdBy: "Vũ Minh Ngô",
      createdDate: new Date(),
      status: "Đang xử lý",
    },
  ]

  const [reports, setReports] = useState(fakeData)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    pageSize: 10,
    currentPage: 1,
    textSearch: "",
  })
  const [selectedReport, setSelectedReport] = useState(null)
  const [openViewReport, setOpenViewReport] = useState(false)
  const [openAddReport, setOpenAddReport] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [pagination])

  const fetchReports = () => {
    setLoading(true)
    setTimeout(() => {
      setReports(fakeData)
      setLoading(false)
    }, 1000)
  }

  // Thêm báo cáo mới vào danh sách
  const handleAddReport = newReport => {
    setReports([...reports, { ...newReport, id: reports.length + 1 }])
    setOpenAddReport(false) // Đóng modal sau khi thêm báo cáo mới
  }

  const handleUpdateReportStatus = (id, newStatus) => {
    setReports(
      reports.map(report =>
        report.id === id ? { ...report, status: newStatus } : report,
      ),
    )
  }

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 60,
      render: (text, record, index) => (
        <div className="text-center">
          {index + 1 + pagination.pageSize * (pagination.currentPage - 1)}
        </div>
      ),
    },
    {
      title: "Tên báo cáo",
      dataIndex: "reportName",
      key: "reportName",
      width: 200,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "Loại báo cáo",
      dataIndex: "reportType",
      key: "reportType",
      width: 150,
      render: text => <span>{text}</span>,
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 200,
      render: date => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: status => (
        <span
          style={{
            color:
              status === "Hoàn thành"
                ? "green"
                : status === "Đang xử lý"
                ? "orange"
                : "red",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Chức năng",
      key: "action",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            className="btn-hover-shadow"
            onClick={() => handleViewReport(record)}
            icon={<InfoCircleOutlined />}
          >
            Xem chi tiết
          </Button>

          <Button
            type="default"
            icon={<FileExcelOutlined />}
            onClick={() => handleExportReport(record)}
          >
            Xuất báo cáo
          </Button>
        </Space>
      ),
    },
  ]

  const handleViewReport = record => {
    setSelectedReport(record)
    setOpenViewReport(true)
  }

  const handleExportReport = record => {
    Notice({
      msg: `Xuất báo cáo: ${record.reportName}`,
    })
  }

  return (
    <SpinCustom spinning={loading}>
      <div className="title-type-1 d-flex justify-content-space-between align-items-center mt-12 mb-30">
        <div>Tạo báo cáo</div>
        <Button
          btntype="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpenAddReport(true)} // Mở modal thêm báo cáo mới
        >
          Thêm báo cáo mới
        </Button>
      </div>

      {/* Tìm kiếm và lọc */}
      <SearchAndFilter pagination={pagination} setPagination={setPagination} />

      {/* Bảng dữ liệu báo cáo */}
      <Row>
        <Col span={24} className="mt-30 mb-20">
          <TableCustom
            rowKey="id"
            columns={columns}
            dataSource={reports}
            pagination={{
              current: pagination.currentPage,
              pageSize: pagination.pageSize,
              total: reports.length,
              onChange: (page, pageSize) =>
                setPagination({ ...pagination, currentPage: page, pageSize }),
            }}
          />
        </Col>
      </Row>

      {/* Modal xem chi tiết báo cáo */}
      <ModalViewDetailReport
        visible={openViewReport}
        report={selectedReport}
        onCancel={() => setOpenViewReport(false)}
        onUpdateStatus={handleUpdateReportStatus}
      />

      <InsertUpdateReport
        open={openAddReport}
        onCancel={() => setOpenAddReport(false)}
        onOk={handleAddReport}
      />
    </SpinCustom>
  )
}

export default ManageReport

