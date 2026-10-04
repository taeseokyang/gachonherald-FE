import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Container, Content } from "./StyledComponents";
import { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";

/* ── Reporter header ── */
const ReporterHeader = styled.div`
  padding: 8px 0 0;
  margin-bottom: 28px;
`;

const ReporterName = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #1a1a1a;

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const ReporterPosition = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #9b9b9b;
`;

const ReporterIntro = styled.p`
  margin: 14px 0 0;
  max-width: 680px;
  font-size: 14px;
  color: #555555;
  line-height: 1.7;
`;

/* ── About info ── */
const InfoList = styled.div`
  margin-bottom: 44px;
`;

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #ececec;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 2px;
  }
`;

const InfoLabel = styled.div`
  font-size: 13px;
  color: #9b9b9b;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #1a1a1a;
  word-break: break-all;

  & a:hover {
    color: #3e5977;
  }
`;

/* ── Article list ── */
const Block = styled.div`
  margin-bottom: 44px;
`;

const BlockTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
  padding-bottom: 4px;
`;

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
  padding: 60px 0;
  text-align: center;
  font-size: 14px;
  color: #9b9b9b;
`;

/* ── Pagination ── */
const Pages = styled.div`
  margin-top: 40px;
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

const Profile = () => {
  const { reporterId } = useParams();
  const [reporter, setReporter] = useState({});
  const [page, setPage] = useState(0);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(
            process.env.REACT_APP_BACK_URL +
              "/articles/list/reporter/" +
              reporterId +
              "?pageNumber=" +
              page
          ),
          axios.get(process.env.REACT_APP_BACK_URL + "/account/" + reporterId),
        ]);
        setArticles(res1.data.data.articles);
        setPageNumbers(
          Array.from({ length: res1.data.data.pageCount }, (_, i) => i + 1)
        );
        setReporter(res2.data.data);
      } catch (error) {
        console.error("오류 발생:", error);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, [reporterId, page]);

  return (
    <Container>
      <Helmet>
        <title>{reporter.nickname ? `${reporter.nickname} | The Gachon Herald (가천헤럴드)` : "The Gachon Herald"}</title>
      </Helmet>
      <Content>
        <ReporterHeader>
          <ReporterName>{reporter.nickname}</ReporterName>
          {reporter.position && <ReporterPosition>{reporter.position}</ReporterPosition>}
          {reporter.intro && <ReporterIntro>{reporter.intro}</ReporterIntro>}
        </ReporterHeader>

        {(reporter.major || reporter.email) && (
          <InfoList>
            {reporter.major && (
              <InfoRow>
                <InfoLabel>Major</InfoLabel>
                <InfoValue>{reporter.major}</InfoValue>
              </InfoRow>
            )}
            {reporter.email && (
              <InfoRow>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>
                  <a href={"mailto:" + reporter.email}>{reporter.email}</a>
                </InfoValue>
              </InfoRow>
            )}
          </InfoList>
        )}

        <Block>
          <BlockTitle>Articles</BlockTitle>

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
                  {article.sectionName && (
                    <>
                      <span>{article.sectionName}</span>
                      <MetaDot />
                    </>
                  )}
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

          {pageNumbers.length > 1 && (
            <Pages>
              {pageNumbers.map((number) => (
                <PageNumber
                  key={number}
                  $on={page + 1 === number}
                  onClick={() => setPage(number - 1)}
                >
                  {number}
                </PageNumber>
              ))}
            </Pages>
          )}
        </Block>
      </Content>
    </Container>
  );
};

export default Profile;
