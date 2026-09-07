import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import VerticalLine from './homeContents/VerticalLine';
import HorizontalLine from './homeContents/HorizontalLine2';
import { useNavigate } from "react-router-dom";
const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Button = styled.div`
  margin-top: 8px;
  padding: 11px 0px;
  border-radius: 8px;
  font-size: 13px;
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
  margin-bottom: 200px;
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

const STATUS_COLORS = {
  PENDING: '#e59500',
  APPROVED: '#2e9e5b',
  READY: '#2e9e5b',
  DENIED: '#d64545',
  REJECTED: '#d64545',
  EDITING: '#828282',
  DRAFT: '#828282',
};

const getStatusColor = (status) => STATUS_COLORS[status] || '#3E5977';

const Status = styled.div`
  flex-shrink: 0;
  display: inline-block;
  border-radius: 5px;
  padding: 2px 6px;
  font-size: 12px;
  margin-right: 10px;
  font-weight: 700;
  color: #ffffff;
  background: ${props => props.color};
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
  /* flex:1; */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  
  /* Inner circle for the "checked" state */
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

const hasImageInArticle = (data) =>
  (data.mainImage !== undefined && data.mainImage !== null && data.mainImage !== "") ||
  /<img[\s>]/i.test(data.content || "");

const PublishManageContent = () => {
  const [cookie] = useCookies();
  const [articles, setArticles] = useState([]);
  // articleId -> true(있음) / false(없음) / undefined(확인중)
  const [imageMap, setImageMap] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/ready", {
          headers: {
            Authorization: `Bearer ${cookie.accessToken}`,
          },
        });
        setArticles(response.data.data.articles);
        console.log(response.data.data);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
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
    return () => {
      cancelled = true;
    };
  }, [articles, cookie.accessToken]);

  // 체크박스 상태 변경 함수
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

  const publish = async () => {

    const pendingCount = articles.filter(article => article.status === "PENDING").length;
    if (pendingCount > 0) {
      window.alert(`아직 승인 대기중(PENDING)인 기사가 ${pendingCount}건 있습니다.\n발간 전에 해당 기사들을 승인 또는 거절하여 주세요.`);
      return;
    }

    const editorsPickCount = articles.filter(article => article.isEditorsPick).length;
    if (editorsPickCount === 0) {
      window.alert("에디터 픽으로 선택된 기사가 없습니다.\n메인 슬라이드에 노출할 기사를 최소 한 개 선택하여 주세요.");
      return;
    }

    const isConfirmed = window.confirm("현재 발간되어 있는 기사들이, 현재 승인된 기사들로 대체됩니다.\n정말 발간 하시겠습니까?");

    if (!isConfirmed) {
      return;
    }
    try {
      const response = await axios.patch(process.env.REACT_APP_BACK_URL + "/articles/publish", 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${cookie.accessToken}`,
          },
        });

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("체크 상태 변경 오류:", error);
    }
  };

    const formatDate = (isoString) => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0부터 시작이라 +1
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
  return (
    <Container>
      <Title>편집중인 기사 {articles.length}</Title>
      <Guide>
        <GuideDot />
        오른쪽 원을 켜면 해당 기사가 메인 페이지 상단 슬라이드(에디터 픽)에 노출됩니다.
      </Guide>
      <List>
        {articles.map((article) => (
          <Article key={article.articleId}>
            <Status color={getStatusColor(article.status)}>{article.status}</Status>
            {imageMap[article.articleId] === true && (
              <ImageBadge title="본문에 이미지가 포함된 기사입니다">이미지</ImageBadge>
            )}
            <ArticleInfo>
              <Link to={"/check/" + article.articleId}>
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

      
      {/* <HorizontalLine /> */}
      <Button style={{ backgroundColor: "#3e5977", color:"#ffffff" }} onClick={publish}>발간 하기</Button>
      <Link to={"/publish/article?page=1"}><Button>발간 수정</Button></Link>
    </Container>
  );
};

export default PublishManageContent;
