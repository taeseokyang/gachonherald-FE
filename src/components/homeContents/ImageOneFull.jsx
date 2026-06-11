import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, ArticleItem, Section } from "../StyledComponents";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FeaturedTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  color: #1a1a1a;
  margin-bottom: 8px;
  transition: color 0.2s;
`;

const FeaturedSubtitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #6b6b6b;
  line-height: 1.5;
`;

const FeaturedLink = styled(Link)`
  display: block;
  &:hover ${FeaturedTitle} {
    color: #3e5977;
  }
`;

const CardImageBox = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.35s ease;
  }
  &:hover img {
    transform: scale(1.03);
  }
  @media (max-width: 600px) {
    height: 200px;
  }
`;

const ImageOneFull = ({ sectionId, sectionName, article }) => {
  return (
    <Container>
      <ArticleItem>
        <Link to={"/section/" + sectionId + "?page=1"}>
          <Section>{sectionName}</Section>
        </Link>
        <Grid>
          <TextBlock>
            <FeaturedLink to={"/article/" + article.articleId}>
              <FeaturedTitle>{article.title}</FeaturedTitle>
              <FeaturedSubtitle>{article.subtitle}</FeaturedSubtitle>
            </FeaturedLink>
          </TextBlock>
          <Link to={"/article/" + article.articleId}>
            <CardImageBox>
              <img src={"https://api.thegachonherald.com/image?path=" + article.mainImage} alt={article.title} />
            </CardImageBox>
          </Link>
        </Grid>
      </ArticleItem>
    </Container>
  );
};

export default ImageOneFull;
