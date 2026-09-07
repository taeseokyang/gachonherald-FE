import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import VerticalLine from './homeContents/VerticalLine';
import HorizontalLine from './homeContents/HorizontalLine2';

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
  /* border-radius: 10px; */
  font-weight: 700;
  font-size: 16px ;
  border-bottom: 3px solid #3e5977;
  color: #3e5977;
  /* border: none; */
  cursor: pointer;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 200px;
`;

const Article = styled.li`
  padding-bottom: 5px;
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

const Status = styled.span`
  display: inline-block;
  border-radius: 5px;
  padding: 2px 6px;
  margin-right: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  background: ${props => props.color};
`;
const Info = styled.span`
  /* background: #3E5977; */
  float: right;
  border-radius: 5px;
  color: #828282;
  font-size: 12px;
  /* padding: 5px 7px; */
  margin-left: 10px;
  font-weight: 500;
`;

const WorkSpaceContent = () => {
  const [cookie] = useCookies();
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/editing", {
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
  }, []);

  return (
    <Container>
      <Title>작성중인 기사 {articles.length}</Title>
      <List>
        {articles.map((article) => (
          <Article key={article.articleId}>
            <Link to={"/edit/" + article.articleId}>
              <Status color={getStatusColor(article.status)}>{article.status}</Status>{article.title}
              <Info> {article.sectionName}</Info>
            </Link>
          </Article>
        ))}
      </List>



      <Link to={"/edit"}><Button style={{ backgroundColor: "#3e5977", color: "#ffffff" }} >기사 작성</Button></Link>
      {cookie.roles == 'ADMIN' ?
  
      
            <>
          <HorizontalLine></HorizontalLine>
          <Link to={"/publish"}><Button>발간 관리</Button></Link>
          {/* <Link to={"/manage/section"}><Button>섹션 관리</Button></Link> */}
          <Link to={"/manage/user?page=1"}><Button>유저 관리</Button></Link>
        </>
        : null
        }

    </Container>
  );
};

export default WorkSpaceContent;
