import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container } from "./StyledComponents";
import NavBar from "./NavBar";

export const Content = styled.div`
  margin: 0px auto;
  padding: 44px 20px;
  max-width: 1200px;
  text-align: center;
  @media screen and (max-width: 600px) {
    padding: 24px 20px;
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

export const Since = styled.div`
  margin-top: 8px;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #9b9b9b;
  @media screen and (max-width: 600px) {
    font-size: 10px;
    margin-top: 6px;
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
        <Since>Since 1984</Since>
        </Link>
      </Content>
    </Container>
  );
};

export default Title;
