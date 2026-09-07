import { PageContainer } from "../../components/StyledComponents";
import Title from "../../components/Title";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Contents from "../../components/homeContents/Contents";
import TopHeader from "../../components/TopHeader";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <PageContainer>
      <Helmet>
        <title>가천헤럴드 - The Gachon Herald | 가천대학교 영자신문사</title>
        <meta name="description" content="가천대학교 공식 영자신문사 가천헤럴드(The Gachon Herald)입니다. 최신 기사와 캠퍼스 뉴스를 확인하세요." />
        <link rel="canonical" href="https://thegachonherald.com" />
      </Helmet>
      <TopHeader />
      <Title />
      <Nav />
      <Contents />
      <Footer />
    </PageContainer>
  );
};

export default Home;
