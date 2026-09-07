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

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
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

const ImageBadge = styled.span`
  flex-shrink: 0;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  white-space: nowrap;
  background: #eeeeee;
  color: #828282;
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
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
  font-size: 18px;
  color: ${({ $on }) => ($on ? '#f5a623' : '#d8d8d8')};
  transition: color 0.15s, transform 0.1s;
  padding: 0;
  &:hover { color: ${({ $on }) => ($on ? '#e8951a' : '#aaaaaa')}; transform: ${({ $disabled }) => ($disabled ? 'none' : 'scale(1.15)')}; }
`;

/* ─── Pagination ─── */
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

const Ellipsis = styled.div`
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bcbcbc;
  font-size: 13px;
`;

const Arrow = styled.div`
  width: 28px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: ${({ $disabled }) => ($disabled ? '#e0e0e0' : '#3e5977')};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
`;

const statusOptions = ['PUBLISHED', 'ARCHIVED'];

// 한 페이지에 보여줄 기사 수
const UI_PAGE_SIZE = 20;
const PAGE_WINDOW = 5;

const getVisiblePages = (current, total) => {
  if (total <= 0) return [];
  let start = Math.max(1, current - Math.floor(PAGE_WINDOW / 2));
  let end = Math.min(total, start + PAGE_WINDOW - 1);
  start = Math.max(1, end - PAGE_WINDOW + 1);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
};

const hasImageInArticle = (data) =>
  (data.mainImage !== undefined && data.mainImage !== null && data.mainImage !== "") ||
  /<img[\s>]/i.test(data.content || "");

const PublishArticleManageContent = () => {
  const [cookie] = useCookies();
  const [articles, setArticles] = useState([]);
  const [uiPageCount, setUiPageCount] = useState(0);
  // articleId -> true(이미지 있음)
  const [imageMap, setImageMap] = useState({});
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page');

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const base = process.env.REACT_APP_BACK_URL + "/articles/list/all?pageNumber=";
    const current = Number(page) || 1;
    const fetchData = async () => {
      try {
        // 백엔드 페이지 크기 / 전체 개수 파악
        const first = await axios.get(base + "0");
        const backendSize = first.data.data.articles.length;
        const backendCount = first.data.data.pageCount;
        if (backendSize === 0) {
          setArticles([]);
          setUiPageCount(0);
          return;
        }

        let lastLen = backendSize;
        if (backendCount > 1) {
          const last = await axios.get(base + (backendCount - 1));
          lastLen = last.data.data.articles.length;
        }
        const totalItems = backendSize * (backendCount - 1) + lastLen;
        setUiPageCount(Math.ceil(totalItems / UI_PAGE_SIZE));

        // 현재 UI 페이지에 필요한 백엔드 페이지들만 조회
        const startIdx = (current - 1) * UI_PAGE_SIZE;
        const endIdx = startIdx + UI_PAGE_SIZE; // exclusive
        const startBackend = Math.floor(startIdx / backendSize);
        const endBackend = Math.floor((endIdx - 1) / backendSize);

        const chunks = [];
        for (let p = startBackend; p <= endBackend && p < backendCount; p++) {
          if (p === 0) {
            chunks.push(first.data.data.articles);
          } else {
            const r = await axios.get(base + p);
            chunks.push(r.data.data.articles);
          }
        }
        const flat = chunks.flat();
        const offset = startIdx - startBackend * backendSize;
        setArticles(flat.slice(offset, offset + UI_PAGE_SIZE));
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, [page]);

  // 각 기사 본문을 확인해 이미지 포함 여부 판별
  useEffect(() => {
    if (articles.length === 0) return;
    let cancelled = false;
    const checkImages = async () => {
      const entries = await Promise.all(
        articles.map(async (article) => {
          try {
            const res = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/" + article.articleId);
            return [article.articleId, hasImageInArticle(res.data.data)];
          } catch (error) {
            return [article.articleId, null];
          }
        })
      );
      if (!cancelled) setImageMap(Object.fromEntries(entries));
    };
    checkImages();
    return () => { cancelled = true; };
  }, [articles]);

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
    // 이미지가 있는 기사만 메인 슬라이드(에디터 픽)로 선택 가능
    if (imageMap[articleId] !== true) return;
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

  const current = Number(page) || 1;
  const visible = getVisiblePages(current, uiPageCount);
  const pageHref = (n) => "/publish/article?page=" + n;

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

      {articles.map(article => {
        const hasImage = imageMap[article.articleId] === true;
        return (
          <Row key={article.articleId}>
            <StatusSelect
              $published={article.status === 'PUBLISHED'}
              value={article.status}
              onChange={e => handleStatusChange(article.articleId, e.target.value)}
            >
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </StatusSelect>

            <TitleCell>
              <ArticleTitleLink to={"/edit/" + article.articleId} title={article.title}>
                {article.title}
              </ArticleTitleLink>
              {hasImage && (
                <ImageBadge title="본문에 이미지가 포함된 기사입니다">이미지</ImageBadge>
              )}
            </TitleCell>

            <MetaText>{article.reporterName}</MetaText>
            <MetaText>{article.sectionName}</MetaText>
            <MetaText>{formatDate(article.publishedAt)}</MetaText>

            <StarBtn
              $on={article.isEditorsPick}
              $disabled={!hasImage}
              onClick={() => toggleEditorsPick(article.articleId)}
              title={hasImage
                ? "메인 슬라이드(에디터 픽) 노출 여부"
                : "이미지가 있는 기사만 메인 슬라이드로 선택할 수 있습니다"}
            >
              ★
            </StarBtn>
          </Row>
        );
      })}

      {uiPageCount > 1 && (
        <Pages>
          {current > 1 ? (
            <Link to={pageHref(current - 1)}><Arrow>‹</Arrow></Link>
          ) : (
            <Arrow $disabled>‹</Arrow>
          )}

          {visible[0] > 1 && (
            <>
              <Link to={pageHref(1)}><PageNumber $on={current === 1}>1</PageNumber></Link>
              {visible[0] > 2 && <Ellipsis>…</Ellipsis>}
            </>
          )}

          {visible.map(number => (
            <Link to={pageHref(number)} key={number}>
              <PageNumber $on={current === number}>{number}</PageNumber>
            </Link>
          ))}

          {visible[visible.length - 1] < uiPageCount && (
            <>
              {visible[visible.length - 1] < uiPageCount - 1 && <Ellipsis>…</Ellipsis>}
              <Link to={pageHref(uiPageCount)}>
                <PageNumber $on={current === uiPageCount}>{uiPageCount}</PageNumber>
              </Link>
            </>
          )}

          {current < uiPageCount ? (
            <Link to={pageHref(current + 1)}><Arrow>›</Arrow></Link>
          ) : (
            <Arrow $disabled>›</Arrow>
          )}
        </Pages>
      )}
    </Container>
  );
};

export default PublishArticleManageContent;
