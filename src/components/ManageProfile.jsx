import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import styled from "styled-components";
import { Container, Content } from "./StyledComponents";
import { useState, useEffect } from 'react';
import axios from "axios";

/* ─── Reporter header ─── */
const ReporterHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 0;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 32px;
  flex-wrap: wrap;
`;

const ReporterInfo = styled.div``;

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

const EditProfileBtn = styled.button`
  flex-shrink: 0;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #3e5977;
  background: #ffffff;
  border: 1px solid #3e5977;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #f0f4f8; }
`;

/* ─── Section block ─── */
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

/* ─── About info ─── */
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

/* ─── Article list ─── */
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
  &:hover { color: #3e5977; }
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
  &:hover img { transform: scale(1.04); }

  @media (max-width: 600px) {
    width: 100%;
    height: 180px;
  }
`;

/* ─── Pagination ─── */
const Pages = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
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
  color: ${({ $on }) => ($on ? '#ffffff' : '#555555')};
  background: ${({ $on }) => ($on ? '#3e5977' : 'transparent')};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ $on }) => ($on ? '#3e5977' : '#f0f0f0')};
    color: ${({ $on }) => ($on ? '#ffffff' : '#3e5977')};
  }
`;

const EmptyState = styled.div`
  padding: 32px 0;
  text-align: center;
  color: #9b9b9b;
  font-size: 14px;
`;

/* ─── Edit Modal ─── */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
`;

const ModalField = styled.div`
  margin-bottom: 14px;
`;

const ModalLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3e5977;
  margin-bottom: 6px;
`;

const ModalInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  outline: none;
  color: #1a1a1a;
  transition: border-color 0.15s;
  &:focus { border-color: #3e5977; }
  &::placeholder { color: #b8b8b8; }
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  outline: none;
  color: #1a1a1a;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s;
  &:focus { border-color: #3e5977; }
  &::placeholder { color: #b8b8b8; }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 24px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 11px;
  font-size: 14px;
  font-weight: 600;
  color: #555555;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #ebebeb; }
`;

const SaveBtn = styled.button`
  flex: 1;
  padding: 11px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: #3e5977;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #2e4666; }
`;

/* ─────────────────────────────── */

const ManageProfile = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies();
  const [page, setPage] = useState(0);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [reporter, setReporter] = useState({});
  const [articles, setArticles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFields, setEditFields] = useState({ nickname: '', intro: '', email: '', major: '' });

  const fetchData = async () => {
    try {
      const [r1, r2] = await Promise.all([
        axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/reporter/" + cookie.id + "?pageNumber=" + page),
        axios.get(process.env.REACT_APP_BACK_URL + "/account/" + cookie.id),
      ]);
      setArticles(r1.data.data.articles);
      setPageNumbers(Array.from({ length: r1.data.data.pageCount }, (_, i) => i + 1));
      setReporter(r2.data.data);
      setEditFields({
        nickname: r2.data.data.nickname || '',
        intro: r2.data.data.intro || '',
        email: r2.data.data.email || '',
        major: r2.data.data.major || '',
      });
    } catch (e) {
      navigate("/");
      console.error(e);
    }
  };

  useEffect(() => { fetchData(); }, [page]);

  const handleSave = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACK_URL}/account/reporter/profile`, editFields, {
        headers: { Authorization: `Bearer ${cookie.accessToken}` },
      });
      await fetchData();
      setIsEditing(false);
    } catch (e) {
      navigate("/");
      console.error(e);
    }
  };

  return (
    <Container>
      <Content>
        {/* Header */}
        <ReporterHeader>
          <ReporterInfo>
            <ReporterName>{reporter.nickname}</ReporterName>
            {reporter.intro && <ReporterIntro>{reporter.intro}</ReporterIntro>}
          </ReporterInfo>
          <EditProfileBtn onClick={() => setIsEditing(true)}>프로필 수정</EditProfileBtn>
        </ReporterHeader>

        {/* About */}
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

        {/* Latest Articles */}
        <Block>
          <PageTitle>Latest Articles</PageTitle>

          {articles.length === 0 ? (
            <EmptyState>발행된 기사가 없습니다.</EmptyState>
          ) : (
            articles.map(article => (
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
                        src={process.env.REACT_APP_BACK_URL + "/image?path=" + article.mainImage}
                        alt={article.title}
                      />
                    </ImageBox>
                  </Link>
                )}
              </ArticleItem>
            ))
          )}

          {pageNumbers.length > 1 && (
            <Pages>
              {pageNumbers.map(number => (
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

        {/* Edit Modal */}
        {isEditing && (
          <ModalOverlay onClick={e => e.target === e.currentTarget && setIsEditing(false)}>
            <ModalCard>
              <ModalTitle>프로필 수정</ModalTitle>

              <ModalField>
                <ModalLabel>영문 이름</ModalLabel>
                <ModalInput
                  placeholder="English Name"
                  value={editFields.nickname}
                  onChange={e => setEditFields({ ...editFields, nickname: e.target.value })}
                />
              </ModalField>

              <ModalField>
                <ModalLabel>소개</ModalLabel>
                <ModalTextarea
                  placeholder="한 줄 소개"
                  value={editFields.intro}
                  onChange={e => setEditFields({ ...editFields, intro: e.target.value })}
                />
              </ModalField>

              <ModalField>
                <ModalLabel>이메일</ModalLabel>
                <ModalInput
                  placeholder="Email"
                  value={editFields.email}
                  onChange={e => setEditFields({ ...editFields, email: e.target.value })}
                />
              </ModalField>

              <ModalField>
                <ModalLabel>전공</ModalLabel>
                <ModalInput
                  placeholder="Major"
                  value={editFields.major}
                  onChange={e => setEditFields({ ...editFields, major: e.target.value })}
                />
              </ModalField>

              <ModalActions>
                <CancelBtn onClick={() => setIsEditing(false)}>취소</CancelBtn>
                <SaveBtn onClick={handleSave}>저장</SaveBtn>
              </ModalActions>
            </ModalCard>
          </ModalOverlay>
        )}
      </Content>
    </Container>
  );
};

export default ManageProfile;
