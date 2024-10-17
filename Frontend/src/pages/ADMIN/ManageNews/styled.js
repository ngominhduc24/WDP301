import styled from "styled-components"

export const NoteStyle = styled.div`
  .notify-label {
    text-align: center;
    font-weight: 600;
    color: #fa8514;
    font-size: 18px;
    padding: 12px;
  }
  .notify-box {
    border-radius: 5px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 12px;
    .notify-content {
      padding: 8px 12px;
    }
    .notify-header {
      font-weight: 600;
      padding: 8px 12px;
      background: rgb(57 102 169);
    }
    .notify-detail {
      color: #fa8514;
    }
  }
`
