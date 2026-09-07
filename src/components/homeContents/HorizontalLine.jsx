import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0px auto;
  margin-top: 16px;
  border-bottom: 1px solid #e8e8e8;
  @media screen and (max-width: 600px) {
    display: none;
  }
`;

const HorizontalLine = () => {
  return (
    <Container>
    </Container>
  );
};

export default HorizontalLine;