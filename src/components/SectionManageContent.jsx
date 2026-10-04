import axios from 'axios';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import AdminHeading from "./AdminHeading";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 20px 80px;
`;

const GroupTitle = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3e5977;
  margin: 36px 0 12px;
`;

const Hint = styled.div`
  font-size: 12px;
  color: #9b9b9b;
  margin: -6px 0 12px;
`;

const EmptyState = styled.div`
  padding: 24px 0;
  text-align: center;
  color: #9b9b9b;
  font-size: 14px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 12px;
  border-bottom: 1px solid #f0f0f0;
  &:hover { background: #fafafa; }
`;

const OrderNum = styled.div`
  width: 20px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  color: #9b9b9b;
  text-align: center;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ $muted }) => ($muted ? '#9b9b9b' : '#1a1a1a')};
`;

const Desc = styled.div`
  margin-top: 3px;
  font-size: 12.5px;
  color: ${({ $empty }) => ($empty ? '#c0c0c0' : '#888888')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const SmallBtn = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $danger }) => ($danger ? '#c0392b' : '#3e5977')};
  background: #ffffff;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.15s;
  &:hover:not(:disabled) { border-color: ${({ $danger }) => ($danger ? '#c0392b' : '#3e5977')}; }
  &:disabled { color: #d0d0d0; cursor: default; }
`;

const PrimaryBtn = styled.button`
  padding: 8px 18px;
  background: #3e5977;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #2e4666; }
  &:disabled { background: #9fb0c2; cursor: default; }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

const Input = styled.input`
  padding: 8px 10px;
  font-size: 13px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  outline: none;
  &:focus { border-color: #3e5977; }
`;

const AddBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
`;

const NoAccess = styled.div`
  padding: 80px 0;
  text-align: center;
  color: #9b9b9b;
  font-size: 14px;
`;

const SectionManageContent = () => {
  const [cookie] = useCookies();
  const [activeSections, setActiveSections] = useState([]);
  const [inactiveSections, setInactiveSections] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [busy, setBusy] = useState(false);

  const authHeader = { headers: { Authorization: `Bearer ${cookie.accessToken}` } };

  const fetchSections = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_BACK_URL + "/sections/list");
      setActiveSections(response.data.data.activeSections);
      setInactiveSections(response.data.data.inactiveSections);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const run = async (request, failMessage) => {
    setBusy(true);
    try {
      await request();
      await fetchSections();
      return true;
    } catch (error) {
      console.error("오류 발생:", error);
      alert(failMessage);
      await fetchSections();
      return false;
    } finally {
      setBusy(false);
    }
  };

  const addSection = async () => {
    if (!newName.trim()) return;
    const ok = await run(
      () => axios.post(process.env.REACT_APP_BACK_URL + "/sections", { name: newName, description: newDesc }, authHeader),
      "섹션을 만들지 못했습니다. 이름이 비어 있거나 이미 있는 이름인지 확인해주세요."
    );
    if (ok) { setNewName(''); setNewDesc(''); }
  };

  const startEdit = (section) => {
    setEditingId(section.sectionId);
    setEditName(section.name);
    setEditDesc(section.description || '');
  };

  const saveEdit = async () => {
    const ok = await run(
      () => axios.patch(process.env.REACT_APP_BACK_URL + "/sections/" + editingId, { name: editName, description: editDesc }, authHeader),
      "수정하지 못했습니다. 이름이 비어 있거나 이미 있는 이름인지 확인해주세요."
    );
    if (ok) setEditingId(null);
  };

  const changeStatus = (section, status) => {
    const message = status === 'INACTIVE'
      ? `'${section.name}' 섹션을 아카이브로 보낼까요? 네비게이션에서 빠지고, 기사는 아카이브 페이지에서 계속 볼 수 있습니다.`
      : `'${section.name}' 섹션을 복원할까요? 네비게이션 맨 뒤에 추가됩니다.`;
    if (!window.confirm(message)) return;
    run(
      () => axios.patch(process.env.REACT_APP_BACK_URL + "/sections/" + section.sectionId + "/status?status=" + status, null, authHeader),
      "상태를 변경하지 못했습니다."
    );
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= activeSections.length) return;
    const reordered = [...activeSections];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setActiveSections(reordered);
    run(
      () => axios.patch(process.env.REACT_APP_BACK_URL + "/sections/order", { sectionIds: reordered.map(s => s.sectionId) }, authHeader),
      "순서를 변경하지 못했습니다."
    );
  };

  if (cookie.roles !== 'ADMIN') {
    return <Container><NoAccess>관리자만 접근할 수 있습니다.</NoAccess></Container>;
  }

  const renderEditForm = () => (
    <>
      <Form>
        <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="섹션 이름" />
        <Input value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="네비게이션 설명 (마우스를 올리면 표시)" />
      </Form>
      <Actions>
        <SmallBtn onClick={saveEdit} disabled={busy || !editName.trim()}>저장</SmallBtn>
        <SmallBtn onClick={() => setEditingId(null)} disabled={busy}>취소</SmallBtn>
      </Actions>
    </>
  );

  const renderInfo = (section, muted) => (
    <Info>
      <Name $muted={muted}>{section.name}</Name>
      <Desc $empty={!section.description}>{section.description || "설명 없음"}</Desc>
    </Info>
  );

  return (
    <Container>
      <AdminHeading title="섹션 관리" />

      <GroupTitle>새 섹션</GroupTitle>
      <AddBox>
        <Form>
          <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="섹션 이름 (예: Culture)" />
          <Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="네비게이션 설명 (선택)" />
        </Form>
        <PrimaryBtn onClick={addSection} disabled={busy || !newName.trim()}>추가</PrimaryBtn>
      </AddBox>

      <GroupTitle>활성 섹션</GroupTitle>
      <Hint>네비게이션과 홈 화면에 이 순서대로 표시됩니다.</Hint>
      {activeSections.length === 0 && <EmptyState>활성 섹션이 없습니다.</EmptyState>}
      {activeSections.map((section, index) => (
        <Row key={section.sectionId}>
          <OrderNum>{index + 1}</OrderNum>
          {editingId === section.sectionId ? renderEditForm() : (
            <>
              {renderInfo(section, false)}
              <Actions>
                <SmallBtn onClick={() => move(index, -1)} disabled={busy || index === 0}>↑</SmallBtn>
                <SmallBtn onClick={() => move(index, 1)} disabled={busy || index === activeSections.length - 1}>↓</SmallBtn>
                <SmallBtn onClick={() => startEdit(section)} disabled={busy}>수정</SmallBtn>
                <SmallBtn $danger onClick={() => changeStatus(section, 'INACTIVE')} disabled={busy}>아카이브</SmallBtn>
              </Actions>
            </>
          )}
        </Row>
      ))}

      <GroupTitle>아카이브</GroupTitle>
      {inactiveSections.length === 0 && <EmptyState>아카이브된 섹션이 없습니다.</EmptyState>}
      {inactiveSections.map((section) => (
        <Row key={section.sectionId}>
          {editingId === section.sectionId ? renderEditForm() : (
            <>
              {renderInfo(section, true)}
              <Actions>
                <SmallBtn onClick={() => startEdit(section)} disabled={busy}>수정</SmallBtn>
                <SmallBtn onClick={() => changeStatus(section, 'ACTIVE')} disabled={busy}>복원</SmallBtn>
              </Actions>
            </>
          )}
        </Row>
      ))}
    </Container>
  );
};

export default SectionManageContent;
