import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

const Container = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 20px 80px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #3e5977;
`;

const PageTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
`;

const NewArticleBtn = styled(Link)`
  padding: 9px 20px;
  background: #3e5977;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
  transition: background 0.15s;
  &:hover { background: #2e4666; }
`;

const EmptyState = styled.div`
  padding: 48px 0;
  text-align: center;
  color: #9b9b9b;
  font-size: 14px;
`;

const ArticleList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ArticleItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.1s;

  &:hover .title {
    color: #3e5977;
  }
`;

const STATUS_COLOR = {
  EDITING: { bg: '#fff8e6', text: '#b07d00' },
  PENDING: { bg: '#e8f0f8', text: '#2e5a8a' },
  APPROVED: { bg: '#eaf6ec', text: '#2a7a3a' },
  REJECTED: { bg: '#fdecea', text: '#c0392b' },
};

const StatusBadge = styled.div`
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: ${({ $s }) => (STATUS_COLOR[$s] || STATUS_COLOR.EDITING).bg};
  color: ${({ $s }) => (STATUS_COLOR[$s] || STATUS_COLOR.EDITING).text};
`;

const ArticleTitle = styled.div`
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  transition: color 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SectionName = styled.div`
  flex-shrink: 0;
  font-size: 12px;
  color: #9b9b9b;
`;

const Divider = styled.div`
  margin: 36px 0 24px;
  border-top: 1px solid #e8e8e8;
`;

const AdminTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3e5977;
  margin-bottom: 12px;
`;

const AdminLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AdminLink = styled(Link)`
  padding: 11px 16px;
  font-size: 14px;
  color: #444444;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: #3e5977; color: #3e5977; }
`;

const WorkSpaceContent = () => {
  const [cookie] = useCookies();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/editing", {
          headers: { Authorization: `Bearer ${cookie.accessToken}` },
        });
        setArticles(res.data.data.articles);
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Header>
        <PageTitle>Workspace</PageTitle>
        <NewArticleBtn to="/edit">+ 새 기사 작성</NewArticleBtn>
      </Header>

      <ArticleList>
        {articles.length === 0 ? (
          <EmptyState>작성 중인 기사가 없습니다.</EmptyState>
        ) : (
          articles.map((article) => (
            <ArticleItem key={article.articleId} to={"/edit/" + article.articleId}>
              <StatusBadge $s={article.status}>{article.status}</StatusBadge>
              <ArticleTitle className="title">{article.title || "(제목 없음)"}</ArticleTitle>
              <SectionName>{article.sectionName}</SectionName>
            </ArticleItem>
          ))
        )}
      </ArticleList>

      {cookie.roles === 'ADMIN' && (
        <>
          <Divider />
          <AdminTitle>Admin</AdminTitle>
          <AdminLinks>
            <AdminLink to="/publish">발간 관리</AdminLink>
            <AdminLink to="/manage/user?page=1">유저 관리</AdminLink>
          </AdminLinks>
        </>
      )}
    </Container>
  );
};

export default WorkSpaceContent;
