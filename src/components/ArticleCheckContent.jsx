import axios from 'axios';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { useParams, useNavigate, Link } from "react-router-dom";

const Page = styled.div`
  max-width: 740px;
  margin: 0 auto;
  padding: 32px 20px 80px;
`;

/* ─── Review bar ─── */
const ReviewBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #f8f9fb;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const ReviewLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9b9b9b;
`;

const STATUS_COLOR = {
  PENDING:  { bg: '#e8f0f8', text: '#2e5a8a' },
  APPROVED: { bg: '#eaf6ec', text: '#2a7a3a' },
  EDITING:  { bg: '#fff8e6', text: '#b07d00' },
  REJECTED: { bg: '#fdecea', text: '#c0392b' },
};

const StatusBadge = styled.div`
  padding: 4px 11px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $s }) => (STATUS_COLOR[$s] || STATUS_COLOR.EDITING).bg};
  color: ${({ $s }) => (STATUS_COLOR[$s] || STATUS_COLOR.EDITING).text};
`;

const Spacer = styled.div`flex: 1;`;

const ApproveBtn = styled.button`
  padding: 9px 22px;
  background: #3e5977;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #2e4666; }
`;

const DenyBtn = styled.button`
  padding: 9px 18px;
  background: #ffffff;
  color: #d0453a;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #e8c4c4;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #fdecea; }
`;

/* ─── Article view ─── */
const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3e5977;
  margin-bottom: 10px;
`;

const ArticleTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.25;
  margin: 0 0 8px;
`;

const ArticleSubtitle = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: #6b6b6b;
  line-height: 1.4;
  margin-bottom: 20px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 32px;
`;

const ReporterName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #555555;
`;

const DateText = styled.div`
  font-size: 12px;
  color: #9b9b9b;
`;

const ArticleBody = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: #1a1a1a;
  white-space: pre-line;

  & img {
    display: block;
    margin: 24px auto 8px;
    width: 100%;
    max-height: 600px;
    object-fit: contain;
    border-radius: 4px;
  }

  & h1, & h2, & h3 {
    margin: 28px 0 8px;
    line-height: 1.3;
  }
`;

/* ─── Bottom action bar ─── */
const BottomBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
`;

const BackLink = styled(Link)`
  padding: 9px 18px;
  font-size: 13px;
  color: #9b9b9b;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  transition: color 0.15s, border-color 0.15s;
  &:hover { color: #1a1a1a; border-color: #c0c0c0; }
`;

const ArticleCheckContent = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [sections, setSections] = useState([]);
  const [articleStatus, setArticleStatus] = useState('');
  const [publishedAt, setPublishedAt] = useState('');
  const [cookie] = useCookies();
  const navigate = useNavigate();
  const { articleId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(process.env.REACT_APP_BACK_URL + "/articles/reporter/" + articleId, {
      headers: { Authorization: `Bearer ${cookie.accessToken}` },
    })
      .then(r => {
        const d = r.data.data;
        setTitle(d.title);
        setSubtitle(d.subtitle);
        setReporterName(d.reporterName);
        setSectionId(d.sectionId);
        setContent(d.content);
        setPublishedAt(d.publishedAt);
        setArticleStatus(d.status);
      })
      .catch(console.error);
  }, [articleId]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACK_URL + "/sections/list")
      .then(r => setSections(r.data.data.activeSections))
      .catch(console.error);
  }, []);

  const getSectionName = (id) => (sections.find(s => s.sectionId == id) || {}).name || '';

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleApprove = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACK_URL}/articles/approve/${articleId}`, {}, {
        headers: { Authorization: `Bearer ${cookie.accessToken}` },
      });
      navigate("/publish");
    } catch (e) { console.error(e); }
  };

  const handleDeny = async () => {
    if (!window.confirm("이 기사를 거절하시겠습니까?")) return;
    try {
      await axios.patch(`${process.env.REACT_APP_BACK_URL}/articles/deny/${articleId}`, {}, {
        headers: { Authorization: `Bearer ${cookie.accessToken}` },
      });
      navigate("/publish");
    } catch (e) { console.error(e); }
  };

  return (
    <Page>
      <ReviewBar>
        <ReviewLabel>기사 검토</ReviewLabel>
        <StatusBadge $s={articleStatus}>{articleStatus}</StatusBadge>
        <Spacer />
        {articleStatus === 'PENDING' && (
          <>
            <DenyBtn onClick={handleDeny}>거절</DenyBtn>
            <ApproveBtn onClick={handleApprove}>승인</ApproveBtn>
          </>
        )}
      </ReviewBar>

      <SectionLabel>{getSectionName(sectionId)}</SectionLabel>
      <ArticleTitle>{title}</ArticleTitle>
      {subtitle && <ArticleSubtitle>{subtitle}</ArticleSubtitle>}

      <MetaRow>
        <ReporterName>By {reporterName}</ReporterName>
        <DateText>{formatDate(publishedAt)}</DateText>
      </MetaRow>

      <ArticleBody dangerouslySetInnerHTML={{ __html: content }} />

      <BottomBar>
        <BackLink to="/publish">목록으로</BackLink>
        {articleStatus === 'PENDING' && (
          <>
            <DenyBtn onClick={handleDeny}>거절</DenyBtn>
            <ApproveBtn onClick={handleApprove}>승인</ApproveBtn>
          </>
        )}
      </BottomBar>
    </Page>
  );
};

export default ArticleCheckContent;
