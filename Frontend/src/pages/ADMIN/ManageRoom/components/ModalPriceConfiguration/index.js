import { Table, message } from "antd"
import { useEffect, useState } from "react"
import CustomModal from "src/components/Modal/CustomModal"
import Button from "src/components/MyButton/Button"
import ModalInsertPrice from "./modal/ModalInsertPrice"
import ManagerService from "src/services/ManagerService"
import CB1 from "src/components/Modal/CB1"
const ModalPriceConfiguration = ({
  open,
  onCancel,
  onOk,
  priceList,
  houseId,
}) => {
  const [dataSource, setDataSource] = useState([])
  const [openInsertPriceModal, setOpenInsertPriceModal] = useState(false)
  const [priceOptions, setPriceOptions] = useState([])

  useEffect(() => {
    if (priceList) {
      const formattedData = priceList.map((item, index) => ({
        key: index + 1,
        feeType: item.base.name,
        price: `${item.price.toLocaleString()} ₫`,
        unit: item.base.unit,
        _id: item._id,
      }))
      setDataSource(formattedData)
    }
  }, [priceList])

  useEffect(() => {
    const fetchPriceOptions = async () => {
      try {
        const response = await ManagerService.getPriceList()
        if (response?.data) {
          setPriceOptions(response.data)
        } else {
          setPriceOptions([])
        }
      } catch (error) {
        console.error("Error fetching price list:", error)
        message.error("Có lỗi xảy ra khi tải danh sách loại phí!")
      }
    }
    fetchPriceOptions()
  }, [])

  const handleDeletePrice = record => {
    CB1({
      title: `Bạn có chắc chắn muốn xóa phí "${record.feeType}" không?`,
      icon: <i className="icon-warning-usb" />,
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await ManagerService.removePrice(houseId, record._id)
          message.success("Xóa loại phí thành công!")

          setDataSource(prevData =>
            prevData.filter(item => item.key !== record.key),
          )
          onOk && onOk()
        } catch (error) {
          message.error("Xóa loại phí thất bại!")
        }
      },
    })
  }

  return (
    <>
      <CustomModal
        title="Cấu Hình Bảng Giá"
        visible={open}
        onCancel={onCancel}
        width={800}
        footer={
          <div className="d-flex justify-content-between">
            <Button className="mr-8" onClick={onCancel}>
              Đóng
            </Button>
          </div>
        }
      >
        <Table
          dataSource={dataSource}
          columns={[
            {
              title: "STT",
              dataIndex: "key",
              key: "key",
              width: "10%",
              align: "center",
            },
            {
              title: "Loại Phí",
              dataIndex: "feeType",
              key: "feeType",
              align: "center",
            },
            {
              title: "Đơn Giá",
              dataIndex: "price",
              key: "price",
              align: "center",
            },
            {
              title: "Đơn Vị",
              dataIndex: "unit",
              key: "unit",
              align: "center",
            },
            {
              title: "Thao Tác",
              key: "action",
              width: "15%",
              align: "center",
              render: (_, record) => (
                <Button danger onClick={() => handleDeletePrice(record)}>
                  XÓA
                </Button>
              ),
            },
          ]}
          pagination={false}
          bordered
          footer={() => (
            <Button
              btntype="primary"
              onClick={() => setOpenInsertPriceModal(true)}
            >
              Thêm Kinh Phí
            </Button>
          )}
        />
      </CustomModal>

      {openInsertPriceModal && (
        <ModalInsertPrice
          visible={openInsertPriceModal}
          onCancel={() => setOpenInsertPriceModal(false)}
          onOk={() => {
            onOk()
            setOpenInsertPriceModal(false)
          }}
          priceOptions={priceOptions}
          houseId={houseId}
        />
      )}
    </>
  )
}

export default ModalPriceConfiguration
