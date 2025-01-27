import styled from "styled-components";

const Container = styled.div`
max-width: 1000px;
margin: 20px auto;
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