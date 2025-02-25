import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container} from "./StyledComponents";


const Dummy = styled.div`
  /* height: 200px; */
`;
const Layout = styled.div`
    margin-top: 50px;
    position: absolute;
    left: 0;
    width: 100%;
    /* height:100px; */
    
    background: #eeeeee;

`;
const Content = styled.div`
  padding: 100px 20px 10px 20px;
  max-width: 1000px;
  margin: 0px auto;
`;
const Item = styled.div`
  font-size: 13px;
  color: #5c5c5c;
  white-space: nowrap;
`;

const Line = styled.div`
display: flex;
    flex-direction: row;
    gap: 15px;
    margin-bottom: 10px;
`;

const ClickItem = styled.div`
  font-size: 13px;
  color: #5c5c5c;
  white-space: nowrap;
  border-bottom: 1px solid #eeeeee;
  &:hover{
      border-bottom: 1px solid #5c5c5c;
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
            <Item>ⓒ 2025 The Gachon Herald</Item>
            <a href={"https://yangsoft.netlify.app"}>
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
