import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Container, Content } from "./StyledComponents";
import { useState, useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";

/* ── Reporter header ── */
const ReporterHeader = styled.div`
  padding: 28px 0 28px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 32px;
`;

const ReporterName = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
`;

const ReporterIntro = styled.div`
  font-size: 14px;
  color: #6b6b6b;
  line-height: 1.6;
`;

/* ── Section block ── */
const Block = styled.div`
  margin-bottom: 44px;
`;

const PageTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 2px solid #3e5977;
`;

/* ── About info ── */
const InfoRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
`;

const InfoLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3e5977;
  min-width: 80px;
  flex-shrink: 0;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #444444;
`;

/* ── Article list ── */
const ArticleItem = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: start;
  padding: 18px 0;
  border-bottom: 1px solid #f0f0f0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TextBlock = styled.div``;

const ArticleDate = styled.div`
  font-size: 12px;
  color: #9b9b9b;
  margin-bottom: 5px;
`;

const ArticleTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
  margin-bottom: 5px;
  transition: color 0.15s;
  &:hover {
    color: #3e5977;
  }
`;

const ArticleSubtitle = styled.div`
  font-size: 13px;
  color: #6b6b6b;
  line-height: 1.4;
`;

const ImageBox = styled.div`
  width: 130px;
  height: 90px;
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
    height: 180px;
  }
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

const Profile = () => {
  const { reporterId } = useParams();
  const [reporter, setReporter] = useState({});
  const [page, setPage] = useState(0);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [articles, setArticles] = useState([]);

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
          {reporter.intro && <ReporterIntro>{reporter.intro}</ReporterIntro>}
        </ReporterHeader>

        {(reporter.position || reporter.major || reporter.email) && (
          <Block>
            <PageTitle>About</PageTitle>
            {reporter.position && (
              <InfoRow>
                <InfoLabel>Position</InfoLabel>
                <InfoValue>{reporter.position}</InfoValue>
              </InfoRow>
            )}
            {reporter.major && (
              <InfoRow>
                <InfoLabel>Major</InfoLabel>
                <InfoValue>{reporter.major}</InfoValue>
              </InfoRow>
            )}
            {reporter.email && (
              <InfoRow>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{reporter.email}</InfoValue>
              </InfoRow>
            )}
          </Block>
        )}

        <Block>
          <PageTitle>Latest Articles</PageTitle>

          {articles.map((article) => (
            <ArticleItem key={article.articleId}>
              <TextBlock>
                <ArticleDate>{article.publishedAt.slice(0, 10)}</ArticleDate>
                <Link to={"/article/" + article.articleId}>
                  <ArticleTitle>{article.title}</ArticleTitle>
                </Link>
                <ArticleSubtitle>{article.subtitle}</ArticleSubtitle>
              </TextBlock>

              {article.mainImage && (
                <Link to={"/article/" + article.articleId}>
                  <ImageBox>
                    <img
                      src={
                        process.env.REACT_APP_BACK_URL +
                        "/image?path=" +
                        article.mainImage
                      }
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
