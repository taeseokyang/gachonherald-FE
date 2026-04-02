import axios from 'axios';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

import { useParams, useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const ImagePreviewBox = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  padding-bottom: 10px;
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ImagePreview = styled.img`
  height: 100px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid #eeeeee;
  border-radius: 10px;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #828282;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  display: ${props => (props.visible ? 'block' : 'none')};
  &:hover {
    background: #eeeeee;
  }
`;

const MainImageButton = styled.button`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px;
  font-size: 12px;
  cursor: pointer;
`;

const MainImageLabel = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 7px;
  font-weight: 700;
  font-size: 14px;
  background-color: #3e5977;
  color: white;
  border: none;
  float: right;
  margin-left: 5px;
  cursor: pointer;
`;

const DropzoneArea = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 20px;
  color: #828282;
`;

const InputField = styled.input`
  width: 100%;
  font-size: 16px;
  box-sizing: border-box;
  padding: 10px 0px;
  margin-top: 10px;
  font-weight: 500;
  outline: none;
  border: none;
  border-bottom: 3px solid #eeeeee;

  &::placeholder {
    color: #bcbcbc; 
    font-weight: 700; 
  }

  /* 비활성화 스타일 */
  ${({ disabled }) => disabled && `
    background-color: #ffffff;
    // cursor: not-allowed;
  `}
`;

const TextArea = styled.textarea`
  margin-top: 30px;
  width: 100%;
  outline: none;
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
  box-sizing: border-box;
  border: none;
  resize: none;
  min-height: 600px;

  &::placeholder {
    color: #bcbcbc; 
    font-weight: 700; 
  }

  /* 비활성화 스타일 */
  ${({ disabled }) => disabled && `
    background-color: #ffffff;
    // cursor: not-allowed;
  `}
`;

const Dropdown = styled.select`
  margin-top: 20px;
  padding: 5px;
  font-size: 16px;
  color: #3E5977;
  font-weight: 700;
  outline: none;
  border: 3px solid #eeeeee;
  border-radius: 5px;
  width: 100%;
`;

const StatusLabel = styled.div`
  display: inline-block;
  background: #3E5977;
  border-radius: 5px;
  color: #ffffff;
  font-size: 14px;
  padding: 5px 7px;
  margin-bottom: 20px;
  font-weight: 700;
`;

const RadioButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const RadioButton = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #3E5977;
  font-size: 14px;
  font-weight: 700;

  input[type="radio"] {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #fff;
    border: 2px solid #3E5977;
    margin-right: 10px;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  input[type="radio"]:checked {
    background-color: #3E5977;
    border: 2px solid #3E5977;
  }

  input[type="radio"]:hover {
    background-color: #f0f0f0;
    border-color: #3E5977;
  }

  input[type="radio"]:checked {
    background-color: #3E5977;
    border: 2px solid #fff;
  }

  span {
    transition: all 0.3s ease;
  }

  input[type="radio"]:checked + span {
    color: #3E5977;
  }
`;

const ArticleBody = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  font-size: 16px;
  /* font-weight: 500; */
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


const ArticleTitle = styled.div`
  margin-top: 10px;
  color: #000000;
  font-size: 24px;
  font-weight: 500;
  line-height: 100%;
`;
const ArticleSubTitle = styled.div`
  margin-top: 5px;
  color: #828282;
  font-size: 18px;
  font-weight: 300;
  line-height: 100%;
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
  /* font-weight: 500; */
  /* margin-left: 10px; */
`;

const PublishedDate = styled.div`
  font-size: 14px;
  font-weight: 300;
  color: #bcbcbc;
`;

const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 300;
  color: #3E5977;
`;

const ArticleCheckContent = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [sectionId, setSectionId] = useState(2);
  const [mainImage, setMainImage] = useState('');
  const [images, setImages] = useState([]);
  const [sections, setSections] = useState([]);
  const [cookie, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [articleStatus, setArticleStatus] = useState(''); // 기사 상태
  const [status, setStatus] = useState('');
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/reporter/" + articleId, {
          headers: {
            Authorization: `Bearer ${cookie.accessToken}`,
          },
        });
        setTitle(response.data.data.title);
        setSubtitle(response.data.data.subtitle);
        setReporterName(response.data.data.reporterName);
        setSectionId(response.data.data.sectionId);
        setContent(response.data.data.content);
        if (response.data.data.mainImage != '') {
          setImages([response.data.data.mainImage]);
        }
        setMainImage(response.data.data.mainImage);
        setArticleStatus(response.data.data.status);
        setStatus(response.data.data.status);
        console.log(response.data.data);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, [articleId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/sections/list");
        setSections(response.data.data.activeSections);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  // 이미지 업로드 핸들러
  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append('pic', file);

    // 이미지 업로드 API 호출
    axios
      .post(process.env.REACT_APP_BACK_URL + '/image', formData)
      .then((response) => {
        setImages((prev) => [...prev, response.data.data.imageName]);
        handleImageDrag(response.data.data.imageName);
      })
      .catch((error) => console.error('이미지 업로드 실패', error));
  };



  const handleDeny = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACK_URL}/articles/deny/${articleId}`, {}, {
        headers: {
          Authorization: `Bearer ${cookie.accessToken}`,
        },
      });
      navigate("/publish");
    } catch (error) {
    }
  };

  const handleApprove = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACK_URL}/articles/approve/${articleId}`, {}, {
        headers: {
          Authorization: `Bearer ${cookie.accessToken}`,
        },
      });
      navigate("/publish");
    } catch (error) {
    }
  };

  function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getSectionNameById(sectionId, sectionList) {
  const section = sectionList.find(item => item.sectionId == sectionId);
  return section ? section.name : null;
}


  return (
    <Container>
      <StatusLabel>{articleStatus}</StatusLabel>

      <SectionTitle>{getSectionNameById(sectionId,sections)}</SectionTitle>

            <ArticleTitle>{title}</ArticleTitle>
            <ArticleSubTitle>{subtitle}</ArticleSubTitle>
            {/* <Separator></Separator> */}
            <InfoBox>
                <ReporterBox>
    
    
    
                  {/* <ReporterImg>
    
                  </ReporterImg> */}
                  <ReporterName>
                    By {reporterName}
                  </ReporterName>
    
                </ReporterBox>
              <PublishedDate>{getTodayDate()}</PublishedDate>
            </InfoBox>

      <ArticleBody isOldArticle={false} dangerouslySetInnerHTML={{ __html: content }}>
            </ArticleBody>

      {articleStatus == 'PENDING' ?
        <>
          <Button onClick={handleApprove}>승인</Button>
          <Button style={{ backgroundColor: "#bcbcbc" }}onClick={handleDeny}>거절</Button>
        </>
        : null}
    </Container>

  );
};

export default ArticleCheckContent;
