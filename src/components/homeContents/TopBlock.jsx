import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container, ArticleItem, Block1, Block2, BlockBox } from "../StyledComponents";
import VerticalLine from "./VerticalLine";
import { Link } from "react-router-dom";
import axios from "axios";

const Text1 = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
  color: #ffffff;
  line-height: 1.3;
  @media screen and (max-width: 600px) {
    font-size: 14px;
    margin-left: 10px;
  }
`;
const Text2 = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 20px;
  margin-top: 4px;
  line-height: 1.4;
  @media screen and (max-width: 600px) {
    font-size: 11px;
    margin-left: 10px;
  }
`;

const Section = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  margin-left: 20px;
  margin-bottom: 4px;
  @media screen and (max-width: 600px) {
    font-size: 9px;
    margin-left: 10px;
  }
`;
const Text3 = styled.div`
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 400)};
  margin-bottom: 14px;
  color: ${({ isActive }) => (isActive ? "#1a1a1a" : "#9b9b9b")};
  line-height: 1.35;
  transition: color 0.2s;
  display: flex;
  align-items: flex-start;
  cursor: pointer;
`;

const Point = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #3e5977;
  flex-shrink: 0;
  margin-right: 10px;
  margin-top: 5px;
`;

const EditorsPickArticleTitle = styled.div`

`;

const EditorsPick = styled.div`
  color: #3e5977;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
`;

const EditorsPickText = styled.div`
  display: inline-block;
  /* flex: 1; */
`;

const UnderLine = styled.div`
  display: inline-block;
  flex: 1;
  height: 1px;
  margin-left: 10px;
  background: linear-gradient(to right, #3e5977, transparent);
  align-self: center;
`;


const BigImageBox = styled.div`
  width: 100%;
  height: 350px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 600px) {
    height: 200px;
  }
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(10px);
  z-index: 1;
  opacity: ${({ fade }) => (fade ? 0 : 1)};
  transition: opacity 0.5s;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 2;
`;

const BigImage = styled.img`
  width: 100%;
  max-height: 100%;
  object-fit: contain;
  z-index: 3;
  position: relative;
  opacity: ${({ fade }) => (fade ? 0 : 1)};
  transition: opacity 0.5s;
`;

const BigImageTextBox = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 30px 0px;
  background: linear-gradient(to top, #595959, transparent);
  z-index: 3;
  opacity: ${({ fade }) => (fade ? 0 : 1)};
  transition: opacity 0.5s;
  @media screen and (max-width: 600px) {
    padding: 10px 0px;
  }
`;

const TopBlock = ({ articles }) => {
  // const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/list/section/5?pageNumber=0");
  //       setArticles(response.data.data.articles.slice(5, 10));
  //       console.log(response.data.data.articles);
  //     } catch (error) {
  //       console.error("오류 발생:", error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
        setFade(false);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [articles]);

  // 마우스 오버 시 현재 인덱스 변경
  const handleMouseEnter = (index) => {
    setFade(true);
    setCurrentIndex(index);
    setFade(false);
  };

  return (
    <Container>
      <ArticleItem>
        <BlockBox>
           <Block1>
            <EditorsPick><EditorsPickText>Editor's Picks</EditorsPickText><UnderLine></UnderLine></EditorsPick>
            {articles.map((article, index) => (
              <Link to={"/article/" + article.articleId} key={article.articleId}>
                <Text3 
                  isActive={index === currentIndex} 
                  onMouseEnter={() => handleMouseEnter(index)} // 마우스 오버 시 인덱스 변경
                >
                 <Point/><EditorsPickArticleTitle>{article.title}</EditorsPickArticleTitle>
                </Text3>
              </Link>
            ))}
          </Block1>
          <Block2>
            <BigImageBox>
              {articles.length > 0 && articles[currentIndex]?.mainImage ? (
                <>
                  <BackgroundImage src={ "https://api.thegachonherald.com/image?path=" + articles[currentIndex].mainImage} fade={fade} />
                  <Overlay />
                  <BigImage src={"https://api.thegachonherald.com/image?path=" + articles[currentIndex].mainImage} fade={fade} />
                  
                  <BigImageTextBox fade={fade}>
                    {/* <Section>{articles[currentIndex].sectionName}</Section> */}
                    <Link to={"/section/" + articles[currentIndex].sectionId + "?page=1"} ><Section>{articles[currentIndex].sectionName}</Section></Link>
                    <Link to={"/article/" + articles[currentIndex].articleId} ><Text1>{articles[currentIndex].title}</Text1></Link>
                    <Link to={"/article/" + articles[currentIndex].articleId} ><Text2>{articles[currentIndex].subtitle}</Text2></Link>
                  </BigImageTextBox>
                </>
              ) : null}
            </BigImageBox>
          </Block2>
          {/* <VerticalLine /> */}
         
        </BlockBox>
      </ArticleItem>
    </Container>
  );
};

export default TopBlock;
