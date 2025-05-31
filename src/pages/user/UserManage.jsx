import { PageContainer } from "../../components/StyledComponents";
import Title from "../../components/Title";
import Nav from "../../components/Nav";
import TopHeader from "../../components/TopHeader";
import Footer from "../../components/Footer";
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
