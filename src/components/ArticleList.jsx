import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Container, Content } from "./StyledComponents";
import { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";

const SectionTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  padding-bottom: 14px;
  margin-bottom: 28px;
  border-bottom: 2px solid #3e5977;
`;

const ArticleItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: start;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TextBlock = styled.div``;

const ArticleDate = styled.div`
  font-size: 12px;
  color: #9b9b9b;
  margin-bottom: 6px;
`;

const ArticleTitle = styled.div`
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
  margin-bottom: 6px;
  transition: color 0.15s;
  &:hover {
    color: #3e5977;
  }
`;

const ArticleSubtitle = styled.div`
  font-size: 13px;
  color: #6b6b6b;
  line-height: 1.4;
  margin-bottom: 8px;
`;

const ArticleReporter = styled.div`
  font-size: 12px;
  color: #9b9b9b;
  transition: color 0.15s;
  &:hover {
    color: #3e5977;
  }
`;

const ImageBox = styled.div`
  width: 140px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  background: #f0f0f0;
  flex-shrink: 0;
  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }
  &:hover img {
    transform: scale(1.04);
  }

  @media (max-width: 600px) {
    width: 100%;
    height: 200px;
  }
`;

const Pages = styled.div`
  margin-top: 48px;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const PageNumber = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-size: 13px;
  font-weight: ${({ $on }) => ($on ? 700 : 400)};
  color: ${({ $on }) => ($on ? "#ffffff" : "#555555")};
  background: ${({ $on }) => ($on ? "#3e5977" : "transparent")};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ $on }) => ($on ? "#3e5977" : "#f0f0f0")};
    color: ${({ $on }) => ($on ? "#ffffff" : "#3e5977")};
  }
`;

const ArticleList = () => {
  const { sectionId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");
  const [pageNumbers, setPageNumbers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [sectionName, setSectionName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(
            process.env.REACT_APP_BACK_URL +
              "/articles/list/section/" +
              sectionId +
              "?pageNumber=" +
              (page - 1)
          ),
          axios.get(process.env.REACT_APP_BACK_URL + "/sections/" + sectionId),
        ]);
        setArticles(res1.data.data.articles);
        setPageNumbers(
          Array.from(
            { length: res1.data.data.pageCount },
            (_, i) => i + 1
          )
        );
        setSectionName(res2.data.data.name);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, [sectionId, page]);

  return (
    <Container>
      <Helmet>
        <title>{sectionName ? `${sectionName} | The Gachon Herald (가천헤럴드)` : "The Gachon Herald"}</title>
      </Helmet>
      <Content>
        <SectionTitle>{sectionName}</SectionTitle>

        {articles.map((article) => (
          <ArticleItem key={article.articleId}>
            <TextBlock>
              <ArticleDate>{article.publishedAt.slice(0, 10)}</ArticleDate>
              <Link to={"/article/" + article.articleId}>
                <ArticleTitle>{article.title}</ArticleTitle>
              </Link>
              <ArticleSubtitle>{article.subtitle}</ArticleSubtitle>
              <Link to={"/reporter/" + article.reporterId}>
                <ArticleReporter>By {article.reporterName}</ArticleReporter>
              </Link>
            </TextBlock>

            {article.mainImage && (
              <Link to={"/article/" + article.articleId}>
                <ImageBox>
                  <img
                    src={"https://api.thegachonherald.com/image?path=" + article.mainImage}
                    alt={article.title}
                  />
                </ImageBox>
              </Link>
            )}
          </ArticleItem>
        ))}

        <Pages>
          {pageNumbers.map((number) => (
            <Link to={"/section/" + sectionId + "?page=" + number} key={number}>
              <PageNumber $on={page == number}>{number}</PageNumber>
            </Link>
          ))}
        </Pages>
      </Content>
    </Container>
  );
};

export default ArticleList;
