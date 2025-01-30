import axios from 'axios';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

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
    background-color: #f0f0f0;
    cursor: not-allowed;
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
    background-color: #f0f0f0;
    cursor: not-allowed;
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

const AddArticleContent = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [sectionId, setSectionId] = useState(2);
  const [mainImage, setMainImage] = useState('');
  const [images, setImages] = useState([]);
  const [sections, setSections] = useState([]);
  const [articleStatus, setArticleStatus] = useState('EDITING'); // 기사 상태
  const [cookie, setCookie, removeCookie] = useCookies(); 
  const navigate = useNavigate(); 
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

  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append('pic', file);
    axios
      .post('https://api.thegachonherald.com/image', formData)
      .then((response) => {
        setImages((prev) => [...prev, response.data.data.imageName]);
        handleImageDrag(response.data.data.imageName);
      })
      .catch((error) => console.error('이미지 업로드 실패', error));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        handleImageUpload(file);
      });
    },
    accept: 'image/*', // 이미지 파일만 업로드 가능
  });

  const handleImageDrag = (imageName) => {
    const textarea = document.getElementById('articleContent');
    const cursorPosition = textarea.selectionStart;
    const beforeText = content.substring(0, cursorPosition);
    const afterText = content.substring(cursorPosition);
    const imgTag = `<img src="https://api.thegachonherald.com/image?path=${imageName}" />`;
    setContent(beforeText + imgTag + afterText);
    setTimeout(() => {
      textarea.selectionStart = cursorPosition + imgTag.length;
      textarea.selectionEnd = textarea.selectionStart;
      textarea.focus();
    }, 0);
  };

  const handleImageDelete = (imageName) => {
    setImages((prev) => prev.filter((image) => image !== imageName));
  };

  const handleSetMainImage = (imageName) => {
    setMainImage(imageName);
  };

  const handleSave = async () => {
    if (images.length !== 0 && mainImage === "") {
      alert("메인 이미지를 선택하세요.");
      return; 
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACK_URL}/articles`, {
        title,
        subtitle,
        content,
        mainImage,
        sectionId,
        status: articleStatus, // 선택된 상태를 함께 전송
      }, {
        headers: {
          Authorization: `Bearer ${cookie.accessToken}`,
        },
      });
      setTitle(""); // 입력 필드 초기화
      setSubtitle("");
      setSectionId(2);
      setContent(""); // 입력 필드 초기화
      setMainImage(""); // 메인 이미지 초기화
      setImages([]);
      setArticleStatus('EDITING'); // 상태 초기화
      alert("작성 완료");
    } catch (error) {
      console.error("기사 저장 오류:", error);
      removeCookie('accessToken', { path: "/" }); 
      removeCookie('userId', { path: "/" }); 
      removeCookie('id', { path: "/" }); 
      removeCookie('nickname', { path: "/" }); 
      removeCookie('roles', { path: "/" }); 
      navigate("/Login");
    }
  };

  const handleStatusChange = (status) => {
    if (status === 'PENDING') {
      if (window.confirm("승인 신청 시 더 이상 기사를 수정할 수 없습니다.")) {
        setArticleStatus(status);
      }
    } else {
      setArticleStatus(status);
    }
  };

  return (
    <Container>
      <StatusLabel>{"EDITING"}</StatusLabel>
      <RadioButtonGroup>
        <RadioButton>
          <input
            type="radio"
            id="draft"
            name="articleStatus"
            value="draft"
            checked={articleStatus === 'EDITING'}
            onChange={() => handleStatusChange('EDITING')}
          />
          <span>기사 작성</span>
        </RadioButton>
        <RadioButton>
          <input
            type="radio"
            id="pending"
            name="articleStatus"
            value="pending"
            checked={articleStatus === 'PENDING'}
            onChange={() => handleStatusChange('PENDING')}
          />
          <span>승인 신청</span>
        </RadioButton>
      </RadioButtonGroup>

      <Dropdown value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
        {sections.map((section) => (
          <option key={section.sectionId} value={section.sectionId}>{section.name}</option>
        ))}
      </Dropdown>

      <InputField
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        // disabled={articleStatus === 'pending'}
      />
      <InputField
        type="text"
        placeholder="Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
    
      />

      <DropzoneArea {...getRootProps()}>
        <TextArea
          id="articleContent"
          placeholder="Write your article content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DropzoneArea>

      <ImagePreviewBox>
        {images.map((image, index) => (
          <ImagePreviewContainer key={index}>
            <ImagePreview
              src={'https://api.thegachonherald.com/image?path=' + image}
              alt={`Uploaded ${image}`}
              onClick={() => handleSetMainImage(image)}
              isMain={mainImage === image}  
            />
            {mainImage === image && (
              <MainImageLabel>메인 이미지</MainImageLabel>
            )}
            <DeleteButton
              visible={true}
              onClick={() => handleImageDelete(image)}
            >
              X
            </DeleteButton>
            {/* <MainImageButton onClick={() => handleSetMainImage(image)}>
              메인 이미지로 설정
            </MainImageButton> */}
          </ImagePreviewContainer>
        ))}
      </ImagePreviewBox>

      <Button onClick={handleSave}>작성 완료</Button>
    </Container>
  );
};

export default AddArticleContent;
