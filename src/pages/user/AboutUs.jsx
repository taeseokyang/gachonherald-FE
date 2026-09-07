import { useEffect } from 'react';
import { PageContainer } from "../../components/StyledComponents";
import Footer from "../../components/Footer";
import Title from "../../components/Title";
import Nav from "../../components/Nav";
import TopHeader from "../../components/TopHeader";
import AboutUsContent from "../../components/AboutUsContent";
import { Helmet } from "react-helmet-async";

const AboutUs = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PageContainer>
      <Helmet>
        <title>기자 소개 | The Gachon Herald (가천헤럴드)</title>
        <meta name="description" content="가천헤럴드(The Gachon Herald) 기자단을 소개합니다." />
        <link rel="canonical" href="https://thegachonherald.com/aboutus" />
      </Helmet>
      <TopHeader />
      <Title />
      <Nav />
      <AboutUsContent />
      <Footer />
    </PageContainer>
  );
};

export default AboutUs;
