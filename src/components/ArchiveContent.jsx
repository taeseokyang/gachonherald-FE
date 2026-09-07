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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ArchiveItem = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
`;

const ArchiveName = styled.div`
  font-size: 14px;
  color: #555555;
  transition: color 0.15s;

  &:hover {
    color: #3e5977;
  }
`;

const ArchiveContent = () => {
  const [archiveSections, setArchiveSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACK_URL + "/sections/list"
        );
        setArchiveSections(response.data.data.inactiveSections);
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
          <PageTitle>Archive</PageTitle>
          <Grid>
            {archiveSections.map((section) => (
              <ArchiveItem key={section.sectionId}>
                <Link to={"/section/" + section.sectionId + "?page=1"}>
                  <ArchiveName>{section.name}</ArchiveName>
                </Link>
              </ArchiveItem>
            ))}
          </Grid>
        </Box>
      </Content>
    </Container>
  );
};

export default ArchiveContent;
