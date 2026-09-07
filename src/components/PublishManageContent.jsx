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

const Hint = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #9b9b9b;
`;

const HintStar = styled.span`
  color: #f5a623;
  font-size: 14px;
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

const hasImageInArticle = (data) =>
  (data.mainImage !== undefined && data.mainImage !== null && data.mainImage !== "") ||
  /<img[\s>]/i.test(data.content || "");

const PublishManageContent = () => {
  const [cookie] = useCookies();
  const [articles, setArticles] = useState([]);
  // articleId -> true(있음) / false(없음) / null(확인실패) / undefined(확인중)
  const [imageMap, setImageMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/ready", {
      headers: { Authorization: `Bearer ${cookie.accessToken}` },
    })
      .then(r => setArticles(r.data.data.articles))
      .catch(console.error);
  }, [cookie.accessToken]);

  // 각 기사 본문을 확인해 이미지 포함 여부 판별
  useEffect(() => {
    if (articles.length === 0) return;
    let cancelled = false;
    const checkImages = async () => {
      const entries = await Promise.all(
        articles.map(async (article) => {
          try {
            const res = await axios.get(
              process.env.REACT_APP_BACK_URL + "/articles/reporter/" + article.articleId,
              { headers: { Authorization: `Bearer ${cookie.accessToken}` } }
            );
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
  }, [articles, cookie.accessToken]);

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

  const publish = async () => {
    const pendingCount = articles.filter(a => a.status === "PENDING").length;
    if (pendingCount > 0) {
      window.alert(`아직 승인 대기중(PENDING)인 기사가 ${pendingCount}건 있습니다.\n발간 전에 해당 기사들을 승인 또는 거절하여 주세요.`);
      return;
    }

    const editorsPickCount = articles.filter(a => a.isEditorsPick).length;
    if (editorsPickCount === 0) {
      window.alert("에디터 픽으로 선택된 기사가 없습니다.\n메인 슬라이드에 노출할 기사를 최소 한 개 선택하여 주세요.");
      return;
    }

    if (!window.confirm("현재 발간되어 있는 기사들이 현재 승인된 기사들로 대체됩니다.\n정말 발간하시겠습니까?")) return;
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
          <Hint>
            <HintStar>★</HintStar>
            을 켜면 해당 기사가 메인 페이지 상단 슬라이드에 노출됩니다. (이미지가 있는 기사만 선택 가능)
          </Hint>

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
                <StatusBadge $s={article.status}>{article.status}</StatusBadge>
                <TitleCell>
                  <ArticleTitleLink to={"/check/" + article.articleId} title={article.title}>
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
        </>
      )}
    </Container>
  );
};

export default PublishManageContent;
