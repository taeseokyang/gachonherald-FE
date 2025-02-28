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
  margin-left: 10px;
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

const UpdateArticleContent = () => {
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
        if (response.data.data.mainImage != ''){
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

  // react-dropzone 설정
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        handleImageUpload(file);
      });
    },
    accept: 'image/*', // 이미지 파일만 업로드 가능
  });

  // 이미지 이름을 커서 위치에 삽입하는 함수
  const handleImageDrag = (imageName) => {
    const textarea = document.getElementById('articleContent');
    const cursorPosition = textarea.selectionStart;

    const beforeText = content.substring(0, cursorPosition);
    const afterText = content.substring(cursorPosition);

    const imgTag = `<img src="${process.env.REACT_APP_BACK_URL}/image?path=${imageName}" />`;
    setContent(beforeText + imgTag + afterText);

    setTimeout(() => {
      textarea.selectionStart = cursorPosition + imgTag.length;
      textarea.selectionEnd = textarea.selectionStart;
      textarea.focus();
    }, 0);
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (imageName) => {
    setImages((prev) => prev.filter((image) => image !== imageName));
  };

  // 메인 이미지 설정 핸들러
  const handleSetMainImage = (imageName) => {
    setMainImage(imageName);
  };

  const handleSave = async () => {

    if (images.length != 0 && mainImage == "") {
      alert("메인 이미지를 선택하세요.");
      return; 
    }

    try {
      await axios.patch(`${process.env.REACT_APP_BACK_URL}/articles`, {
        articleId,
        title,
        subtitle,
        mainImage,
        content,
        sectionId,
        status: status,
      }, {
        headers: {
          Authorization: `Bearer ${cookie.accessToken}`,
        },
      });
      // navigate("/article/"+articleId);
      alert("수정 완료되었습니다.");
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
  const handleDelete = async () => {

    const isConfirmed = window.confirm("작성중인 기사를 삭제 하시겠습니까?");
  
    if (!isConfirmed) {
      return; 
    }

    try {
      await axios.delete(`${process.env.REACT_APP_BACK_URL}/articles/${articleId}`, {
        headers: {
          Authorization: `Bearer ${cookie.accessToken}`,
        },
      });
      alert("삭제 되었습니다.");
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
        setStatus(status);
      }
    } else {
      setStatus(status);
    }
  };

  return (
    <Container>
      <StatusLabel>{articleStatus}</StatusLabel>
      {
        articleStatus == "EDITING" ?
      
      <RadioButtonGroup>
        <RadioButton>
          <input
            type="radio"
            id="draft"
            name="articleStatus"
            value="EDITING"
            checked={status === 'EDITING'}
            onChange={() => handleStatusChange('EDITING')}
          />
          <span>기사 작성</span>
        </RadioButton>
        <RadioButton>
          <input
            type="radio"
            id="pending"
            name="articleStatus"
            value="PENDING"
            checked={status === 'PENDING'}
            onChange={() => handleStatusChange('PENDING')}
          />
          <span>승인 신청</span>
        </RadioButton>
      </RadioButtonGroup>:null
}
      <Dropdown disabled={articleStatus === 'PENDING'} value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
        {sections.map((section) => (
          <option key={section.sectionId} value={section.sectionId}>{section.name}</option>
        ))}
      </Dropdown>

      <InputField
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={articleStatus === 'PENDING'}
      />
      <InputField
        type="text"
        placeholder="Subtitle"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        disabled={articleStatus === 'PENDING'}
      />

      <DropzoneArea {...getRootProps()}>
        <TextArea
          id="articleContent"
          placeholder="Write your article content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={articleStatus === 'PENDING'}
        />
      </DropzoneArea>

      {/* 업로드된 이미지 미리보기 */}
      <ImagePreviewBox>
        {images.map((image, index) => (
          <ImagePreviewContainer key={index}>
            <ImagePreview
              src={'https://api.thegachonherald.com/image?path=' + image}
              alt={`Uploaded ${image}`}
              onClick={() => handleSetMainImage(image)}
              isMain={mainImage === image}  // 메인 이미지 강조
            />
            {mainImage === image && (
              <MainImageLabel>메인 이미지</MainImageLabel> // 메인 이미지 레이블
            )}
            <DeleteButton
              visible={true}
              onClick={() => handleImageDelete(image)}
            >
              X
            </DeleteButton>
          </ImagePreviewContainer>
        ))}
      </ImagePreviewBox>

      {/* 기사 저장 버튼 */}
      {articleStatus != 'PENDING' ? 
      <>
      <Button onClick={handleSave}>수정완료</Button>
      <Button style={{ backgroundColor: "#bcbcbc" }} onClick={handleDelete}>삭제하기</Button>
      </>
      
      : null }
    </Container>
  );
};

export default UpdateArticleContent;
