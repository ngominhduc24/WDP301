import { Col, Row, Modal, Tooltip } from "antd"
import Button from "src/components/MyButton/Button"

const ModalViewHouse = ({ open, onCancel, house }) => {
  return (
    <Modal
      open={open} // Thay đổi từ `visible` thành `open` để khớp với Ant Design
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
                <strong>Tên nhà:</strong> {house?.houseName}
              </Col>
              <Col span={24}>
                <strong>Địa chỉ:</strong> {house?.address}
              </Col>
              <Col span={24}>
                <strong>Số phòng:</strong> {house?.numberOfRooms}
              </Col>
              <Col span={24}>
                <strong>Tiền điện:</strong> {house?.electricityPrice} VND/kWh
              </Col>
              <Col span={24}>
                <strong>Tiền nước:</strong> {house?.waterPrice} VND/m³
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
              <Col span={24}>
                <strong>Tiện ích:</strong>
                <div>
                  {house?.amenities &&
                    Object.keys(house?.amenities).map(amenity => (
                      <Tooltip title={amenity} key={amenity}>
                        <span
                          style={{ display: "inline-block", margin: "0 8px" }}
                        >
                          {house?.amenities[amenity]
                            ? `${amenity} ✔️`
                            : `${amenity} ❌`}
                        </span>
                      </Tooltip>
                    ))}
                </div>
              </Col>
            </Row>
          </Col>
          {/* Hình ảnh nhà */}
          <Col span={12} style={{ textAlign: "center" }}>
            <img
              src={house?.image}
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

