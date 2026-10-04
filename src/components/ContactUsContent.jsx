import styled from "styled-components";
import { Container, Content } from "./StyledComponents";
import PageHeading from "./PageHeading";

const Box = styled.div`
  margin-bottom: 48px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid #ececec;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 4px;
    padding: 14px 0;
  }
`;

const Label = styled.div`
  font-size: 13px;
  color: #9b9b9b;
`;

const Value = styled.div`
  font-size: 15px;
  color: #1a1a1a;
  line-height: 1.6;

  & a {
    color: #1a1a1a;
    border-bottom: 1px solid #c8c8c8;
  }
  & a:hover {
    color: #3e5977;
    border-bottom-color: #3e5977;
  }
`;

const ContactUsContent = () => {
  return (
    <Container>
      <Content>
        <PageHeading title="Contact Us" />
        <Box>
          <Row>
            <Label>Location</Label>
            <Value>경기 성남시 수정구 성남대로 1342 중앙도서관 411호</Value>
          </Row>
          <Row>
            <Label>Instagram</Label>
            <Value>
              <a href="https://www.instagram.com/thegachonherald" target="_blank" rel="noopener noreferrer">
                @thegachonherald
              </a>
            </Value>
          </Row>
        </Box>
      </Content>
    </Container>
  );
};

export default ContactUsContent;
