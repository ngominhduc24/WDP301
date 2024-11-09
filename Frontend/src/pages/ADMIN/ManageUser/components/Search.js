import { Input, Row, Col, Select } from "antd"
import { useEffect, useState } from "react"
import FlInput from "src/components/FloatingLabel/Input"
import FlSelect from "src/components/FloatingLabel/Select"
import { SearchStyled } from "../styled"

const { Option } = Select

const Search = ({ setPagination, pagination, houses, onHouseChange }) => {
  const [searchText, setSearchText] = useState(pagination.TextSearch || "")
  const [accountType, setAccountType] = useState(pagination.AccountType || "")
  const [status, setStatus] = useState(pagination.Status || null)
  const [selectedHouse, setSelectedHouse] = useState(pagination.House || null)

  // This function will handle changes to search fields and update the pagination state
  const handleSearch = () => {
    setPagination(prev => ({
      ...prev,
      TextSearch: searchText,
      AccountType: accountType,
      Status: status,
      House: selectedHouse, // Set House filter here
      CurrentPage: 1, // Reset to page 1 when the search criteria changes
    }))
  }

  useEffect(() => {
    handleSearch() // Trigger the search effect when the component first mounts or pagination changes
  }, [searchText, accountType, status, selectedHouse])

  const handleHouseChange = value => {
    setSelectedHouse(value)
    onHouseChange(value) // Trigger the callback passed from parent to update selectedHouse in parent
  }

  return (
    <SearchStyled>
      <Row gutter={[16, 16]}>
        <Col flex="auto">
          <FlInput
            value={searchText} // Set value of input to searchText
            onChange={e => setSearchText(e.target.value)} // Update searchText state
            onSearch={handleSearch} // Trigger search on enter
            search
            allowClear
            label="Nhập tên tài khoản, số điện thoại, email"
          />
        </Col>

        {/* Filter by Account Type */}
        <Col span={8}>
          <Select
            value={accountType}
            onChange={setAccountType}
            placeholder="Chọn loại tài khoản"
            allowClear
            style={{ width: "100%" }}
          >
            <Option value="">Tất cả</Option>
            <Option value="admin">Quản trị viên</Option>
            <Option value="host">Quản lý</Option>
            <Option value="renter">Người dùng</Option>
          </Select>
        </Col>

        {/* Filter by Status */}
        <Col span={8}>
          <Select
            value={status}
            onChange={setStatus}
            placeholder="Chọn trạng thái"
            allowClear
            style={{ width: "100%" }}
          >
            <Option value={null}>Tất cả</Option>
            <Option value={true}>Đang hoạt động</Option>
            <Option value={false}>Không hoạt động</Option>
          </Select>
        </Col>

        {/* Filter by House */}
        {/* <Col span={8}>
          <Select
            value={selectedHouse}
            onChange={handleHouseChange}
            placeholder="Chọn nhà"
            allowClear
            style={{ width: "100%" }}
          >
            <Option value={null}>Tất cả</Option>
            {houses.map(house => (
              <Option key={house._id} value={house._id}>
                {house.name}
              </Option>
            ))}
          </Select>
        </Col> */}
      </Row>
    </SearchStyled>
  )
}

export default Search

