import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, ArticleItem, Section } from "../StyledComponents";

// Editor's Pick과 같은 방식: 흐린 배경 위에 원본 비율 그대로(잘림 없이) 표시
const FullImageBox = styled.div`
  width: 100%;
  height: 480px;
  overflow: hidden;
  background: #e0e0e0;
  margin-bottom: 12px;
  position: relative;

  @media (max-width: 700px) {
    height: 260px;
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
`;

const BgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.35);
  z-index: 1;
`;

const PhotoImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
  transition: transform 0.4s ease;
`;

const Caption = styled.div`
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
  margin-bottom: 4px;
  transition: color 0.2s;
`;

const Subcaption = styled.div`
  font-size: 13px;
  color: #6b6b6b;
  line-height: 1.4;
`;

const ArticleLink = styled(Link)`
  display: block;
  &:hover ${Caption} {
    color: #3e5977;
  }
  &:hover ${PhotoImg} {
    transform: scale(1.02);
  }
`;

const ImagePhotoEssay = ({ sectionId, sectionName, imageArticles }) => {
  const article = imageArticles[0];
  if (!article) return null;
  const imageUrl = "https://api.thegachonherald.com/image?path=" + article.mainImage;

  return (
    <Container>
      <ArticleItem>
        <Link to={"/section/" + sectionId + "?page=1"}>
          <Section>{sectionName}</Section>
        </Link>
        <ArticleLink to={"/article/" + article.articleId}>
          <FullImageBox>
            <BlurBg src={imageUrl} alt="" aria-hidden="true" />
            <BgOverlay />
            <PhotoImg src={imageUrl} alt={article.title} />
          </FullImageBox>
          <Caption>{article.title}</Caption>
          <Subcaption>{article.subtitle}</Subcaption>
        </ArticleLink>
      </ArticleItem>
    </Container>
  );
};

export default ImagePhotoEssay;
