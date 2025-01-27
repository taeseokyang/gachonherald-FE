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
  font-size: 14px;
  margin-right: 10px;
  font-weight: 700;
`;

const Info = styled.div`
  border-radius: 5px;
  color: #828282;
  font-size: 14px;
  font-weight: 700;
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
  cursor: pointer;
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

const Pages = styled.div`
  margin-top: 50px;
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

const PublishArticleManageContent = () => {
  const [cookie] = useCookies();
  const [articles, setArticles] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page'); // page 쿼리 파라미터 가져오기

  // 상태 리스트 (예시로 'draft', 'published' 등)
  const statusOptions = ['PUBLISHED', 'ARCHIVED'];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/all?pageNumber=" + (page - 1));
        setArticles(response.data.data.articles);
        setPageNumbers(Array.from({ length: 10 }, (_, index) => index + 1));
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, [page]);

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

  return (
    <Container>
      <Title>기사</Title>
      <List>
        {articles.map((article) => (
          <Article key={article.articleId}>
            <Status>
              <select
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
            <ArticleInfo>
              <Link to={"/check/" + article.articleId}>
                <ArticleTitle>{article.title}</ArticleTitle>
              </Link>
            </ArticleInfo>
            <Info>{article.reporterName}</Info>
            <Info>{article.sectionName}</Info>

            <EditorsPick
              checked={article.isEditorsPick}
              onClick={() => toggleCheck(article.articleId)}
            />
          </Article>
        ))}
      </List>
      <Pages>
        {pageNumbers.map((number) => (
          <Link to={"/publish/article?page=" + number} key={number}>
            <PageNumber isOn={page == number}>{number}</PageNumber>
          </Link>
        ))}
      </Pages>
    </Container>
  );
};

export default PublishArticleManageContent;
