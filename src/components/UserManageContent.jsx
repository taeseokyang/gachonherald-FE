import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 20px 80px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #3e5977;
`;

const PageTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
`;

/* ─── Table ─── */
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 140px 48px 80px 110px 130px 40px;
  gap: 12px;
  padding: 8px 12px;
  background: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  margin-bottom: 4px;
`;

const ColLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9b9b9b;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 140px 48px 80px 110px 130px 40px;
  gap: 12px;
  padding: 13px 12px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;

  &:hover { background: #fafafa; }
`;

const PositionSelect = styled.select`
  padding: 4px 6px;
  font-size: 12px;
  font-weight: 600;
  color: #3e5977;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  background: #ffffff;
  width: 100%;
`;

const CellText = styled.div`
  font-size: 13px;
  color: #444444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GenBadge = styled.div`
  display: inline-block;
  padding: 2px 7px;
  background: #f0f0f0;
  color: #555555;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
`;

const ActiveDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $active }) => ($active ? '#3e5977' : '#e0e0e0')};
  margin: 0 auto;
  title: ${({ $active }) => ($active ? '현직' : '전직')};
`;

/* ─── Pagination ─── */
const Pages = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  gap: 6px;
`;

const PageNumber = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 13px;
  font-weight: ${({ $on }) => ($on ? 700 : 400)};
  color: ${({ $on }) => ($on ? '#ffffff' : '#555555')};
  background: ${({ $on }) => ($on ? '#3e5977' : 'transparent')};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  &:hover { background: ${({ $on }) => ($on ? '#3e5977' : '#f0f0f0')}; color: ${({ $on }) => ($on ? '#ffffff' : '#3e5977')}; }
`;

const statusOptions = ['Editor In Chief', 'Head Of Administration', 'Education Director', 'Regular Reporter', 'Intern Reporter', 'Pending'];

const positionLabelToKorean = {
  "Editor In Chief": "편집국장",
  "Head Of Administration": "총무부장",
  "Education Director": "교육부장",
  "Regular Reporter": "정기자",
  "Intern Reporter": "수습기자",
  "Pending": "미정",
};

const positionLabelToEnum = {
  "Editor In Chief": "EDITOR_IN_CHIEF",
  "Head Of Administration": "HEAD_OF_ADMINISTRATION",
  "Education Director": "EDUCATION_DIRECTOR",
  "Regular Reporter": "REGULAR_REPORTER",
  "Intern Reporter": "INTERN_REPORTER",
  "Pending": "PENDING",
};

const UserManageContent = () => {
  const [cookie] = useCookies();
  const [users, setUsers] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page');

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(process.env.REACT_APP_BACK_URL + "/account/list/all?pageNumber=" + (page - 1))
      .then(r => {
        setUsers(r.data.data.reporters);
        setPageNumbers(Array.from({ length: r.data.data.pageCount }, (_, i) => i + 1));
      })
      .catch(console.error);
  }, [page]);

  const handlePositionChange = async (userId, newLabel) => {
    const newPosition = positionLabelToEnum[newLabel];
    if (!newPosition) return;
    try {
      const r = await axios.patch(
        `${process.env.REACT_APP_BACK_URL}/account/position/${userId}?position=${newPosition}`,
        {},
        { headers: { Authorization: `Bearer ${cookie.accessToken}` } }
      );
      if (r.status === 200) {
        setUsers(prev => prev.map(u => u.reporterId === userId ? { ...u, position: newLabel } : u));
      }
    } catch (e) { console.error(e); }
  };

  return (
    <Container>
      <Header>
        <PageTitle>기자 관리</PageTitle>
      </Header>

      <TableHeader>
        <ColLabel>직책</ColLabel>
        <ColLabel>기수</ColLabel>
        <ColLabel>이름</ColLabel>
        <ColLabel>영문명</ColLabel>
        <ColLabel>전화번호</ColLabel>
        <ColLabel>현직</ColLabel>
      </TableHeader>

      {users.map(user => (
        <Row key={user.reporterId}>
          <PositionSelect
            value={user.position}
            onChange={e => handlePositionChange(user.reporterId, e.target.value)}
          >
            {statusOptions.map(s => (
              <option key={s} value={s}>{positionLabelToKorean[s]}</option>
            ))}
          </PositionSelect>

          <GenBadge>{user.generation}</GenBadge>
          <CellText>{user.name}</CellText>
          <CellText>{user.nickname}</CellText>
          <CellText>{user.phone}</CellText>
          <ActiveDot $active={user.isCurrentMember} title={user.isCurrentMember ? '현직' : '전직'} />
        </Row>
      ))}

      {pageNumbers.length > 1 && (
        <Pages>
          {pageNumbers.map(number => (
            <Link to={"/manage/user?page=" + number} key={number}>
              <PageNumber $on={page == number}>{number}</PageNumber>
            </Link>
          ))}
        </Pages>
      )}
    </Container>
  );
};

export default UserManageContent;
