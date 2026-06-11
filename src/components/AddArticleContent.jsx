import axios from 'axios';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

/* ─── Layout ─── */
const EditorLayout = styled.div`
  display: flex;
  flex-direction: row;
  min-height: calc(100vh - 120px);
`;

const EditorPanel = styled.div`
  flex: 1;
  min-width: 0;
  padding: 28px 32px;
  border-right: 1px solid #e8e8e8;
  overflow-y: auto;
`;

const PreviewPanel = styled.div`
  width: 420px;
  flex-shrink: 0;
  padding: 28px 32px;
  background: #fafafa;
  overflow-y: auto;

  @media (max-width: 900px) { display: none; }
`;

/* ─── Editor controls ─── */
const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StatusBadge = styled.div`
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  background: #e8f0f8;
  color: #2e5a8a;
`;

const StatusToggle = styled.div`
  display: flex;
  gap: 0;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  overflow: hidden;
`;

const ToggleBtn = styled.button`
  padding: 7px 16px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: ${({ $active }) => ($active ? '#3e5977' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#555555')};
  transition: background 0.15s, color 0.15s;
  &:hover { background: ${({ $active }) => ($active ? '#3e5977' : '#f5f5f5')}; }
`;

const SectionSelect = styled.select`
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #3e5977;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  outline: none;
  background: #ffffff;
  cursor: pointer;
`;

const SaveButton = styled.button`
  margin-left: auto;
  padding: 8px 22px;
  background: #3e5977;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #2e4666; }
`;

