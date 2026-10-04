import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Container, Content } from "./StyledComponents";
import { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import PageHeading from "./PageHeading";

const ArticleItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 28px;
  align-items: center;
  padding: 22px 0;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const TextBlock = styled.div`
  min-width: 0;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #9b9b9b;
`;

const MetaDot = styled.span`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: #c4c4c4;
`;

const ArticleTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  color: #1a1a1a;
  margin-bottom: 6px;
  transition: color 0.15s;
  &:hover {
    color: #3e5977;
  }
`;

const ArticleSubtitle = styled.div`
  font-size: 14px;
  color: #6b6b6b;
  line-height: 1.5;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArticleReporter = styled.span`
  color: #9b9b9b;
  transition: color 0.15s;
  &:hover {
    color: #3e5977;
  }
`;

const ImageBox = styled.div`
  width: 168px;
  height: 112px;
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

const EmptyState = styled.div`
  padding: 80px 0;
  text-align: center;
  font-size: 14px;
  color: #9b9b9b;
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
  min-width: 28px;
  height: 28px;
  padding: 0 4px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: ${({ $on }) => ($on ? 600 : 400)};
  color: ${({ $on }) => ($on ? "#3e5977" : "#9b9b9b")};
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: ${({ $on }) => ($on ? "#3e5977" : "#1a1a1a")};
  }
`;

const ArticleList = () => {
  const { sectionId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get("page");
  const [pageNumbers, setPageNumbers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [sectionName, setSectionName] = useState("");
  const [sectionDesc, setSectionDesc] = useState("");
  const [loaded, setLoaded] = useState(false);

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
        setSectionDesc(res2.data.data.description || "");
      } catch (error) {
        console.error("오류 발생:", error);
      } finally {
        setLoaded(true);
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
        <PageHeading title={sectionName} description={sectionDesc} />

        {loaded && articles.length === 0 && (
          <EmptyState>No articles yet.</EmptyState>
        )}

        {articles.map((article) => (
          <ArticleItem key={article.articleId}>
            <TextBlock>
              <Link to={"/article/" + article.articleId}>
                <ArticleTitle>{article.title}</ArticleTitle>
              </Link>
              <ArticleSubtitle>{article.subtitle}</ArticleSubtitle>
              <Meta>
                <Link to={"/reporter/" + article.reporterId}>
                  <ArticleReporter>By {article.reporterName}</ArticleReporter>
                </Link>
                <MetaDot />
                <span>{article.publishedAt.slice(0, 10).replaceAll("-", ".")}</span>
              </Meta>
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
