import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container} from "./StyledComponents";


const Dummy = styled.div`
  /* height: 200px; */
`;
const Layout = styled.div`
    margin-top: 20px;
    position: absolute;
    left: 0;
    width: 100%;
    height:200px;
    background: #bcbcbc;

`;
const Content = styled.div`
  padding: 20px 20px;
  max-width: 1000px;
  margin: 0px auto;
  display: flex;
    align-items: center; 
    flex-direction: row;
    gap: 15px;
`;
const Item = styled.div`
  font-size: 13px;
  color: #5c5c5c;
  white-space: nowrap;
`;

const ClickItem = styled.div`
  font-size: 13px;
  color: #5c5c5c;
  white-space: nowrap;
  &:hover{
      border-bottom: 1px solid #5c5c5c;
    }
`;

const Footer = () => {
  return (
    <Container>
      <Layout>
          <Content>
            <Item>ⓒ 2024 The Gachon Herald</Item>
            <Link to={"/contactus"}>
            <ClickItem>Contact Us</ClickItem>
            </Link>
            <Link to={"/aboutus"}>
            <ClickItem>About Us</ClickItem>
            </Link>
            
          </Content>
      </Layout>
      <Dummy></Dummy>
    </Container>
  );
};

export default Footer;
