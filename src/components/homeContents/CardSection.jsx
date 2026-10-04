import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, ArticleItem, Section } from "../StyledComponents";
import TextCard from "./TextCard";

// 사진 기사는 사진 카드, 사진 없는 기사는 타이포 카드로 같은 그리드에 표시
// 3열, 최대 2줄
const COLUMNS = 3;
const MAX_CARDS = 6;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${COLUMNS}, 1fr);
  gap: 28px 20px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
`;

const CardImageBox = styled.div`
  width: 100%;
  height: 230px;
  overflow: hidden;
  background: #f0f0f0;
  margin-bottom: 10px;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }
  @media (max-width: 600px) {
    height: 160px;
  }
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
  margin-bottom: 4px;
  transition: color 0.2s;
`;

const CardSubtitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #6b6b6b;
  line-height: 1.4;
`;

const ImageCardLink = styled(Link)`
  display: block;
  &:hover ${CardImageBox} img {
    transform: scale(1.04);
  }
  &:hover ${CardTitle} {
    color: #3e5977;
  }
`;

const ImageCard = ({ article }) => (
  <ImageCardLink to={"/article/" + article.articleId}>
    <CardImageBox>
      <img src={"https://api.thegachonherald.com/image?path=" + article.mainImage} alt={article.title} />
    </CardImageBox>
    <CardTitle>{article.title}</CardTitle>
    <CardSubtitle>{article.subtitle}</CardSubtitle>
  </ImageCardLink>
);

const CardSection = ({ sectionId, sectionName, imageArticles, articles }) => {
  // 사진 기사를 먼저 채우고, 남는 칸은 텍스트 기사로 채움
  const imageCards = imageArticles.slice(0, MAX_CARDS);
  const textCards = articles.slice(0, MAX_CARDS - imageCards.length);

  return (
    <Container>
      <ArticleItem>
        <Link to={"/section/" + sectionId + "?page=1"}>
          <Section>{sectionName}</Section>
        </Link>
        <CardGrid>
          {imageCards.map((article) => (
            <ImageCard key={article.articleId} article={article} />
          ))}
          {textCards.map((article) => (
            <TextCard key={article.articleId} article={article} />
          ))}
        </CardGrid>
      </ArticleItem>
    </Container>
  );
};

export default CardSection;
