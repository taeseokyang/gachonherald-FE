import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, Content } from "./StyledComponents";
import { useState, useEffect } from "react";
import axios from "axios";
import PageHeading from "./PageHeading";

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 48px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Name = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Card = styled(Link)`
  display: block;
  height: 104px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;

  &:hover {
    border-color: #3e5977;
  }
  &:hover ${Name} {
    color: #3e5977;
  }
`;

const Desc = styled.div`
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.6;
  color: #9b9b9b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EmptyState = styled.div`
  padding: 80px 0;
  text-align: center;
  font-size: 14px;
  color: #9b9b9b;
`;

const ArchiveContent = () => {
  const [archiveSections, setArchiveSections] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACK_URL + "/sections/list"
        );
        setArchiveSections(response.data.data.inactiveSections);
      } catch (error) {
        console.error("오류 발생:", error);
      } finally {
        setLoaded(true);
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Content>
        <PageHeading title="Archive" />

        {loaded && archiveSections.length === 0 ? (
          <EmptyState>No archived sections yet.</EmptyState>
        ) : (
          <Grid>
            {archiveSections.map((section) => (
              <Card key={section.sectionId} to={"/section/" + section.sectionId + "?page=1"}>
                <Name>{section.name}</Name>
                {section.description && <Desc>{section.description}</Desc>}
              </Card>
            ))}
          </Grid>
        )}
      </Content>
    </Container>
  );
};

export default ArchiveContent;
