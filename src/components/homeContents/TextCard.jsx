import { Link } from "react-router-dom";
import styled from "styled-components";

// 이미지 없는 기사를 사진 카드와 같은 크기의 타이포 카드로 표시
export const TextCardBox = styled.div`
  position: relative;
  width: 100%;
  height: 230px;
  margin-bottom: 10px;
  padding: 22px 22px 20px;
  box-sizing: border-box;
  background: #f4f6f9;
  border-top: 3px solid #3e5977;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: background 0.25s ease;

  @media (max-width: 600px) {
    height: 160px;
    padding: 16px 14px 14px;
  }
`;

const CardHeadline = styled.div`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: #1a1a1a;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s;

  @media (max-width: 600px) {
    font-size: 15px;
    -webkit-line-clamp: 4;
  }
`;

const QuoteMark = styled.div`
  position: absolute;
  right: 16px;
  bottom: -18px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 96px;
  line-height: 1;
  color: #3e5977;
  opacity: 0.12;
  pointer-events: none;

  @media (max-width: 600px) {
    font-size: 64px;
    bottom: -12px;
  }
`;

const Subtitle = styled.div`
  font-size: 12px;
  color: #6b6b6b;
  line-height: 1.4;
`;

const CardLink = styled(Link)`
  display: block;
  &:hover ${TextCardBox} {
    background: #e9eef4;
  }
  &:hover ${CardHeadline} {
    color: #3e5977;
  }
`;

const TextCard = ({ article }) => (
  <CardLink to={"/article/" + article.articleId}>
    <TextCardBox>
      <CardHeadline>{article.title}</CardHeadline>
      <QuoteMark>”</QuoteMark>
    </TextCardBox>
    <Subtitle>{article.subtitle}</Subtitle>
  </CardLink>
);

export default TextCard;
