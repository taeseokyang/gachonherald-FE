import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const SECTION_DESCS = {
  "Cover Story":  "In-depth reporting on the most important stories of the issue",
  "Feature":      "Long-form articles exploring complex topics and current affairs",
  "World Wide":   "News and perspectives from around the globe",
  "Brief":        "Quick updates on current events and campus news",
  "Gachonian":    "Stories about Gachon University students and alumni",
  "Campus Talk":  "Conversations and opinions from the Gachon community",
  "Book":         "Reviews and discussions of noteworthy books",
  "Drama":        "Coverage of Korean and international drama series",
  "Movie":        "Film reviews and industry insights",
  "Experience":   "Personal stories and cultural experiences from our reporters",
  "Photo Essay":  "Visual storytelling through photography",
  "Editorial":    "Opinion pieces and editorials from the editorial staff",
};

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
  max-width: 1100px;
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

const Divider = styled.div`
  width: 1px;
  height: 14px;
  background: #d8d8d8;
  margin: 0 4px;
  flex-shrink: 0;
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
  max-width: 1100px;
  margin: 0 auto;
  padding: 13px 34px 15px;
  display: flex;
  align-items: center;
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

          {sections.length > 0 && (
            <>
              <Divider />
              <SectionItem onMouseEnter={() => setHovered(null)}>
                <SectionLink to="/archive" $active={false}>
                  Archive
                </SectionLink>
              </SectionItem>
            </>
          )}
        </SectionBar>
      </Inner>

      <DropPanel $show={!!hovered}>
        <DropInner>
          {displaySection && (
            <>
              <DropName>{displaySection.name}</DropName>
              <DropDivider />
              <DropDesc>
                {SECTION_DESCS[displaySection.name] ??
                  "Browse articles in this section"}
              </DropDesc>
            </>
          )}
        </DropInner>
      </DropPanel>
    </NavWrapper>
  );
};

export default Nav;
