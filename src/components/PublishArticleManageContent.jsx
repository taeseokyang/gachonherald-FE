import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Button = styled.div`
  margin-top: 10px;
  padding: 20px 0px;
  border-radius: 10px;
  font-weight: 700;
  background-color: #eeeeee;
  text-align: center;
  color: #828282;
  border: none;
  cursor: pointer;
`;

const Title = styled.div`
  padding: 5px 0px;
  font-weight: 700;
  font-size: 16px;
  border-bottom: 3px solid #3e5977;
  color: #3e5977;
  cursor: pointer;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 50px;
`;

const Article = styled.li`
  padding-bottom: 5px;
  display: flex;
  align-items: center;
`;

const ArticleInfo = styled.div`
  flex: 1;
  display: flex;
  white-space: nowrap;
  overflow: hidden;
`;

const Status = styled.div`
  
  font-size: 14px;
  margin-right: 10px;
  font-weight: 700;
  & select{
    font-size: 12px;
    font-weight: 500;
    border: none;
    outline: none;
    background: #eeeeee;
    border-radius: 5px;
    padding: 2px 5px;
  }
`;

const Info = styled.div`
  border-radius: 5px;
  color: #828282;
  font-size: 12px;
  font-weight: 500;
  margin-left: 10px;
  cursor: pointer;
`;

const ArticleTitle = styled.div`
  width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const EditorsPick = styled.div`
  margin-left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #828282;
  background-color: ${props => props.checked ? '#3E5977' : 'white'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.35 : 1};
  transition: background-color 0.3s ease, border-color 0.3s ease;

  ::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.checked ? 'white' : 'transparent'};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Guide = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0px 15px 0px;
  font-size: 12px;
  font-weight: 500;
  color: #828282;
`;

const GuideDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #3E5977;
  background-color: #3E5977;
  flex-shrink: 0;
`;

const ImageBadge = styled.div`
  flex-shrink: 0;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  margin-right: 10px;
  white-space: nowrap;
  background-color: #eeeeee;
  color: #828282;
`;

