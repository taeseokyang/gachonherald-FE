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
import UserManageContent from "../../components/UserManageContent";


const UserManage = () => {
  return (
    <PageContainer>
      <TopHeader></TopHeader>
        <Title></Title>
        <Nav></Nav>
        <UserManageContent></UserManageContent>
        <Footer></Footer>
    </PageContainer>
  );
};

export default UserManage;
