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
import WorkSpaceContent from "../../components/WorkSpaceContent";
import PublishManageContent from "../../components/PublishManageContent";
import CommentManageContent from "../../components/CommentManageContent";


const CommnetManage = () => {
  return (
    <PageContainer>
      <TopHeader></TopHeader>
        <Title></Title>
        <Nav></Nav>
        <CommentManageContent></CommentManageContent>
        <Footer></Footer>
    </PageContainer>
  );
};

export default CommnetManage;
