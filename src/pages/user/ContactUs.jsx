import { useEffect } from 'react';
import { PageContainer } from "../../components/StyledComponents";
import Footer from "../../components/Footer";
import Title from "../../components/Title";
import Nav from "../../components/Nav";
import TopHeader from "../../components/TopHeader";
import ContactUsContent from "../../components/ContactUsContent";
import { Helmet } from "react-helmet-async";

const ContactUs = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PageContainer>
      <Helmet>
        <title>연락처 | The Gachon Herald (가천헤럴드)</title>
        <meta name="description" content="가천헤럴드(The Gachon Herald) 연락처 및 위치 정보입니다." />
        <link rel="canonical" href="https://thegachonherald.com/contactus" />
      </Helmet>
      <TopHeader />
      <Title />
      <Nav />
      <ContactUsContent />
      <Footer />
    </PageContainer>
  );
};

export default ContactUs;
