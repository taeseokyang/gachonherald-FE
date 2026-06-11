import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, ArticleItem, Section } from "../StyledComponents";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
`;

const CardImageBox = styled.div`
  width: 100%;
  height: 170px;
  border-radius: 4px;
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
    height: 130px;
  }
`;

const Card = styled.div`
  &:hover ${CardImageBox} img {
    transform: scale(1.04);
  }
`;

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const CardSubtitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #6b6b6b;
  line-height: 1.4;
`;

const ImageThree = ({ sectionId, sectionName, imageArticles }) => {
  return (
    <Container>
      <ArticleItem>
        <Link to={"/section/" + sectionId + "?page=1"}>
          <Section>{sectionName}</Section>
        </Link>
        <Grid>
          {imageArticles.map((article, index) => (
            <Card key={index}>
              <Link to={"/article/" + article.articleId}>
                <CardImageBox>
                  <img src={"https://api.thegachonherald.com/image?path=" + article.mainImage} alt={article.title} />
                </CardImageBox>
                <CardTitle>{article.title}</CardTitle>
                <CardSubtitle>{article.subtitle}</CardSubtitle>
              </Link>
            </Card>
          ))}
        </Grid>
      </ArticleItem>
    </Container>
  );
};

export default ImageThree;
