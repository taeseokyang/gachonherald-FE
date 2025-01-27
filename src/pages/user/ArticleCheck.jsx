import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect } from 'react';
import { PageContainer } from "../../components/StyledComponents";
import Title from "../../components/Title";
import Nav from "../../components/Nav";
import TopHeader from "../../components/TopHeader";
import Footer from "../../components/Footer";
import ArchiveContent from "../../components/ArchiveContent";
import AddArticleContent from "../../components/AddArticleContent";
import ArticleCheckContent from "../../components/ArticleCheckContent";


const ArticleCheck = () => {
  return (
    <PageContainer>
      <TopHeader></TopHeader>
        <Title></Title>
        <Nav></Nav>
        <ArticleCheckContent></ArticleCheckContent>
        <Footer></Footer>
    </PageContainer>
  );
};

export default ArticleCheck;
