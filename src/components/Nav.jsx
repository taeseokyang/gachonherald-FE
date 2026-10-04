import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const NavWrapper = styled.nav`
  position: relative;
  background: #ffffff;
  border-top: 2px solid #3e5977;
  border-bottom: 1px solid #e8e8e8;
  z-index: 100;
  margin-bottom: 20px;
`;

const Inner = styled.div`
  margin: 0 auto;
  padding: 0 20px;
  max-width: 1200px;
  display: flex;
  align-items: center;
`;

const SectionBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  overflow-x: auto;
  ::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
`;

const SectionItem = styled.div`
  flex-shrink: 0;

  /* 넘칠 때 왼쪽이 잘리지 않도록 justify-content 대신 auto margin으로 가운데 정렬 */
  &:first-child { margin-left: auto; }
  &:last-child { margin-right: auto; }
`;

const SectionLink = styled(Link)`
  display: block;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 400;
  color: ${({ $active }) => ($active ? "#3e5977" : "#555555")};
  white-space: nowrap;
  transition: color 0.15s ease;
  border-bottom: 2px solid ${({ $active }) => ($active ? "#3e5977" : "transparent")};
  margin-bottom: -1px;

  &:hover {
    color: #3e5977;
  }

  @media (max-width: 600px) {
    padding: 10px 10px;
    font-size: 12px;
  }
`;

const DropPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid #e8e8e8;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: translateY(${({ $show }) => ($show ? "0px" : "-5px")});
  pointer-events: ${({ $show }) => ($show ? "auto" : "none")};
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 99;
`;

const DropInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 13px 34px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const DropName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #3e5977;
  white-space: nowrap;
`;

const DropDivider = styled.div`
  width: 1px;
  height: 12px;
  background: #d0d0d0;
  flex-shrink: 0;
`;

const DropDesc = styled.div`
  font-size: 12.5px;
  color: #888888;
`;

const Nav = () => {
  const [sections, setSections] = useState([]);
  const [hovered, setHovered] = useState(null);
  const lastHovered = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACK_URL + "/sections/list"
        );
        setSections(response.data.data.activeSections);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  const onEnter = (id) => {
    clearTimeout(hideTimer.current);
    setHovered(id);
    lastHovered.current = id;
  };

  const onLeave = () => {
    hideTimer.current = setTimeout(() => setHovered(null), 120);
  };

  const displaySection =
    sections.find((s) => s.sectionId === (hovered ?? lastHovered.current));

  return (
    <NavWrapper onMouseLeave={onLeave}>
      <Inner>
        <SectionBar>
          {sections.map((section) => (
            <SectionItem
              key={section.sectionId}
              onMouseEnter={() => onEnter(section.sectionId)}
            >
              <SectionLink
                to={"/section/" + section.sectionId + "?page=1"}
                $active={hovered === section.sectionId}
              >
                {section.name}
              </SectionLink>
            </SectionItem>
          ))}
        </SectionBar>
      </Inner>

      <DropPanel $show={!!hovered}>
        <DropInner>
          {displaySection && (
            <>
              <DropName>{displaySection.name}</DropName>
              {displaySection.description && (
                <>
                  <DropDivider />
                  <DropDesc>{displaySection.description}</DropDesc>
                </>
              )}
            </>
          )}
        </DropInner>
      </DropPanel>
    </NavWrapper>
  );
};

export default Nav;
