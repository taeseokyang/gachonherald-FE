import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, ArticleItem, Section } from "../StyledComponents";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, 1fr);
  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Cell = styled.div`
  padding: 0 20px;
  border-right: 1px solid #e8e8e8;
  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    border-right: none;
    padding-right: 0;
  }
  @media (max-width: 600px) {
    padding: 0 10px;
    &:nth-child(odd) {
      padding-left: 0;
    }
    &:nth-child(even) {
      border-right: none;
      padding-right: 0;
    }
  }
`;

const CardImageBox = styled.div`
  width: 100%;
  height: 150px;
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
  &:hover img {
    transform: scale(1.04);
  }
  @media (max-width: 600px) {
    height: 120px;
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
  color: #6b6b6b;
  line-height: 1.4;
`;

const MainLink = styled(Link)`
  display: block;
  &:hover ${CardTitle} {
    color: #3e5977;
  }
`;

const ExtraItem = styled.div`
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
`;

const ExtraSubtitle = styled.div`
  font-size: 12px;
  color: #6b6b6b;
  line-height: 1.4;
  margin-top: 2px;
`;

const ExtraTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.3;
  transition: color 0.2s;
`;

const ExtraLink = styled(Link)`
  display: block;
  &:hover ${ExtraTitle} {
    color: #3e5977;
  }
`;

const SectionGroup = ({ sections }) => {
  return (
    <Container>
      <ArticleItem>
        <Grid $count={sections.length}>
          {sections.map((section, idx) => {
            const hasImage = section.imageArticles.length > 0;
            const mainArticle = hasImage
              ? section.imageArticles[0]
              : section.articles[0];
            const extraArticles = hasImage
              ? section.articles.slice(0, 1)
              : section.articles.slice(1, 3);

            if (!mainArticle) return null;

            return (
              <Cell key={idx}>
                <Link to={"/section/" + section.sectionId + "?page=1"}>
                  <Section>{section.sectionName}</Section>
                </Link>
                <MainLink to={"/article/" + mainArticle.articleId}>
                  {hasImage && (
                    <CardImageBox>
                      <img
                        src={"https://api.thegachonherald.com/image?path=" + mainArticle.mainImage}
                        alt={mainArticle.title}
                      />
                    </CardImageBox>
                  )}
                  <CardTitle>{mainArticle.title}</CardTitle>
                  <CardSubtitle>{mainArticle.subtitle}</CardSubtitle>
                </MainLink>
                {extraArticles.map((article, i) => (
                  <ExtraItem key={i}>
                    <ExtraLink to={"/article/" + article.articleId}>
                      <ExtraTitle>{article.title}</ExtraTitle>
                      {article.subtitle && <ExtraSubtitle>{article.subtitle}</ExtraSubtitle>}
                    </ExtraLink>
                  </ExtraItem>
                ))}
              </Cell>
            );
          })}
        </Grid>
      </ArticleItem>
    </Container>
  );
};

export default SectionGroup;
