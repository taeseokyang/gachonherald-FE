import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ThinContainer, Container, Content, Block1, Block2, BlockBox, ImageBox, Image, Section, Title1, SubTitle1, Reporter1, Copy, Date } from "./StyledComponents";
import HorizontalLine from "./homeContents/HorizontalLine2";
import { useState, useEffect } from 'react';
import axios from "axios";
import { useCookies } from "react-cookie";


const ArticleTitle = styled.div`
  margin-top: 10px;
  color: #000000;
  font-size: 30px;
  font-weight: 700;
  line-height: 100%;
`;
const ArticleSubTitle = styled.div`
  margin-top: 10px;
  color: #828282;
  font-size: 18px;
  font-weight: 500;
  line-height: 100%;
`;

const ArticleBody = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
  color: #000000;
  white-space: ${props => props.isOldArticle ? 'normal' : 'pre-line'};
  & img {
  display: block;
  margin: 20px auto 5px auto;
  /* border-radius: 10px; */
  width: 100%;
  max-height: 500px;
  object-fit: contain;
}
  & strong{
    /* margin: 10px 0px; */
  }
`;

const InfoBox = styled.div`
  margin: 30px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #eeeeee;

`;
const ReporterBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const ReporterImg = styled.div`
  width: 30px;
  height: 30px;
  border: 1px solid #eeeeee;
  border-radius: 100px;

`;
const ReporterName = styled.div`
  font-size: 14px;
  font-weight: 600;
  /* margin-left: 10px; */
`;

const PublishedDate = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #bcbcbc;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #3E5977;
`;



const ArticleContent = () => {
  const [cookie] = useCookies(); 
  const { articleId } = useParams();
  const [article, setArticle] = useState({ publishedAt: "" });
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/" + articleId, {
        });
        setArticle(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, [articleId]);

  return (
    <ThinContainer>
      <Content>
      <Link to={"/section/" + article.sectionId+"?page=1"}>
      <SectionTitle>{article.sectionName}</SectionTitle>
      </Link>
        
        <ArticleTitle>{article.title}</ArticleTitle>
        <ArticleSubTitle>{article.subtitle}</ArticleSubTitle>
        {/* <Separator></Separator> */}
        <InfoBox>
          <Link to={"/reporter/" + article.reporterId}>
            <ReporterBox>



              {/* <ReporterImg>

              </ReporterImg> */}
              <ReporterName>
                By {article.reporterName}
              </ReporterName>

            </ReporterBox></Link>
          <PublishedDate>{article.publishedAt.slice(0, 10)}</PublishedDate>
        </InfoBox>
        <ArticleBody isOldArticle={article.articleId < 1262} dangerouslySetInnerHTML={{ __html: article.content }}>
        </ArticleBody>
      </Content>
    </ThinContainer>
  );
};

export default ArticleContent;