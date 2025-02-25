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
  margin-bottom: 200px;
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
  border-radius: 5px;
  color: #3E5977;
  font-size: 14px;
  margin-right: 10px;
  font-weight: 700;
`;

const Info = styled.div`
  border-radius: 5px;
  color: #828282;
  font-size: 14px;
  font-weight: 700;
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
const EditorsPick = styled.div`
  margin-left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #828282;
  background-color: ${props => props.checked ? '#3E5977' : 'white'};
  cursor: pointer;
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

const PublishManageContent = () => {
  const [cookie] = useCookies();
  const [articles, setArticles] = useState([]);
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

  // 체크박스 상태 변경 함수
  const toggleCheck = async (articleId) => {
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

    const isConfirmed = window.confirm("현재 발간되어 있는 기사들이, 현재 승인된 기사들로 대체됩니다.\n최소 한개의 기사를 에디터 픽으로 설정하여주세요.\n정말 발간 하시겠습니까?");
  
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

  return (
    <Container>
      <Title>편집중인 기사 {articles.length}</Title>
      <List>
        {articles.map((article) => (
          <Article key={article.articleId}>
            <Status>{article.status}</Status>
            <ArticleInfo>
              <Link to={"/check/" + article.articleId}>
                <ArticleTitle>{article.title}</ArticleTitle>
              </Link>
            </ArticleInfo>
            <Info>{article.reporterName+", "}</Info>
            <Info>{article.sectionName}</Info>

            <EditorsPick
              checked={article.isEditorsPick}
              onClick={() => toggleCheck(article.articleId)}
            />
          </Article>
        ))}
      </List>

      
      {/* <HorizontalLine /> */}
      <Link to={"/publish/article?page=1"}><Button>발간 수정</Button></Link>
      <Button style={{ backgroundColor: "#3e5977", color:"#ffffff" }} onClick={publish}>발간 하기</Button>
    </Container>
  );
};

export default PublishManageContent;
