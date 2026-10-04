import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container, ArticleItem, Section } from "../StyledComponents";

const MAX_SMALL = 3;

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
  font-size: 12px;
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

/* ─── 작은 사진들: 다른 섹션 카드(ImageThree)와 같은 규격 ─── */
const SmallGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${MAX_SMALL}, 1fr);
  gap: 20px;
  margin-top: 28px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
`;

const SmallImageBox = styled(FullImageBox)`
  height: 230px;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    height: 160px;
  }
`;

const SmallTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  color: #1a1a1a;
  margin-bottom: 4px;
  transition: color 0.2s;
`;

const SmallSubtitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #6b6b6b;
  line-height: 1.4;
`;

const SmallLink = styled(Link)`
  display: block;
  &:hover ${SmallTitle} {
    color: #3e5977;
  }
  &:hover ${PhotoImg} {
    transform: scale(1.04);
  }
`;

const imageUrlOf = (article) => "https://api.thegachonherald.com/image?path=" + article.mainImage;

const Photo = ({ Box, article }) => (
  <Box>
    <BlurBg src={imageUrlOf(article)} alt="" aria-hidden="true" />
    <BgOverlay />
    <PhotoImg src={imageUrlOf(article)} alt={article.title} />
  </Box>
);

const ImagePhotoEssay = ({ sectionId, sectionName, imageArticles }) => {
  const [article, ...rest] = imageArticles;
  if (!article) return null;
  const smallArticles = rest.slice(0, MAX_SMALL);

  return (
    <Container>
      <ArticleItem>
        <Link to={"/section/" + sectionId + "?page=1"}>
          <Section>{sectionName}</Section>
        </Link>
        <ArticleLink to={"/article/" + article.articleId}>
          <Photo Box={FullImageBox} article={article} />
          <Caption>{article.title}</Caption>
          <Subcaption>{article.subtitle}</Subcaption>
        </ArticleLink>

        {smallArticles.length > 0 && (
          <SmallGrid>
            {smallArticles.map((a) => (
              <SmallLink key={a.articleId} to={"/article/" + a.articleId}>
                <Photo Box={SmallImageBox} article={a} />
                <SmallTitle>{a.title}</SmallTitle>
                <SmallSubtitle>{a.subtitle}</SmallSubtitle>
              </SmallLink>
            ))}
          </SmallGrid>
        )}
      </ArticleItem>
    </Container>
  );
};

export default ImagePhotoEssay;
