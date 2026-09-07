import styled from "styled-components";
import { Container, Content } from "./StyledComponents";

const PageTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  padding-bottom: 14px;
  margin-bottom: 24px;
  border-bottom: 2px solid #3e5977;
`;

const Box = styled.div`
  margin-bottom: 48px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
`;

const InfoLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3e5977;
  min-width: 90px;
  flex-shrink: 0;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #444444;
  line-height: 1.5;
`;

const ContactUsContent = () => {
  return (
    <Container>
      <Content>
        <Box>
          <PageTitle>Contact Us</PageTitle>
          <InfoItem>
            <InfoLabel>Location</InfoLabel>
            <InfoValue>경기 성남시 수정구 성남대로 1342 중앙도서관 411호</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Instagram</InfoLabel>
            <InfoValue>@thegachonherald</InfoValue>
          </InfoItem>
        </Box>
      </Content>
    </Container>
  );
};

export default ContactUsContent;
