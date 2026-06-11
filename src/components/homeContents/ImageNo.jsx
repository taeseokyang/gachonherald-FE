import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, ArticleItem, Section } from "../StyledComponents";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0 20px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TextItem = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
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

const ImageNo = ({ sectionId, sectionName, articles }) => {
  return (
    <Container>
      <ArticleItem>
        <Link to={"/section/" + sectionId + "?page=1"}>
          <Section>{sectionName}</Section>
        </Link>
        <Grid>
          {articles.map((article, index) => (
            <TextItem key={index}>
              <TextLink to={"/article/" + article.articleId}>
                <TextTitle>{article.title}</TextTitle>
                <TextSubtitle>{article.subtitle}</TextSubtitle>
              </TextLink>
            </TextItem>
          ))}
        </Grid>
      </ArticleItem>
    </Container>
  );
};

export default ImageNo;
