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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 64px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Arrow = styled.span`
  display: inline-block;
  transition: transform 0.2s ease;
`;

const Card = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 150px;
  padding: 22px 22px 18px;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: #3e5977;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }

  &:hover {
    border-color: #c9d3de;
    box-shadow: 0 8px 22px rgba(62, 89, 119, 0.10);
    transform: translateY(-2px);
  }
  &:hover::before {
    transform: scaleX(1);
  }
  &:hover ${Arrow} {
    transform: translateX(4px);
  }
`;

const Index = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: #b5c0cc;
  margin-bottom: 10px;
`;

const Name = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  color: #1a1a1a;
`;

const Desc = styled.div`
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.55;
  color: #7a7a7a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const More = styled.div`
  margin-top: auto;
  padding-top: 16px;
  font-size: 12px;
  font-weight: 600;
  color: #3e5977;
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
        <PageTitle>Archive</PageTitle>

        {loaded && archiveSections.length === 0 ? (
          <EmptyState>No archived sections yet.</EmptyState>
        ) : (
          <Grid>
            {archiveSections.map((section, index) => (
              <Card key={section.sectionId} to={"/section/" + section.sectionId + "?page=1"}>
                <Index>{String(index + 1).padStart(2, "0")}</Index>
                <Name>{section.name}</Name>
                {section.description && <Desc>{section.description}</Desc>}
                <More>View articles <Arrow>→</Arrow></More>
              </Card>
            ))}
          </Grid>
        )}
      </Content>
    </Container>
  );
};

export default ArchiveContent;
