import { Modal } from "antd"
import styled from "styled-components"

export const ModalWrapper = styled.div`
  .textTitle {
    margin-bottom: 16px;
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    color: #333;
  }

  .trashCan {
    margin-top: 8px;
    margin-bottom: 24px;
    display: flex;
    justify-content: center;

    svg {
      width: 80px;
      height: 80px;
    }
  }

  .ant-modal-confirm-btns {
    margin-top: 16px;
    padding-bottom: 16px;
    justify-content: center;
  }
`

export const ModalStyled = styled(Modal)`
  .ant-modal-confirm-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`
