import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// 각 페이지 콘텐츠의 max-width / 좌우 padding 에 맞춰 정렬한다.
const Wrapper = styled.div`
  max-width: ${props => props.$width};
  margin: 0 auto;
  padding: 18px ${props => props.$pad} 0;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: #6b6b6b;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #1a1a1a;
  }
`;

// to:    이 화면에 들어오기 전 단계의 경로 (브라우저 히스토리가 아니라 논리적 상위 단계)
// width: 해당 페이지 콘텐츠 컨테이너의 max-width
// pad:   해당 페이지 콘텐츠 컨테이너의 좌우 padding
const BackButton = ({ to = "/workspace", label = "뒤로가기", width = "900px", pad = "20px" }) => {
  const navigate = useNavigate();
  return (
    <Wrapper $width={width} $pad={pad}>
      <Button onClick={() => navigate(to)}>
        <span aria-hidden>‹</span> {label}
      </Button>
    </Wrapper>
  );
};

export default BackButton;
