import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Container, ArticleItem, Block1, Block2, BlockBox } from "../StyledComponents";
import VerticalLine from "./VerticalLine";
import { Link } from "react-router-dom";
import axios from "axios";

const Text1 = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-left: 20px;
  color: #ffffff;
  @media screen and (max-width: 600px) {
    font-size: 16px;
    margin-left: 10px;
  }
`;
const Text2 = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-left: 20px;
  @media screen and (max-width: 600px) {
    font-size: 12px;
    margin-left: 10px;
  }
`;

const Section = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  margin-left: 20px;
  margin-bottom: 5px;
  @media screen and (max-width: 600px) {
    font-size: 12px;
    margin-left: 10px;
  }
`;
const Text3 = styled.div`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 15px;
  background: ${({ isActive }) => (isActive ? "#f5f5f5" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#3e5977" : "#828282")};
  border-radius: 10px;
  padding: 10px;
  transition: background 0.3s;
  cursor: pointer; /* 마우스 커서를 포인터로 변경 */
`;

const EditorsPick = styled.div`
  /* border-bottom: 3px solid #3e5977; */
  /* padding-bottom: 7px; */
  color: #3e5977;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  display: flex;
`;

const EditorsPickText = styled.div`
  display: inline-block;
  /* flex: 1; */
`;

const UnderLine = styled.div`
  display: inline-block;
  flex: 1;
  height: 18px;
  margin-left: 3px;
  border-bottom: 2.5px solid #3e5977;
`;


const BigImageBox = styled.div`
  width: 100%;
  height: 350px;
  position: relative;
  border-radius: 17px;
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
          <VerticalLine />
          <Block1>
            <EditorsPick><EditorsPickText>Editor's Picks</EditorsPickText><UnderLine></UnderLine></EditorsPick>
            {articles.map((article, index) => (
              <Link to={"/article/" + article.articleId} key={article.articleId}>
                <Text3 
                  isActive={index === currentIndex} 
                  onMouseEnter={() => handleMouseEnter(index)} // 마우스 오버 시 인덱스 변경
                >
                  {article.title}
                </Text3>
              </Link>
            ))}
          </Block1>
        </BlockBox>
      </ArticleItem>
    </Container>
  );
};

export default TopBlock;
