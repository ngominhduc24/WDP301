import { Col, Row, Modal, Tooltip } from "antd"
import Button from "src/components/MyButton/Button"
import { useEffect, useState } from "react"
import ManagerService from "src/services/ManagerService"

const ModalViewHouse = ({ open, onCancel, house }) => {
  const [utilityNames, setUtilityNames] = useState([]) // Chứa tên của tiện ích chính
  const [otherUtilityNames, setOtherUtilityNames] = useState([]) // Chứa tên của tiện ích khác

  useEffect(() => {
    if (house) {
      fetchUtilities() // Gọi API khi `house` có dữ liệu
    }
  }, [house])

  // Hàm gọi API để lấy thông tin utilities và otherUtilities
  const fetchUtilities = async () => {
    try {
      const [utilitiesResponse, otherUtilitiesResponse] = await Promise.all([
        ManagerService.getUtilities(), // Gọi API lấy danh sách tiện ích chính
        ManagerService.getOtherUtilities(), // Gọi API lấy danh sách tiện ích khác
      ])

      // Tạo một map để nhanh chóng tra cứu tên từ id
      const utilitiesMap = (utilitiesResponse?.data || []).reduce(
        (map, utility) => {
          map[utility._id] = utility.name
          return map
        },
        {},
      )

      const otherUtilitiesMap = (otherUtilitiesResponse?.data || []).reduce(
        (map, utility) => {
          map[utility._id] = utility.name
          return map
        },
        {},
      )

      // Lấy tên của utilities và otherUtilities từ id truyền vào house
      const utilitiesNames = (house.utilities || []).map(
        id => utilitiesMap[id] || "Unknown Utility",
      )

      const otherUtilitiesNames = (house.otherUtilities || []).map(
        id => otherUtilitiesMap[id] || "Unknown Other Utility",
      )

      // Cập nhật state
      setUtilityNames(utilitiesNames)
      setOtherUtilityNames(otherUtilitiesNames)
    } catch (error) {
      console.error("Error fetching utilities:", error)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Chi tiết nhà"
      width="70vw"
      footer={
        <div className="lstBtn d-flex-sb">
          <div className="lstBtn-right d-flex-end">
            <Button
              btntype="third"
              className="ml-8 mt-12 mb-12"
              onClick={onCancel}
            >
              Đóng
            </Button>
          </div>
        </div>
      }
    >
      <div className="mr-16 ml-16 flex">
        <Row gutter={[16, 16]}>
          {/* Thông tin chi tiết nhà */}
          <Col span={12} className="mt-40">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <strong>Tên nhà:</strong>{" "}
                {house?.houseName || "Không có thông tin"}
              </Col>
              <Col span={24}>
                <strong>Địa chỉ:</strong> {house?.address || "Không có địa chỉ"}
              </Col>
              <Col span={24}>
                <strong>Số phòng:</strong> {house?.numberOfRooms || 0}
              </Col>
              <Col span={24}>
                <strong>Tiền điện:</strong>{" "}
                {house?.electricPrice || "Không có thông tin"}
              </Col>
              <Col span={24}>
                <strong>Tiền nước:</strong>{" "}
                {house?.waterPrice || "Không có thông tin"}
              </Col>
              <Col span={24}>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={
                    house?.status === "active" ? "blue-text" : "red-text"
                  }
                >
                  {house?.status === "active"
                    ? "Đang hoạt động"
                    : "Dừng hoạt động"}
                </span>
              </Col>
              {/* Hiển thị tiện ích chính */}
              <Col span={24}>
                <strong>Tiện ích:</strong>
                <div>
                  {utilityNames.length > 0 ? (
                    utilityNames.map((utility, index) => (
                      <Tooltip title={utility} key={index}>
                        <span
                          style={{ display: "inline-block", margin: "0 8px" }}
                        >
                          {utility} ✔️
                        </span>
                      </Tooltip>
                    ))
                  ) : (
                    <span>Không có tiện ích</span>
                  )}
                </div>
              </Col>
              {/* Hiển thị tiện ích khác */}
              <Col span={24}>
                <strong>Tiện ích khác:</strong>
                <div>
                  {otherUtilityNames.length > 0 ? (
                    otherUtilityNames.map((otherUtility, index) => (
                      <Tooltip title={otherUtility} key={index}>
                        <span
                          style={{ display: "inline-block", margin: "0 8px" }}
                        >
                          {otherUtility} ✔️
                        </span>
                      </Tooltip>
                    ))
                  ) : (
                    <span>Không có tiện ích khác</span>
                  )}
                </div>
              </Col>
            </Row>
          </Col>
          {/* Hình ảnh nhà */}
          <Col span={12} style={{ textAlign: "center" }}>
            <img
              src={house?.image || "https://via.placeholder.com/150"}
              alt="house"
              style={{ width: "80%", height: "auto", maxHeight: "400px" }}
            />
          </Col>
        </Row>
      </div>
    </Modal>
  )
}

export default ModalViewHouse
