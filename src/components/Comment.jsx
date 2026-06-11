import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { ThinContainer, ContentFit } from "./StyledComponents";
import { useState, useEffect } from "react";
import axios from "axios";

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3e5977;
  margin-bottom: 4px;
`;

const CommentTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  padding-bottom: 14px;
  margin-bottom: 20px;
  border-bottom: 2px solid #3e5977;
`;

const CommentInputBox = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 28px;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  background: #ffffff;
  color: #1a1a1a;
  transition: border-color 0.15s;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};

  &:focus {
    border-color: #3e5977;
  }

  &::placeholder {
    color: #aaaaaa;
  }
`;

const SubmitButton = styled.button`
  padding: 0 20px;
  height: 40px;
  background: #3e5977;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #2d3f52;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const CommentBox = styled.div`
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-of-type {
    border-bottom: none;
  }
`;

const CommentTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const Commenter = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #1a1a1a;
`;

const CommentContent = styled.div`
  font-size: 14px;
  color: #444444;
  line-height: 1.55;
  margin-bottom: 4px;
`;

const CommentDate = styled.div`
  font-size: 12px;
  color: #9b9b9b;
`;

const DeleteButton = styled.button`
  padding: 0;
  background: none;
  border: none;
  font-size: 12px;
  color: #9b9b9b;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #d9534f;
  }
`;

const Pages = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const PageNumber = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-size: 13px;
  font-weight: ${({ $on }) => ($on ? 700 : 400)};
  color: ${({ $on }) => ($on ? "#ffffff" : "#555555")};
  background: ${({ $on }) => ($on ? "#3e5977" : "transparent")};
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ $on }) => ($on ? "#3e5977" : "#f0f0f0")};
    color: ${({ $on }) => ($on ? "#ffffff" : "#3e5977")};
  }
`;

const Comment = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [cookie] = useCookies();
  const [page, setPage] = useState(0);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACK_URL +
          "/comments/" +
          articleId +
          "?pageNumber=" +
          page
      );
      setComments(response.data.data.comments);
      setPageNumbers(
        Array.from({ length: response.data.data.pageCount }, (_, i) => i + 1)
      );
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  useEffect(() => { fetchData(); }, [articleId]);
  useEffect(() => { fetchData(); }, [page]);

  const handleCommentSubmit = async () => {
    if (!content) return;
    try {
      await axios.post(
        `${process.env.REACT_APP_BACK_URL}/comments`,
        { articleId, content },
        { headers: { Authorization: `Bearer ${cookie.accessToken}` } }
      );
      setContent("");
      setPage(0);
      fetchData();
    } catch (error) {
      navigate("/");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACK_URL}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${cookie.accessToken}` } }
      );
      fetchData();
    } catch (error) {
      navigate("/");
    }
  };

  return (
    <ThinContainer>
      <ContentFit>
        <CommentTitle>Comments</CommentTitle>

        <CommentInputBox>
          <CommentInput
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              cookie.accessToken != null
                ? "Write a comment..."
                : "Please log in to write a comment."
            }
            disabled={cookie.accessToken == null}
            isDisabled={cookie.accessToken == null}
            onKeyDown={(e) => e.key === "Enter" && handleCommentSubmit()}
          />
          <SubmitButton
            onClick={handleCommentSubmit}
            disabled={cookie.accessToken == null}
          >
            Submit
          </SubmitButton>
        </CommentInputBox>

        {comments.map((comment) => (
          <CommentBox key={comment.commentId}>
            <CommentTop>
              <Commenter>{comment.commenterNickname}</Commenter>
              {cookie.id == comment.commenterId && (
                <DeleteButton onClick={() => handleDeleteComment(comment.commentId)}>
                  Delete
                </DeleteButton>
              )}
            </CommentTop>
            <CommentContent>{comment.content}</CommentContent>
            <CommentDate>{comment.createdAt.slice(0, 10)}</CommentDate>
          </CommentBox>
        ))}

        {comments.length > 0 && (
          <Pages>
            {pageNumbers.map((number) => (
              <PageNumber
                key={number}
                $on={page + 1 === number}
                onClick={() => setPage(number - 1)}
              >
                {number}
              </PageNumber>
            ))}
          </Pages>
        )}
      </ContentFit>
    </ThinContainer>
  );
};

export default Comment;
