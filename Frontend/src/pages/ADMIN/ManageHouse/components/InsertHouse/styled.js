import { TreeSelect } from "antd"
import styled from "styled-components"

export const ButtonUploadStyle = styled.div`
  .account-button-upload {
    border-radius: 4px;
    padding: 2px !important;
    height: unset !important;
    border: 2px dashed #e1e1e1;
    .account-text-upload {
      font-weight: 600;
      font-size: 12px;
      line-height: 120%;
      color: #154398;
    }
    .account-background-upload {
      background: #f7f7f7;
      border-radius: 4px;
      justify-content: center;
      align-items: center;

      padding: 4px 15px;
    }
    :hover {
      border: 1px solid #154398;
      background-color: #154398;

      .account-background-upload {
        background-color: transparent;
        border: 1px dashed transparent;
      }
      .account-text-upload {
        color: #fff;
      }
    }
  }
`

export const StylesTabPattern = styled.div`
  height: calc(100vh - 200px);
  .ant-tabs-nav {
    margin-bottom: 0px;
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 100;
  }
  .ant-tabs-nav {
    :before {
      border-bottom: 1px solid #ccc;
    }
    ::after {
      content: "";
      width: 100%;
      height: 12px;
      position: absolute;
      top: -12px;
      background-color: #fff;
    }
  }
  .ant-tabs-tab {
    border: 1px solid #ccc !important;
  }
  .ant-tabs-tab-active {
    border-bottom: none !important;
  }

  .declaration-shadow-box {
    border: 1px solid #ccc;
  }
`

export const PatentRegistrationChildBorder = styled.div`
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 8px;
  .ant-form-item {
    margin: 0 !important;
  }
  .ant-form-item-control-input {
    min-height: 0;
    /* margin-top: 5px; */
  }
`

export const TreeSelectStyled = styled(TreeSelect)``
