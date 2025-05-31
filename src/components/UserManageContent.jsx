import axios from 'axios';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Button = styled.div`
  margin-top: 10px;
  padding: 20px 0px;
  border-radius: 10px;
  font-weight: 700;
  background-color: #eeeeee;
  text-align: center;
  color: #828282;
  border: none;
  cursor: pointer;
`;

const Title = styled.div`
  padding: 5px 0px;
  font-weight: 700;
  font-size: 16px;
  border-bottom: 3px solid #3e5977;
  color: #3e5977;
  cursor: pointer;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 50px;
`;

const Article = styled.li`
  padding-bottom: 5px;
  display: flex;
  align-items: center;
`;

const ArticleInfo = styled.div`
  flex: 1;
  display: flex;
  white-space: nowrap;
  overflow: hidden;
`;

const Status = styled.div`
  
  font-size: 14px;
  margin-right: 10px;
  font-weight: 700;
  & select{
    font-size: 12px;
    font-weight: 500;
    border: none;
    outline: none;
    background: #eeeeee;
    border-radius: 5px;
    padding: 2px 5px;
  }
`;

const Info = styled.div`
  border-radius: 5px;
  color: #828282;
  font-size: 14px;
  font-weight: 700;
  margin-left: 10px;
  cursor: pointer;
`;

const ArticleTitle = styled.div`
  width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const EditorsPick = styled.div`
  margin-left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #828282;
  background-color: ${props => props.checked ? '#3E5977' : 'white'};
  cursor: pointer;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  
  ::before {
    content: '';
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.checked ? 'white' : 'transparent'};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Pages = styled.div`
  /* margin-top: 50px; */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
`;

const PageNumber = styled.div`
  font-weight: ${({ isOn }) => (isOn ? '700' : '500')};
  color: ${({ isOn }) => (isOn ? '#3E5977' : '#bcbcbc')};
  display: flex;
  justify-content: center;
  align-items: center; 
  cursor: pointer;
`;

const UserManageContent = () => {
  const [cookie] = useCookies();
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [pageNumbers, setPageNumbers] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const page = queryParams.get('page'); // page 쿼리 파라미터 가져오기

  const statusOptions = ['Editor In Chief', 'Head Of Administration','Education Director','Regular Reporter','Intern Reporter','Pending'];

  const positionLabelToKorean = {
  "Editor In Chief": "편집국장",
  "Head Of Administration": "총무부장",
  "Education Director": "교육부장",
  "Regular Reporter": "정기자",
  "Intern Reporter": "수습기자",
  "Pending": "미정"  // or "PENDING" depending on enum
};

  // 상태 리스트 (예시로 'draft', 'published' 등)
  const positionLabelToEnum = {
  "Editor In Chief": "EDITOR_IN_CHIEF",
  "Head Of Administration": "HEAD_OF_ADMINISTRATION",
  "Education Director": "EDUCATION_DIRECTOR",
  "Regular Reporter": "REGULAR_REPORTER",
  "Intern Reporter": "INTERN_REPORTER",
  "Pending": "PENDING"  // or "PENDING" depending on enum
};

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/account/list/all?pageNumber=" + (page - 1));
        console.log(response);
        setUsers(response.data.data.reporters);
        setPageNumbers(Array.from({ length: response.data.data.pageCount }, (_, index) => index + 1));
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, [page]);

  // 상태 변경 처리 함수
 const handleStatusChange = async (userId, newLabel) => {
  const newPosition = positionLabelToEnum[newLabel];  // 변환
  if (!newPosition) {
    console.error("알 수 없는 포지션 라벨:", newLabel);
    return;
  }

  try {
    const response = await axios.patch(
      `${process.env.REACT_APP_BACK_URL}/account/position/${userId}?position=${newPosition}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${cookie.accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.reporterId === userId
            ? { ...user, position: newLabel }
            : user
        )
      );
    }
  } catch (error) {
    console.error("상태 변경 오류:", error);
  }
};

  const toggleCheck = async (articleId) => {
    try {
      // API 호출해서 체크 상태 변경
      const response = await axios.patch(process.env.REACT_APP_BACK_URL + "/articles/editor-pick/"+articleId, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${cookie.accessToken}`,
          },
        });

      // 응답 처리
      if (response.status === 200) {
        setArticles(prevArticles => 
          prevArticles.map(article => 
            article.articleId === articleId 
              ? { ...article, isEditorsPick: response.data.data.isEditorsPick } // 상태 업데이트
              : article
          )
        );
      }
    } catch (error) {
      console.error("체크 상태 변경 오류:", error);
    }
  };


  return (
    <Container>
      <Title>기자</Title>
      <List>
        {users.map((user) => (
          <Article key={user.reporterId}>
            <Status>
              <select
                value={user.position}
                onChange={(e) => handleStatusChange(user.reporterId, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {positionLabelToKorean[status]}
                  </option>
                ))}
              </select>
            </Status>
             <Link to={"/edit/" + user.reporterId}>
               
              </Link>
            <ArticleInfo>
              <ArticleTitle>{user.generation+'기'}</ArticleTitle>
               <ArticleTitle>{user.name}</ArticleTitle>
              <ArticleTitle>{user.nickname}</ArticleTitle>
              <ArticleTitle>{user.phone}</ArticleTitle>
            </ArticleInfo>

            <EditorsPick
              checked={user.isCurrentMember}
              // onClick={() => toggleCheck(article.articleId)}
            />
          </Article>
        ))}
      </List>
      <Pages>
        {pageNumbers.map((number) => (
          <Link to={"/manage/user?page=" + number} key={number}>
            <PageNumber isOn={page == number}>{number}</PageNumber>
          </Link>
        ))}
      </Pages>
    </Container>
  );
};

export default UserManageContent;