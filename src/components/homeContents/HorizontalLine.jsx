import styled from "styled-components";

const Container = styled.div`
max-width: 1000px;
margin: 0px auto;
margin-top: 10px;
border-bottom: 1px solid #eeeeee;
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