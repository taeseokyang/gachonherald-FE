import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px 80px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #3e5977;
  flex-wrap: wrap;
  gap: 12px;
`;

const PageTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
`;

const Count = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #9b9b9b;
  margin-left: 8px;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const OutlineBtn = styled(Link)`
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #3e5977;
  border: 1px solid #3e5977;
  border-radius: 6px;
  transition: background 0.15s;
  &:hover { background: #f0f4f8; }
`;

const PublishBtn = styled.button`
  padding: 9px 22px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  background: #3e5977;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #2e4666; }
`;

const EmptyState = styled.div`
  padding: 48px 0;
  text-align: center;
  color: #9b9b9b;
  font-size: 14px;
`;

/* ─── Table ─── */
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 96px 36px;
  gap: 12px;
  padding: 8px 12px;
  background: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 4px;
`;

const ColLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9b9b9b;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 96px 36px;
  gap: 12px;
  padding: 14px 12px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;

  &:hover { background: #fafafa; }
`;

const STATUS_COLOR = {
  PENDING: { bg: '#e8f0f8', text: '#2e5a8a' },
  APPROVED: { bg: '#eaf6ec', text: '#2a7a3a' },
  EDITING: { bg: '#fff8e6', text: '#b07d00' },
};

const StatusBadge = styled.div`
  display: inline-block;
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  background: ${({ $s }) => (STATUS_COLOR[$s] || STATUS_COLOR.EDITING).bg};
  color: ${({ $s }) => (STATUS_COLOR[$s] || STATUS_COLOR.EDITING).text};
`;

const ArticleTitleLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  transition: color 0.15s;
  &:hover { color: #3e5977; }
`;

const MetaText = styled.div`
  font-size: 12px;
  color: #9b9b9b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StarBtn = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: ${({ $on }) => ($on ? '#f5a623' : '#d8d8d8')};
  transition: color 0.15s, transform 0.1s;
  padding: 0;
  &:hover { color: ${({ $on }) => ($on ? '#e8951a' : '#aaaaaa')}; transform: scale(1.15); }
`;

const PublishManageContent = () => {
  const [cookie] = useCookies();
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/ready", {
      headers: { Authorization: `Bearer ${cookie.accessToken}` },
    })
      .then(r => setArticles(r.data.data.articles))
      .catch(console.error);
  }, [cookie.accessToken]);

  const toggleEditorsPick = async (articleId) => {
    try {
      const r = await axios.patch(
        process.env.REACT_APP_BACK_URL + "/articles/editor-pick/" + articleId,
        {},
        { headers: { Authorization: `Bearer ${cookie.accessToken}` } }
      );
      if (r.status === 200) {
        setArticles(prev => prev.map(a =>
          a.articleId === articleId ? { ...a, isEditorsPick: r.data.data.isEditorsPick } : a
        ));
      }
    } catch (e) { console.error(e); }
  };

  const publish = async () => {
    if (!window.confirm("현재 발간되어 있는 기사들이 현재 승인된 기사들로 대체됩니다.\n최소 한 개의 기사를 에디터 픽으로 설정해주세요.\n정말 발간하시겠습니까?")) return;
    try {
      const r = await axios.patch(
        process.env.REACT_APP_BACK_URL + "/articles/publish",
        {},
        { headers: { Authorization: `Bearer ${cookie.accessToken}` } }
      );
      if (r.status === 200) navigate("/");
    } catch (e) { console.error(e); }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <Container>
      <Header>
        <PageTitle>발간 관리<Count>{articles.length}건</Count></PageTitle>
        <ActionGroup>
          <OutlineBtn to="/publish/article?page=1">발간 수정</OutlineBtn>
          <PublishBtn onClick={publish}>발간하기</PublishBtn>
        </ActionGroup>
      </Header>

      {articles.length === 0 ? (
        <EmptyState>승인된 기사가 없습니다.</EmptyState>
      ) : (
        <>
          <TableHeader>
            <ColLabel>상태</ColLabel>
            <ColLabel>제목</ColLabel>
            <ColLabel>기자</ColLabel>
            <ColLabel>섹션</ColLabel>
            <ColLabel>날짜</ColLabel>
            <ColLabel>EP</ColLabel>
          </TableHeader>

          {articles.map(article => (
            <Row key={article.articleId}>
              <StatusBadge $s={article.status}>{article.status}</StatusBadge>
              <ArticleTitleLink to={"/check/" + article.articleId}>
                {article.title}
              </ArticleTitleLink>
              <MetaText>{article.reporterName}</MetaText>
              <MetaText>{article.sectionName}</MetaText>
              <MetaText>{formatDate(article.publishedAt)}</MetaText>
              <StarBtn
                $on={article.isEditorsPick}
                onClick={() => toggleEditorsPick(article.articleId)}
                title="Editor's Pick"
              >
                ★
              </StarBtn>
            </Row>
          ))}
        </>
      )}
    </Container>
  );
};

export default PublishManageContent;
