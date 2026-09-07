import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  max-width: ${props => (props.$fluid ? "none" : "800px")};
  margin: 15px auto 0px auto;
  padding: 0px 20px;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 6px 0px;
  font-size: 14px;
  font-weight: 700;
  color: #3e5977;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// to: 이 화면에 들어오기 전 단계의 경로 (브라우저 히스토리가 아니라 논리적 상위 단계)
// fluid: 본문이 800px 중앙정렬이 아니라 전체 너비일 때 (기사 작성/수정 화면)
const BackButton = ({ to = "/workspace", label = "뒤로가기", fluid = false }) => {
  const navigate = useNavigate();
  return (
    <Wrapper $fluid={fluid}>
      <Button onClick={() => navigate(to)}>{label}</Button>
    </Wrapper>
  );
};

export default BackButton;
