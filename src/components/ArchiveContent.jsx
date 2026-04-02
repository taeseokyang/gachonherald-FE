import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Container, Content, Block1, Block2, BlockBox, ImageBox, Image, Section, Title1, SubTitle1, Reporter1, Copy, Date, BackgroundImage, Overlay  } from "./StyledComponents";
import HorizontalLine from "./homeContents/HorizontalLine2";
import { useState, useEffect } from 'react';
import axios from "axios";

const Box= styled.div`

  margin-bottom: 50px;
  
`;

const Info = styled.div`
    display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 14px;
  padding-bottom: 10px;
`;

const InfoName = styled.div`
/* font-weight: 5300; */
margin-right: 10px;
color: #828282;
&:hover{
  color: #000000;
}
`;



const Title= styled.div`
    font-size: 23px;
  font-weight: 700;
  color: #3E5977;
  padding-bottom: 10px;
  border-bottom: 2px solid #eeeeee;
  margin-bottom: 30px;
`;





const ContactUsContent = () => {
  const [archiveSections, setArchiveSections] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/sections/list", {
        });
        setArchiveSections(response.data.data.inactiveSections)
        console.log(response.data.data)
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
            <Title>Archive</Title>
            {archiveSections.map((section) => (
              
                        <Info key={section.sectionId}>
                            <Link to={"/section/" + section.sectionId+"?page=1"}>
                            <InfoName>{section.name}</InfoName>
                                {/* <UnderBar></UnderBar> */}
                            </Link>
                        </Info>
            ))}
        </Box>

        
      </Content>
    </Container>
  );
};

export default ContactUsContent;