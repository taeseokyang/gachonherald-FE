import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Container, Content, Block1, Block2, BlockBox, ImageBox, Image, Section, Title1, SubTitle1, Reporter1, Copy, Date, BackgroundImage, Overlay } from "./StyledComponents";
import HorizontalLine from "./homeContents/HorizontalLine2";
import { useState, useEffect } from 'react';
import axios from "axios";

const SectionTitle = styled.div`
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 30px;
  color: #3E5977;
`;

const Pages = styled.div`
  margin-top: 50px;
  width: 100%;
  /* height: 50px; */
  /* background: #eeeeee; */
  display: flex;
  justify-content: center; /* 가운데 정렬 */
  align-items: center;
  gap:15px;
`;

const PageNumber = styled.div`
  font-weight: ${({ isOn }) => (isOn ? '700' : '500')};
  
  color: ${({ isOn }) => (isOn ? '#3E5977' : '#bcbcbc')};
  display: flex;
  justify-content: center; /* 숫자 중앙 정렬 */
  align-items: center; 
  cursor: pointer;
`;



const ArticleList = () => {
  const { sectionId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page'); // page 쿼리 파라미터 가져오기
  const [pageNumbers, setPageNumbers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [sectionName, setSectionName] = useState();
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/section/"+sectionId+"?pageNumber="+(page-1), {
        });
        setArticles(response.data.data.articles);
        setPageNumbers(Array.from({ length: response.data.data.pageCount }, (_, index) => index + 1));
        console.log(response.data.data);
        const response2 = await axios.get(process.env.REACT_APP_BACK_URL + "/sections/"+sectionId, {
        });
        setSectionName(response2.data.data.name);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, [sectionId, page]);

  return (
    <Container>
      <Content>
      <SectionTitle>{sectionName}</SectionTitle>
      {articles.map((article) => (
          <div key={article.articleId}>
          <BlockBox>
            <Block2>
              <Date>{article.publishedAt.slice(0,10)}</Date>
              <Link to={"/article/" + article.articleId}>
                <Title1>{article.title}</Title1>
              </Link>
              <SubTitle1>{article.subtitle}</SubTitle1>
              <Link to={"/reporter/" + article.reporterId}>
                <Reporter1>By {article.reporterName}</Reporter1>
              </Link>
            </Block2>
              {
                article.mainImage != "" ?
                <Block1>
                <Link to={"/article/" + article.articleId}>
                <ImageBox>
  
                  <BackgroundImage src={"https://api.thegachonherald.com/image?path=" + article.mainImage} />
                  <Overlay />
                 <Image src={"https://api.thegachonherald.com/image?path=" + article.mainImage}></Image>

            </ImageBox>
            </Link>
            {/* <Copy>Provided by NYT</Copy> */}
            </Block1>
            : 
            null
            }
          
            
          </BlockBox>
          <HorizontalLine></HorizontalLine>
          </div>
       
      ))}

      <Pages>
      {pageNumbers.map((number) => (
        <Link to={"/section/" +sectionId+"?page="+number}>
          <PageNumber key={number} isOn={page == number}>{number}</PageNumber>
        </Link>
      
      ))}

      </Pages>
 </Content>
    </Container>
  );
};

export default ArticleList;