/* ─── Text inputs ─── */
const TitleInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  border: none;
  border-bottom: 2px solid #f0f0f0;
  outline: none;
  padding: 10px 0;
  margin-bottom: 8px;
  background: transparent;
  transition: border-color 0.15s;
  &:focus { border-color: #3e5977; }
  &::placeholder { color: #d0d0d0; font-weight: 700; }
`;

const SubtitleInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  font-size: 16px;
  font-weight: 400;
  color: #555555;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  outline: none;
  padding: 8px 0;
  margin-bottom: 16px;
  background: transparent;
  transition: border-color 0.15s;
  &:focus { border-color: #3e5977; }
  &::placeholder { color: #d0d0d0; }
`;

/* ─── Toolbar ─── */
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 10px;
  background: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 6px 6px 0 0;
  margin-bottom: 0;
`;

const ToolBtn = styled.button`
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 700;
  color: #555555;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #eeeeee; color: #1a1a1a; }
`;

const ToolDivider = styled.div`
  width: 1px;
  height: 16px;
  background: #d8d8d8;
  margin: 0 4px;
`;

const ToolIcon = styled.img`
  width: 14px;
  height: 14px;
`;

/* ─── Textarea ─── */
const DropzoneArea = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

const ContentArea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 560px;
  padding: 16px;
  font-size: 15px;
  line-height: 1.75;
  color: #1a1a1a;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-radius: 0 0 6px 6px;
  outline: none;
  resize: vertical;
  font-family: inherit;
  background: #ffffff;
  &::placeholder { color: #c0c0c0; }
`;

/* ─── Image area ─── */
const ImageSection = styled.div`
  margin-top: 20px;
`;

const ImageSectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9b9b9b;
  margin-bottom: 10px;
`;

const ImageGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImageItem = styled.div`
  position: relative;
`;

const ImageThumb = styled.img`
  height: 90px;
  width: auto;
  border-radius: 6px;
  border: 2px solid ${({ $isMain }) => ($isMain ? '#3e5977' : '#e8e8e8')};
  cursor: pointer;
  object-fit: cover;
  transition: border-color 0.15s;
`;

const MainLabel = styled.div`
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(62,89,119,0.85);
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(0,0,0,0.5);
  color: #ffffff;
  border: none;
  border-radius: 50%;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  &:hover { background: rgba(0,0,0,0.75); }
`;

/* ─── Preview ─── */
const PreviewLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #9b9b9b;
  margin-bottom: 20px;
`;

const PreviewSection = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3e5977;
  margin-bottom: 6px;
`;

const PreviewTitle = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.25;
  margin-bottom: 6px;
`;

const PreviewSubtitle = styled.div`
  font-size: 16px;
  color: #6b6b6b;
  line-height: 1.4;
  margin-bottom: 16px;
`;

const PreviewMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 20px;
  font-size: 13px;
  color: #555555;
`;

const PreviewBody = styled.div`
  font-size: 15px;
  line-height: 1.8;
  color: #1a1a1a;
  white-space: pre-line;
  & img { display: block; margin: 20px auto; width: 100%; object-fit: contain; }
`;

/* ─────────────────────────────── */

const AddArticleContent = () => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [sectionId, setSectionId] = useState(2);
  const [mainImage, setMainImage] = useState('');
  const [images, setImages] = useState([]);
  const [sections, setSections] = useState([]);
  const [articleStatus, setArticleStatus] = useState('EDITING');
  const [cookie, , removeCookie] = useCookies();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(process.env.REACT_APP_BACK_URL + "/sections/list")
      .then(r => setSections(r.data.data.activeSections))
      .catch(console.error);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => files.forEach(handleImageUpload),
    accept: 'image/*',
    noClick: true,
  });

  const handleImageUpload = (file) => {
    const fd = new FormData();
    fd.append('pic', file);
    axios.post('https://api.thegachonherald.com/image', fd)
      .then(r => {
        const name = r.data.data.imageName;
        setImages(prev => [...prev, name]);
        insertImageAtCursor(name);
      })
      .catch(console.error);
  };

  const insertImageAtCursor = (imageName) => {
    const ta = document.getElementById('articleContent');
    const pos = ta.selectionStart;
    const tag = `<img src="https://api.thegachonherald.com/image?path=${imageName}" />`;
    setContent(prev => prev.slice(0, pos) + tag + prev.slice(pos));
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = pos + tag.length; ta.focus(); }, 0);
  };

  const applyTag = (tag) => {
    const ta = document.getElementById('articleContent');
    const s = ta.selectionStart, e = ta.selectionEnd;
    const selected = content.slice(s, e);
    if (!selected) return;
    const wrapped = `<${tag}>${selected}</${tag}>`;
    setContent(content.slice(0, s) + wrapped + content.slice(e));
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + wrapped.length; ta.focus(); }, 0);
  };

  const getTodayDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getSectionName = (id) => (sections.find(s => s.sectionId == id) || {}).name || '';

  const handleStatusChange = (s) => {
    if (s === 'PENDING' && !window.confirm("승인 신청 시 더 이상 기사를 수정할 수 없습니다.")) return;
    setArticleStatus(s);
  };

  const handleSave = async () => {
    if (images.length !== 0 && mainImage === '') { alert("메인 이미지를 선택하세요."); return; }
    try {
      await axios.post(`${process.env.REACT_APP_BACK_URL}/articles`, { title, subtitle, content, mainImage, sectionId, status: articleStatus }, { headers: { Authorization: `Bearer ${cookie.accessToken}` } });
      alert("작성 완료되었습니다.");
      navigate("/workspace");
    } catch {
      ['accessToken', 'userId', 'id', 'nickname', 'roles'].forEach(k => removeCookie(k, { path: '/' }));
      navigate("/Login");
    }
  };

  return (
    <EditorLayout>
      <EditorPanel>
        <TopBar>
          <StatusBadge>EDITING</StatusBadge>
          <StatusToggle>
            <ToggleBtn $active={articleStatus === 'EDITING'} onClick={() => handleStatusChange('EDITING')}>기사 작성</ToggleBtn>
            <ToggleBtn $active={articleStatus === 'PENDING'} onClick={() => handleStatusChange('PENDING')}>승인 신청</ToggleBtn>
          </StatusToggle>
          <SectionSelect value={sectionId} onChange={e => setSectionId(e.target.value)}>
            {sections.map(s => <option key={s.sectionId} value={s.sectionId}>{s.name}</option>)}
          </SectionSelect>
          <SaveButton onClick={handleSave}>작성 완료</SaveButton>
        </TopBar>

        <TitleInput placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <SubtitleInput placeholder="Subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} />

        <Toolbar>
          <ToolBtn onClick={() => applyTag('H1')}>H1</ToolBtn>
          <ToolBtn onClick={() => applyTag('H2')}>H2</ToolBtn>
          <ToolBtn onClick={() => applyTag('H3')}>H3</ToolBtn>
          <ToolDivider />
          <ToolBtn onClick={() => applyTag('strong')}><ToolIcon src="/images/bold.svg" /></ToolBtn>
          <ToolBtn onClick={() => applyTag('em')}><ToolIcon src="/images/italic.svg" /></ToolBtn>
        </Toolbar>

        <DropzoneArea {...getRootProps()}>
          <input {...getInputProps()} />
          <ContentArea
            id="articleContent"
            placeholder="Write your article here... (drag & drop images to upload)"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </DropzoneArea>

        {images.length > 0 && (
          <ImageSection>
            <ImageSectionLabel>Images — click to set as main</ImageSectionLabel>
            <ImageGrid>
              {images.map((img, i) => (
                <ImageItem key={i}>
                  <ImageThumb
                    src={`https://api.thegachonherald.com/image?path=${img}`}
                    $isMain={mainImage === img}
                    onClick={() => setMainImage(img)}
                    alt=""
                  />
                  {mainImage === img && <MainLabel>Main</MainLabel>}
                  <DeleteBtn onClick={() => { setImages(prev => prev.filter(x => x !== img)); if (mainImage === img) setMainImage(''); }}>×</DeleteBtn>
                </ImageItem>
              ))}
            </ImageGrid>
          </ImageSection>
        )}
      </EditorPanel>

      <PreviewPanel>
        <PreviewLabel>Preview</PreviewLabel>
        <PreviewSection>{getSectionName(sectionId)}</PreviewSection>
        <PreviewTitle>{title || "Article Title"}</PreviewTitle>
        <PreviewSubtitle>{subtitle}</PreviewSubtitle>
        <PreviewMeta>
          <span>By {cookie.nickname}</span>
          <span style={{ color: '#9b9b9b', fontSize: 12 }}>{getTodayDate()}</span>
        </PreviewMeta>
        <PreviewBody dangerouslySetInnerHTML={{ __html: content }} />
      </PreviewPanel>
    </EditorLayout>
  );
};

export default AddArticleContent;
