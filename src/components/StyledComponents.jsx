import styled from 'styled-components';

export const Container = styled.div`
  /* margin: 0px auto; */
  /* display: inline-block; */
  
`;

export const Content = styled.div`
  margin: 0px auto;
  padding: 10px 20px;
  max-width: 1000px;
  min-height: 800px;
`;

export const ContentFit = styled.div`
  margin: 0px auto;
  padding: 10px 20px;
  /* max-width: 800px; */
`;

export const ArticleItem = styled.div`
  margin: 0px auto;
  padding: 10px 20px;
  max-width: 1000px;
`;

export const BlockBox = styled.div`
  display: flex;
  flex-direction: row;
  
  gap: 10px;
  @media screen and (max-width: 600px) {
    flex-direction: column;
    }

`;
export const Block1 = styled.div`
  flex-basis: calc((100% - 30px) / 3);
`;
export const Block2 = styled.div`
  flex: 1;
`;
export const Block3 = styled.div`
  flex: 1;
`;

export const ImageBox = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
  border-radius: 17px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Image = styled.img`
  width: 100%;
  max-height: 100%;
  object-fit: contain;
  z-index: 3;
  position: relative;
  transition: opacity 0.5s;
`;

export const BackgroundImage = styled.img`
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

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 2;
`;

export const Copy = styled.div`
  margin-top: 3px;
  width: 100%;
  font-size: 10px;
  color: #959595;
  text-align: right;
`;

export const BigImageBox = styled.div`
  width: 100%;
  /* height: 450px; */
  /* background: #eeeeee; */
  border-radius: 7px;
  position: relative;
  overflow: hidden;
  &:hover{
    & > div{
        display: block;
    }
  }
  & > div{
    display: none;
    width: 100%;
    padding: 1000px 10px 10px 10px;
    background-color: #00000030;
    color: #ffffff;
    position: absolute;
    bottom: 0px;
    left: 0px;
    
  }
`;

export const Section = styled.div`
  display: inline-block;
  font-size: 14px;
  /* height: 25px; */
  font-weight: 900;
  color: #3E5977;
  margin-bottom: 5px;
  margin-top: 10px;
  &:hover{
    text-decoration: underline;
  }
`;


export const SectionBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* margin-bottom: 5px; */
  margin-bottom: 3px;
  
`;

export const Date = styled.div`
display: inline-block;
  font-size: 14px;
  font-weight: 600;
  color: #bcbcbc;
  margin-bottom: 5px;
`;
export const Title1 = styled.div`
  font-size: 16px;
  font-weight: 700;
  /* margin-bottom: 5px; */
  &:hover{
    text-decoration: underline;
  }
`;

export const SubTitle1 = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #828282;
  margin-bottom: 5px;
`;

export const Reporter1 = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #828282;
  /* margin-bottom: 10px; */
  &:hover{
    text-decoration: underline;
  }
`;

export const PageContainer = styled.div`
  margin: 0px auto;
`;

export const ThinContainer = styled.div`
  margin: 0px auto;
  max-width: 800px;
`;

export const BoxContainer = styled.div`
    margin: 0px auto;
    max-width: 1000px;
    padding: 0px 20px;
`;

