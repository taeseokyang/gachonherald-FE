import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

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
`;

const PageTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
`;

/* ─── Table ─── */
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 110px 1fr 100px 100px 96px 36px;
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
  grid-template-columns: 110px 1fr 100px 100px 96px 36px;
  gap: 12px;
  padding: 12px 12px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;

  &:hover { background: #fafafa; }
`;

const StatusSelect = styled.select`
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  background: ${({ $published }) => ($published ? '#3e5977' : '#ffffff')};
  color: ${({ $published }) => ($published ? '#ffffff' : '#555555')};
  transition: background 0.15s;
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
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 13px;
  font-weight: ${({ $on }) => ($on ? 700 : 400)};
  color: ${({ $on }) => ($on ? '#ffffff' : '#555555')};
  background: ${({ $on }) => ($on ? '#3e5977' : 'transparent')};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover { background: ${({ $on }) => ($on ? '#3e5977' : '#f0f0f0')}; color: ${({ $on }) => ($on ? '#ffffff' : '#3e5977')}; }
`;

const statusOptions = ['PUBLISHED', 'ARCHIVED'];

const PublishArticleManageContent = () => {
  const [cookie] = useCookies();
  const [articles, setArticles] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page');

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/all?pageNumber=" + (page - 1))
      .then(r => {
        setArticles(r.data.data.articles);
        setPageNumbers(Array.from({ length: r.data.data.pageCount }, (_, i) => i + 1));
      })
      .catch(console.error);
  }, [page]);

  const handleStatusChange = async (articleId, newStatus) => {
    try {
      const r = await axios.patch(
        process.env.REACT_APP_BACK_URL + "/articles/status/" + articleId + "?status=" + newStatus,
        {},
        { headers: { Authorization: `Bearer ${cookie.accessToken}` } }
      );
      if (r.status === 200) {
        setArticles(prev => prev.map(a => a.articleId === articleId ? { ...a, status: newStatus } : a));
      }
    } catch (e) { console.error(e); }
  };

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

  return (
    <Container>
      <Header>
        <PageTitle>기사 관리</PageTitle>
      </Header>

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
          <StatusSelect
            $published={article.status === 'PUBLISHED'}
            value={article.status}
            onChange={e => handleStatusChange(article.articleId, e.target.value)}
          >
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </StatusSelect>

          <ArticleTitleLink to={"/edit/" + article.articleId}>
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

      {pageNumbers.length > 1 && (
        <Pages>
          {pageNumbers.map(number => (
            <Link to={"/publish/article?page=" + number} key={number}>
              <PageNumber $on={page == number}>{number}</PageNumber>
            </Link>
          ))}
        </Pages>
      )}
    </Container>
  );
};

export default PublishArticleManageContent;
