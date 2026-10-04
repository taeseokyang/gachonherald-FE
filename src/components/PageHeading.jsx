import styled from "styled-components";

// 공개 탭 공통 제목: 왼쪽 정렬, 네이비 세로선이 제목과 설명을 함께 감쌈
const Wrapper = styled.div`
  margin: 8px 0 32px;
  padding: 2px 0 2px 14px;
  border-left: 3px solid #3e5977;

  @media (max-width: 600px) {
    margin-bottom: 24px;
    padding-left: 12px;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: #1a1a1a;

  @media (max-width: 600px) {
    font-size: 19px;
  }
`;

const Description = styled.p`
  margin: 5px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #8a8a8a;
`;

const PageHeading = ({ title, description }) => (
  <Wrapper>
    <Title>{title}</Title>
    {description && <Description>{description}</Description>}
  </Wrapper>
);

export default PageHeading;