const Pages = styled.div`
  /* margin-top: 50px; */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const PageNumber = styled.div`
  font-weight: ${({ isOn }) => (isOn ? '700' : '500')};
  color: ${({ isOn }) => (isOn ? '#3E5977' : '#bcbcbc')};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Ellipsis = styled.div`
  color: #bcbcbc;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const Arrow = styled.div`
  color: ${({ disabled }) => (disabled ? '#e5e5e5' : '#3E5977')};
  font-weight: 700;
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
`;

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
  // 한 페이지에 보여줄 기사 수
  const UI_PAGE_SIZE = 20;
  const [uiPageCount, setUiPageCount] = useState(0);
  // articleId -> true(이미지 있음)
  const [imageMap, setImageMap] = useState({});
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page'); // page 쿼리 파라미터 가져오기

  // 상태 리스트 (예시로 'draft', 'published' 등)
  const statusOptions = ['PUBLISHED', 'ARCHIVED'];

  const formatDate = (isoString) => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작이라 +1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
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
            const res = await axios.get(
              process.env.REACT_APP_BACK_URL + "/articles/" + article.articleId
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
    return () => {
      cancelled = true;
    };
  }, [articles]);

  // 상태 변경 처리 함수
  const handleStatusChange = async (articleId, newStatus) => {
    try {
      const response = await axios.patch(process.env.REACT_APP_BACK_URL + "/articles/status/" + articleId+"?status="+newStatus, {}, {
        headers: {
          Authorization: `Bearer ${cookie.accessToken}`,
        },
      });

      if (response.status === 200) {
        setArticles(prevArticles =>
          prevArticles.map(article =>
            article.articleId === articleId
              ? { ...article, status: newStatus }
              : article
          )
        );
      }
    } catch (error) {
      console.error("상태 변경 오류:", error);
    }
  };

  const toggleCheck = async (articleId) => {
    // 이미지가 있는 기사만 메인 슬라이드(에디터 픽)로 선택 가능
    if (imageMap[articleId] !== true) {
      return;
    }
    try {
      // API 호출해서 체크 상태 변경
      const response = await axios.patch(process.env.REACT_APP_BACK_URL + "/articles/editor-pick/"+articleId,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${cookie.accessToken}`,
          },
        });

      // 응답 처리
      if (response.status === 200) {
        setArticles(prevArticles => 
          prevArticles.map(article => 
            article.articleId === articleId 
              ? { ...article, isEditorsPick: response.data.data.isEditorsPick } // 상태 업데이트
              : article
          )
        );
      }
    } catch (error) {
      console.error("체크 상태 변경 오류:", error);
    }
  };


  return (
    <Container>
      <Title>기사</Title>
      <Guide>
        <GuideDot />
        오른쪽 원을 켜면 해당 기사가 메인 페이지 상단 슬라이드(에디터 픽)에 노출됩니다.
      </Guide>
      <List>
        {articles.map((article) => (
          <Article key={article.articleId}>
            <Status>
              <select
                style={{ backgroundColor: article.status == "PUBLISHED" ?"#3e5977" : "#eeeeee", color: article.status == "PUBLISHED" ?"#ffffff" : "#000000"}}
                value={article.status}
                onChange={(e) => handleStatusChange(article.articleId, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Status>
            {imageMap[article.articleId] === true && (
              <ImageBadge title="본문에 이미지가 포함된 기사입니다">이미지</ImageBadge>
            )}
            <ArticleInfo>

              <Link to={"/edit/" + article.articleId}>
                <ArticleTitle title={article.title}>{article.title}</ArticleTitle>
              </Link>
            </ArticleInfo>

            <Info>{article.reporterName+", "}</Info>
            <Info>{article.sectionName+", "}</Info>
             <Info>{formatDate(article.publishedAt)}</Info>

            <EditorsPick
              title={imageMap[article.articleId] === true
                ? '메인 슬라이드(에디터 픽) 노출 여부'
                : '이미지가 있는 기사만 메인 슬라이드로 선택할 수 있습니다'}
              disabled={imageMap[article.articleId] !== true}
              checked={article.isEditorsPick}
              onClick={() => toggleCheck(article.articleId)}
            />
          </Article>
        ))}
      </List>
      <Pages>
        {(() => {
          const total = uiPageCount;
          const current = Number(page) || 1;
          const visible = getVisiblePages(current, total);
          if (total === 0) return null;
          return (
            <>
              {current > 1 ? (
                <Link to={"/publish/article?page=" + (current - 1)}>
                  <Arrow>‹</Arrow>
                </Link>
              ) : (
                <Arrow disabled>‹</Arrow>
              )}

              {visible[0] > 1 && (
                <>
                  <Link to={"/publish/article?page=1"}>
                    <PageNumber isOn={current === 1}>1</PageNumber>
                  </Link>
                  {visible[0] > 2 && <Ellipsis>…</Ellipsis>}
                </>
              )}

              {visible.map((number) => (
                <Link to={"/publish/article?page=" + number} key={number}>
                  <PageNumber isOn={current === number}>{number}</PageNumber>
                </Link>
              ))}

              {visible[visible.length - 1] < total && (
                <>
                  {visible[visible.length - 1] < total - 1 && <Ellipsis>…</Ellipsis>}
                  <Link to={"/publish/article?page=" + total}>
                    <PageNumber isOn={current === total}>{total}</PageNumber>
                  </Link>
                </>
              )}

              {current < total ? (
                <Link to={"/publish/article?page=" + (current + 1)}>
                  <Arrow>›</Arrow>
                </Link>
              ) : (
                <Arrow disabled>›</Arrow>
              )}
            </>
          );
        })()}
      </Pages>
    </Container>
  );
};

export default PublishArticleManageContent;
