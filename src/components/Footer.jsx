import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container} from "./StyledComponents";


const Dummy = styled.div`
  /* height: 200px; */
`;
const Layout = styled.div`
    margin-top: 80px;
    position: absolute;
    left: 0;
    width: 100%;
    border-top: 2px solid #3e5977;
    background: #ffffff;
`;
const Content = styled.div`
  padding: 40px 20px 30px 20px;
  max-width: 1100px;
  margin: 0px auto;
`;
const Item = styled.div`
  font-size: 12px;
  color: #9b9b9b;
  white-space: nowrap;
  & a {
    color: #9b9b9b;
  }
`;

const Line = styled.div`
display: flex;
    flex-direction: row;
    gap: 15px;
    margin-bottom: 10px;
`;

const ClickItem = styled.div`
  font-size: 12px;
  color: #9b9b9b;
  white-space: nowrap;
  &:hover {
    color: #1a1a1a;
  }
`;

const Footer = () => {
  return (
    <Container>
      <Layout>
          <Content>
            <Line>
            <Link to={"/contactus"}>
            <ClickItem>Contact Us</ClickItem>
            </Link>
            <Link to={"/aboutus"}>
            <ClickItem>About Us</ClickItem>
            </Link>
            </Line>
           
            <Line style={{justifyContent: "space-between"}}>
            <Item><Link to={"/Login"}>ⓒ</Link> 2026 The Gachon Herald</Item>
            <a href={"https://yangsoft.co.kr"}>
            <ClickItem >POWERED BY YANGSOFT</ClickItem>
            </a>
            </Line>
         
            
          </Content>
      </Layout>
      <Dummy></Dummy>
    </Container>
  );
};

export default Footer;
