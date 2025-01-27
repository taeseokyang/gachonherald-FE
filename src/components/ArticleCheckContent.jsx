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
  border-radius: 10px;
  font-weight: 700;
  background-color: #3e5977;
  color: white;
  border: none;
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

const ArticleCheckContent = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
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
        setSectionId(response.data.data.sectionId);
        setContent(response.data.data.content);
        if (response.data.data.mainImage != '') {
          setImages([response.data.data.mainImage]);
        }
        setMainImage(response.data.data.mainImage);
        setArticleStatus(response.data.data.status);
        setStatus(response.data.data.status);
        console.log(response.data.data.status);
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


  return (
    <Container>
      <StatusLabel>{articleStatus}</StatusLabel>

      <Dropdown disabled={articleStatus !== 'EDITING'} value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
        {sections.map((section) => (
          <option key={section.sectionId} value={section.sectionId}>{section.name}</option>
        ))}
      </Dropdown>

      <InputField
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={articleStatus !== 'EDITING'}
      />
      <InputField
        type="text"
        placeholder="Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        disabled={articleStatus !== 'EDITING'}
      />

      <TextArea
        id="articleContent"
        placeholder="Write your article content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={articleStatus !== 'EDITING'}
      />

      <ImagePreviewBox>
        {images.map((image, index) => (
          <ImagePreviewContainer key={index}>
            <ImagePreview
              src={'https://api.thegachonherald.com/image?path=' + image}
              alt={`Uploaded ${image}`}
              isMain={mainImage === image}  // 메인 이미지 강조
            />
            {mainImage === image && (
              <MainImageLabel>메인 이미지</MainImageLabel> // 메인 이미지 레이블
            )}
          </ImagePreviewContainer>
        ))}
      </ImagePreviewBox>

      {articleStatus == 'PENDING' ?
        <>
          <Button onClick={handleApprove}>승인</Button>
          <Button onClick={handleDeny}>거절</Button>
        </>
        : null}
    </Container>
  );
};

export default ArticleCheckContent;
