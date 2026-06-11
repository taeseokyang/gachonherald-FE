import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, ArticleItem, Section } from "../StyledComponents";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const CardImageBox = styled.div`
  width: 100%;
  height: 220px;
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
    height: 200px;
  }
`;

const Card = styled.div`
  &:hover ${CardImageBox} img {
    transform: scale(1.04);
  }
`;

const CardTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
  margin-bottom: 5px;
`;

const CardSubtitle = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #6b6b6b;
  line-height: 1.4;
`;

const TextList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const TextItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  &:first-child {
    padding-top: 0;
    border-top: none;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const TextTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
  margin-bottom: 3px;
  transition: color 0.2s;
`;

const TextSubtitle = styled.div`
  font-size: 12px;
  color: #6b6b6b;
  line-height: 1.4;
`;

const TextLink = styled(Link)`
  display: block;
  &:hover ${TextTitle} {
    color: #3e5977;
  }
`;

const ImageOne = ({ sectionId, sectionName, imageArticles, articles }) => {
  return (
    <Container>
      <ArticleItem>
        <Link to={"/section/" + sectionId + "?page=1"}>
          <Section>{sectionName}</Section>
        </Link>
        <Grid>
          <Card>
            <Link to={"/article/" + imageArticles[0].articleId}>
              <CardImageBox>
                <img src={"https://api.thegachonherald.com/image?path=" + imageArticles[0].mainImage} alt={imageArticles[0].title} />
              </CardImageBox>
              <CardTitle>{imageArticles[0].title}</CardTitle>
              <CardSubtitle>{imageArticles[0].subtitle}</CardSubtitle>
            </Link>
          </Card>
          <TextList>
            {articles.slice(0, 4).map((article, index) => (
              <TextItem key={index}>
                <TextLink to={"/article/" + article.articleId}>
                  <TextTitle>{article.title}</TextTitle>
                  <TextSubtitle>{article.subtitle}</TextSubtitle>
                </TextLink>
              </TextItem>
            ))}
          </TextList>
        </Grid>
      </ArticleItem>
    </Container>
  );
};

export default ImageOne;
