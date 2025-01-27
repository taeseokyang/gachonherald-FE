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


const PublishManage = () => {
  return (
    <PageContainer>
      <TopHeader></TopHeader>
        <Title></Title>
        <Nav></Nav>
        <PublishManageContent></PublishManageContent>
        <Footer></Footer>
    </PageContainer>
  );
};

export default PublishManage;
