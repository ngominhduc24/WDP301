import { Col, Row, Modal, Tooltip } from "antd"
import Button from "src/components/MyButton/Button"
import styled from "styled-components"

// Styled component cho phần chi tiết thông tin phòng
const DetailsContainer = styled.div`
  padding: 20px;
  .detail-row {
    border-bottom: 1px solid #e0e0e0;
    padding: 8px 0;
    display: flex;
    justify-content: space-between;
  }
  .label {
    font-weight: 600;
    color: #333;
  }
  .value {
    font-weight: 500;
    color: #555;
  }
`

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  img {
    border: 2px solid #ddd;
    border-radius: 8px;
    max-width: 100%;
    max-height: 300px;
  }
`

const ModalViewRoom = ({ open, onCancel, room }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Chi Tiết Phòng"
      width="70vw"
      footer={
        <div className="d-flex justify-content-end">
          <Button
            btntype="third"
            className="ml-8 mt-12 mb-12"
            onClick={onCancel}
          >
            Đóng
          </Button>
        </div>
      }
    >
      <DetailsContainer>
        <Row gutter={[24, 24]}>
          {/* Cột 1: Thông tin chi tiết phòng */}
          <Col span={12}>
            <div className="detail-row">
              <div className="label">STT:</div>
              <div className="value">{room?._id || "N/A"}</div>
            </div>
            <div className="detail-row">
              <div className="label">Tên Phòng:</div>
              <div className="value">{room?.roomName || "N/A"}</div>
            </div>
            <div className="detail-row">
              <div className="label">Tầng:</div>
              <div className="value">{room?.floor || "N/A"}</div>
            </div>
            <div className="detail-row">
              <div className="label">Diện Tích:</div>
              <div className="value">{room?.area || "N/A"}</div>
            </div>
            <div className="detail-row">
              <div className="label">Giá Thuê:</div>
              <div className="value">{room?.price || "N/A"} VND/tháng</div>
            </div>
            <div className="detail-row">
              <div className="label">Trạng Thái:</div>
              <div
                className="value"
                style={{
                  color: room?.status === "available" ? "green" : "red",
                }}
              >
                {room?.status === "available" ? "Còn trống" : "Đã thuê"}
              </div>
            </div>
          </Col>
          {/* Cột 2: Hình ảnh phòng */}
          <Col span={12}>
            <ImageContainer>
              <img
                src={room?.image || "https://via.placeholder.com/300"}
                alt="house"
              />
            </ImageContainer>
          </Col>
        </Row>
      </DetailsContainer>
    </Modal>
  )
}

export default ModalViewRoom

