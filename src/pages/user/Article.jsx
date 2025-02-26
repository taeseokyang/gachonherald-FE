import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from 'react';
import ArticleHeader from "../../components/ArticleHeader";
import { PageContainer } from "../../components/StyledComponents";
import Footer from "../../components/Footer";
import Title from "../../components/Title";
import Nav from "../../components/Nav";
import TopHeader from "../../components/TopHeader";
import ArticleContent from "../../components/ArticleContent";
import Comment from "../../components/Comment";

const Article = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageContainer>
      <TopHeader></TopHeader>
        <Title></Title>
        <Nav></Nav>
        <ArticleContent></ArticleContent>
        {/* <Comment></Comment> */}
        <Footer></Footer>
    </PageContainer>
  );
};

export default Article;
