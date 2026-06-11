import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Container } from "../StyledComponents";
import { Link } from "react-router-dom";

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

/* ─── Left: article list ─── */
const LeftPanel = styled.div``;

const EditorsPick = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3e5977;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UnderLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, #3e5977, transparent);
`;

const ArticleRow = styled(Link)`
  display: block;
  padding: 8px 0 8px 14px;
  border-left: 2px solid ${({ $active }) => ($active ? '#3e5977' : '#eeeeee')};
  margin-bottom: 1px;
  transition: border-color 0.25s;
  cursor: pointer;

  &:hover {
    border-left-color: #3e5977;
  }
`;

const RowSection = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ $active }) => ($active ? '#3e5977' : '#cccccc')};
  margin-bottom: 3px;
  transition: color 0.25s;
`;

const RowTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#1a1a1a' : '#aaaaaa')};
  line-height: 1.4;
  transition: color 0.25s;
`;

/* ─── Right: featured image ─── */
const ImageBox = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 8px;
  overflow: hidden;
  background: #e0e0e0;

  @media (max-width: 700px) {
    height: 220px;
  }
`;

const BlurBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(18px);
  transform: scale(1.1);
  opacity: ${({ $fade }) => ($fade ? 0 : 1)};
  transition: opacity 0.22s ease;
`;

const BgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.35);
  z-index: 1;
`;

const CoverImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
  opacity: ${({ $fade }) => ($fade ? 0 : 1)};
  transition: opacity 0.22s ease;
`;

const Gradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    transparent 100%
  );
  z-index: 3;
`;

const TextBox = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 22px;
  z-index: 4;
  opacity: ${({ $fade }) => ($fade ? 0 : 1)};
  transition: opacity 0.22s ease;
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 6px;
`;

const FeaturedTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
  margin-bottom: 5px;

  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

const FeaturedSubtitle = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;

  @media (max-width: 600px) {
    font-size: 11px;
  }
`;

/* ─────────────────────────────── */

const TopBlock = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const timerRef = useRef(null);

  const goTo = (index) => {
    if (index === currentIndex) return;
    setFade(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setFade(false);
    }, 220);
  };

  const resetAutoplay = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % articles.length);
        setFade(false);
      }, 220);
    }, 8000);
  };

  useEffect(() => {
    if (!articles.length) return;
    resetAutoplay();
    return () => clearInterval(timerRef.current);
  }, [articles]);

  const current = articles[currentIndex];

  return (
    <Container>
      <Wrapper>
        {/* Left list */}
        <LeftPanel>
          <EditorsPick>
            Editor's Picks
            {/* <UnderLine /> */}
          </EditorsPick>

          {articles.map((article, index) => (
            <ArticleRow
              to={"/article/" + article.articleId}
              key={article.articleId}
              $active={index === currentIndex}
              onMouseEnter={() => { goTo(index); resetAutoplay(); }}
            >
              <RowSection $active={index === currentIndex}>
                {article.sectionName}
              </RowSection>
              <RowTitle $active={index === currentIndex}>
                {article.title}
              </RowTitle>
            </ArticleRow>
          ))}
        </LeftPanel>

        {/* Right image */}
        <ImageBox>
          {current?.mainImage && (
            <>
              <BlurBg
                src={"https://api.thegachonherald.com/image?path=" + current.mainImage}
                $fade={fade}
                alt=""
              />
              <BgOverlay />
              <CoverImg
                src={"https://api.thegachonherald.com/image?path=" + current.mainImage}
                $fade={fade}
                alt={current.title}
              />
              <Gradient />
              <TextBox $fade={fade}>
                <Link to={"/section/" + current.sectionId + "?page=1"}>
                  <SectionLabel>{current.sectionName}</SectionLabel>
                </Link>
                <Link to={"/article/" + current.articleId}>
                  <FeaturedTitle>{current.title}</FeaturedTitle>
                </Link>
                <Link to={"/article/" + current.articleId}>
                  <FeaturedSubtitle>{current.subtitle}</FeaturedSubtitle>
                </Link>
              </TextBox>
            </>
          )}
        </ImageBox>
      </Wrapper>
    </Container>
  );
};

export default TopBlock;
