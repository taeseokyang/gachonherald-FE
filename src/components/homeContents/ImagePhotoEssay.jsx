import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, ArticleItem, Section } from "../StyledComponents";

const FullImageBox = styled.div`
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
  margin-bottom: 12px;
  position: relative;
  & img {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease;
  }
  &:hover img {
    transform: scale(1.02);
  }
`;

const Caption = styled.div`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
  margin-bottom: 4px;
  transition: color 0.2s;
`;

const Subcaption = styled.div`
  font-size: 13px;
  color: #6b6b6b;
  line-height: 1.4;
`;

const ArticleLink = styled(Link)`
  display: block;
  &:hover ${Caption} {
    color: #3e5977;
  }
`;

const ImagePhotoEssay = ({ sectionId, sectionName, imageArticles }) => {
  const article = imageArticles[0];
  if (!article) return null;

  return (
    <Container>
      <ArticleItem>
        <Link to={"/section/" + sectionId + "?page=1"}>
          <Section>{sectionName}</Section>
        </Link>
        <ArticleLink to={"/article/" + article.articleId}>
          <FullImageBox>
            <img
              src={"https://api.thegachonherald.com/image?path=" + article.mainImage}
              alt={article.title}
            />
          </FullImageBox>
          <Caption>{article.title}</Caption>
          <Subcaption>{article.subtitle}</Subcaption>
        </ArticleLink>
      </ArticleItem>
    </Container>
  );
};

export default ImagePhotoEssay;
