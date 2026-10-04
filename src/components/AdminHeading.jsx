import styled from "styled-components";

// 관리자 화면 공통 제목: 왼쪽 제목 + 오른쪽 버튼, 연한 구분선
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 28px;
  border-bottom: 1px solid #e8e8e8;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AdminHeading = ({ title, children }) => (
  <Wrapper>
    <Title>{title}</Title>
    {children && <Actions>{children}</Actions>}
  </Wrapper>
);

export default AdminHeading;
