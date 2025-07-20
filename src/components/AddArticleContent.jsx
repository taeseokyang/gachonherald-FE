import axios from 'axios';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Content } from "./StyledComponents";


const BigContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Container = styled.div`
  padding: 20px;
  flex: 1;
  //max-width: 800px;
  /* margin: 0 auto; */
  border-right: 5px solid #f5f5f5;
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
const ToolIcon = styled.img`
  cursor: pointer;
  width: 18px;
  margin-right: 15px;
  padding: 5px;
  /* background-color: #f5f5f5; */
  border-radius: 5px;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ToolText = styled.span`
  cursor: pointer;
  margin-right: 15px;
  font-size: 18px;
  padding: 5px;
  /* background-color: #f5f5f5; */
  border-radius: 5px;
  font-weight: 700;
  color: #828282;
  &:hover {
    background-color: #f5f5f5;
  }
`;


const Tools = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;    
`;


const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #bcbcbc;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: ${props => (props.visible ? 'block' : 'none')};
  &:hover {
    background: #eeeeee;
  }
  padding: 0px;
`;

const XIcon = styled.img`

width: 80%;
height: 80%;
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
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 7px;
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
  /* float: right; */
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
  margin-top: 20px;
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





const ArticleTitle = styled.div`
  margin-top: 10px;
  color: #000000;
  font-size: 30px;
  font-weight: 700;
  line-height: 100%;
`;
const ArticleSubTitle = styled.div`
  margin-top: 10px;
  color: #828282;
  font-size: 18px;
  font-weight: 500;
  line-height: 100%;
`;

const ArticleBody = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  font-size: 16px;
  font-weight: 500;
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
  font-weight: 600;
  /* margin-left: 10px; */
`;

const PublishedDate = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #bcbcbc;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #3E5977;
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

const applyTagToSelection = (tagName) => {
  const textarea = document.getElementById('articleContent');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = content.substring(start, end);

  if (!selectedText) return; // 선택한 텍스트가 없으면 무시

  const beforeText = content.substring(0, start);
  const afterText = content.substring(end);

  const tagWrapped = `<${tagName}>${selectedText}</${tagName}>`;

  const updatedContent = beforeText + tagWrapped + afterText;
  setContent(updatedContent);

  // 커서 위치 업데이트
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + tagWrapped.length;
    textarea.focus();
  }, 0);
};




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
      alert("작성 완료되었습니다.");
      navigate("/workspace");
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
    <BigContainer>
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

 <Tools>
          <ToolText onClick={() => applyTagToSelection('H1')} title="h1">H1</ToolText>
          <ToolText onClick={() => applyTagToSelection('H2')} title="h2">H2</ToolText>
          <ToolText onClick={() => applyTagToSelection('H3')} title="h3">H3</ToolText>
          <ToolIcon src="/images/bold.svg" onClick={() => applyTagToSelection('strong')} title="굵게" />
          <ToolIcon src="/images/italic.svg" onClick={() => applyTagToSelection('em')} title="기울임" />
        </Tools>

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
              <XIcon src="/images/x.svg"></XIcon>
            </DeleteButton>
          </ImagePreviewContainer>
        ))}
      </ImagePreviewBox>

      <Button onClick={handleSave}>작성 완료</Button>
    </Container>

     <Container>
          <SectionTitle>{getSectionNameById(sectionId,sections)}</SectionTitle>
            
            <ArticleTitle>{title}</ArticleTitle>
            <ArticleSubTitle>{subtitle}</ArticleSubTitle>
            {/* <Separator></Separator> */}
            <InfoBox>
                <ReporterBox>
    
    
    
                  {/* <ReporterImg>
    
                  </ReporterImg> */}
                  <ReporterName>
                    By {cookie.nickname}
                  </ReporterName>
    
                </ReporterBox>
              <PublishedDate>{getTodayDate()}</PublishedDate>
            </InfoBox>
            <ArticleBody isOldArticle={false} dangerouslySetInnerHTML={{ __html: content }}>
            </ArticleBody>
        </Container>
        </BigContainer>
  );
};

export default AddArticleContent;
