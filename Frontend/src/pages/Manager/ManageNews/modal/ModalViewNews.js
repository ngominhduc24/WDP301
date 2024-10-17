import { Col, Row, Drawer, Space } from "antd"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import CustomModal from "src/components/Modal/CustomModal"
import { SYSTEM_KEY } from "src/constants/constants"
import { getListComboByKey } from "src/lib/utils"
import moment from "moment"
import { LeftCircleOutlined } from "@ant-design/icons"
import bg from "src/assets/images/modalLogin/ducdong.jpg"
import Button from "src/components/MyButton/Button"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import SvgIcon from "src/components/SvgIcon"
import CB1 from "src/components/Modal/CB1"
import Notice from "src/components/Notice"
import BookingNoteService from "src/services/BookingNoteService"
import ModalInsertBookingNote from "./ModalInsertBookingNote"
import { DEFAULT_PAGE_SIZE } from "src/constants/pageSizeOptions"

const ModalViewNews = ({ open, onCancel, onOk }) => {
  const { listSystemKey } = useSelector(state => state.appGlobal)
  const [openInsertBookingNote, setOpenInsertBookingNote] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bookingNote, setBookingNote] = useState([])
  const [total, setTotal] = useState(0)

  const [pagination, setPagination] = useState({
    PageSize: DEFAULT_PAGE_SIZE,
    CurrentPage: 1,
    TextSearch: "",
  })
  const handleButtonClick = (record, key) => {
    switch (key) {
      case "edit":
        setOpenInsertBookingNote(record)
        break
      case "delete":
        handleDeleteBookingNote(record)
        break
      default:
        break
    }
  }

  const handleDeleteBookingNote = async record => {
    try {
      setLoading(true)
      const body = [record?.BookingNoteID]
      const res = await BookingNoteService.deleteBookingNote(body)
      if (res?.isError) return
      onOk()
      Notice({
        msg: "Xóa thành công.",
      })
      onCancel()
    } catch (error) {
      console.error("Error deleting booking note:", error)
    } finally {
      setLoading(false)
    }
  }
  const getListBookingNote = async () => {
    try {
      setLoading(true)
      const res = await BookingNoteService.getListBookingNote(pagination)
      if (res?.isError) return
      setBookingNote(res?.Object?.Data)
      setTotal(res?.Object?.Total)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer
      title={
        <>
          <Row className="d-flex ">
            <Col span={12}>
              <div className="d-flex " onClick={onCancel}>
                <LeftCircleOutlined
                  style={{
                    margin: "0 8px",
                    color: "var(--color-primary)",
                    fontSize: "14px",
                  }}
                />
                <div className="title-page fs-14 pointer text-uppercase">
                  Trở về
                </div>
              </div>
            </Col>
            <Col span={12}>
              <Space size={8} className="d-flex justify-content-flex-end">
                <div className="mb-12 d-flex">
                  <ButtonCircle
                    className="mr-8"
                    btntype="third"
                    iconName="edit"
                    onClick={() => handleButtonClick(open, "edit")}
                  />

                  <ButtonCircle
                    btntype="third"
                    iconName="bin"
                    onClick={() => handleButtonClick(open, "delete")}
                  />
                </div>
              </Space>
            </Col>
          </Row>
        </>
      }
      placement="right"
      closable={false}
      onClose={onCancel}
      open={open}
      getContainer={() => document.getElementById("wrap-page")}
      // getContainer={false}
      style={{ position: "absolute", top: 50 }}
      width={"100%"}
    >
      <div>
        <Col span={24}>
          <div className="mb-12" style={{ opacity: 0.5, textAlign: "right" }}>
            {moment(open?.CreateDate).format("DD/MM/YYYY HH:mm")}
          </div>
        </Col>

        <Row gutter={[8]}>
          <Col span={24}>
            <span>• {open?.BookingNote}</span>
          </Col>
        </Row>
      </div>
      {!!openInsertBookingNote && (
        <ModalInsertBookingNote
          open={openInsertBookingNote}
          onOk={() => getListBookingNote()}
          onCancel={() => setOpenInsertBookingNote(false)}
        />
      )}
    </Drawer>
  )
}

export default ModalViewNews
