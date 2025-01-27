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

const Status = styled.span`
  /* background: #3E5977; */
  border-radius: 5px;
  color: #3E5977;
  font-size: 14px;
  /* padding: 5px 7px; */
  margin-right: 10px;
  font-weight: 700;
`;

const ArticleManageContent = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/sections/list");
        setSections(response.data.data.activeSections);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Title>기사</Title>
      <List>
        <Article><Status>PENDING</Status>Hello my name is yang</Article>
        <Article><Status>APPROVED</Status>Hello my name is yang</Article>
      </List>

      <Link to={"/edit"}><Button>현재 발간 수정</Button></Link>
    </Container>
  );
};

export default ArticleManageContent;
