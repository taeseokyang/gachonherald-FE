import { PageContainer } from "../../components/StyledComponents";
import Title from "../../components/Title";
import Nav from "../../components/Nav";
import TopHeader from "../../components/TopHeader";
import Footer from "../../components/Footer";
import ArchiveContent from "../../components/ArchiveContent";
import { Helmet } from "react-helmet-async";

const Archive = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>아카이브 | The Gachon Herald (가천헤럴드)</title>
        <meta name="description" content="가천헤럴드(The Gachon Herald) 과거 섹션 아카이브입니다." />
        <link rel="canonical" href="https://thegachonherald.com/archive" />
      </Helmet>
      <TopHeader />
      <Title />
      <Nav />
      <ArchiveContent />
      <Footer />
    </PageContainer>
  );
};

export default Archive;
