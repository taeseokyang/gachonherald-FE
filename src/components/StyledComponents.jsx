import styled from 'styled-components';

export const PageContainer = styled.div`
  margin: 0px auto;
`;

export const ThinPageContainer = styled.div`
  margin: 0px auto;
  max-width: 600px;
  padding: 0px 20px;
`;

export const BoxContainer = styled.div`
    margin: 0px auto;
    max-width: 1200px;
    padding: 0px 20px;
`;


export const SectionTitle = styled.div`
    font-size: 20px;
    font-weight: 400;
    color: ${({ color }) => (color == "w" ? "#ffffff" : "#000000")};
    margin-bottom: 5px;
`;

export const ArticleTitle = styled.div`
    font-size: 30px;
    font-weight: 600;
    color: ${({ color }) => (color == "w" ? "#ffffff" : "#000000")};
`;

export const ArticleSubTitle = styled.div`
    font-size: 20px;
    font-weight: 400;
    color: ${({ color }) => (color == "w" ? "#ffffff" : "#000000")};
`;

export const Reporter = styled.div`
    margin-top: 10px;
    font-size: 15px;
    font-weight: 800;
    color: ${({ color }) => (color == "w" ? "#ffffff" : "#000000")};
`;