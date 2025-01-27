import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container } from "./StyledComponents";
import NavBar from "./NavBar";

export const Content = styled.div`
  margin: 0px auto;
  padding: 40px 20px;
  max-width: 1000px;
  text-align: center;
  @media screen and (max-width: 600px) {
    padding: 20px 20px;
    }
`;

export const TitleImgBox = styled.div`
 pointer-events: auto;
`;

export const TitleImg = styled.object`
  height: 100px;
  pointer-events: none;
  @media screen and (max-width: 600px) {
      height: 50px;
    }
`;

const Title = () => {
  return (
    <Container>
      <Content>
        <Link to={"/"}>
        <TitleImgBox>
        <TitleImg data="/images/gachonherald.svg"></TitleImg>
        </TitleImgBox>
          
        </Link>
      </Content>
    </Container>
  );
};

export default Title;
