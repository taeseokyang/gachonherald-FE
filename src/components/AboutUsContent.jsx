import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, Content } from "./StyledComponents";
import { useState, useEffect } from "react";
import axios from "axios";

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

const ReporterItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
`;

const Position = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3e5977;
  min-width: 100px;
  flex-shrink: 0;
`;

const ReporterName = styled.div`
  font-size: 14px;
  color: #555555;
  transition: color 0.15s;

  &:hover {
    color: #3e5977;
  }
`;

const AboutUsContent = () => {
  const [reporters, setReporters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACK_URL + "/account/reporters"
        );
        setReporters(response.data.data.reporters);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Content>
        <Box>
          <PageTitle>Our Reporters</PageTitle>
          {reporters.map((reporter, index) => (
            <ReporterItem key={index}>
              <Position>{reporter.position}</Position>
              <Link to={"/reporter/" + reporter.reporterId}>
                <ReporterName>{reporter.nickname}</ReporterName>
              </Link>
            </ReporterItem>
          ))}
        </Box>
      </Content>
    </Container>
  );
};

export default AboutUsContent;
