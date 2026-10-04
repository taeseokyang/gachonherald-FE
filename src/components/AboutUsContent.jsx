import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, Content } from "./StyledComponents";
import { useState, useEffect } from "react";
import axios from "axios";
import PageHeading from "./PageHeading";

const Box = styled.div`
  margin-bottom: 48px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid #ececec;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 6px;
    padding: 14px 0;
  }
`;

const Position = styled.div`
  font-size: 13px;
  color: #9b9b9b;
`;

const Names = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 24px;
`;

const ReporterName = styled(Link)`
  font-size: 15px;
  color: #1a1a1a;

  &:hover {
    color: #3e5977;
  }
`;

// 백엔드에서 직책 순으로 정렬돼 오므로 연속된 같은 직책끼리 묶음
const groupByPosition = (reporters) =>
  reporters.reduce((groups, reporter) => {
    const last = groups[groups.length - 1];
    if (last && last.position === reporter.position) last.members.push(reporter);
    else groups.push({ position: reporter.position, members: [reporter] });
    return groups;
  }, []);

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
        <PageHeading title="Our Reporters" />
        <Box>
          {groupByPosition(reporters).map((group) => (
            <Row key={group.position}>
              <Position>{group.position}</Position>
              <Names>
                {group.members.map((reporter) => (
                  <ReporterName key={reporter.reporterId} to={"/reporter/" + reporter.reporterId}>
                    {reporter.nickname}
                  </ReporterName>
                ))}
              </Names>
            </Row>
          ))}
        </Box>
      </Content>
    </Container>
  );
};

export default AboutUsContent;
