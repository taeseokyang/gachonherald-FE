import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState, useRef } from "react";

const SECTIONS = [
  { name: "Cover Story",  desc: "In-depth reporting on the most important stories of the issue" },
  { name: "Feature",      desc: "Long-form articles exploring complex topics and current affairs" },
  { name: "World Wide",   desc: "News and perspectives from around the globe" },
  { name: "Brief",        desc: "Quick updates on current events and campus news" },
  { name: "Gachonian",    desc: "Stories about Gachon University students and alumni" },
  { name: "Campus Talk",  desc: "Conversations and opinions from the Gachon community" },
  { name: "Book",         desc: "Reviews and discussions of noteworthy books" },
  { name: "Drama",        desc: "Coverage of Korean and international drama series" },
  { name: "Movie",        desc: "Film reviews and industry insights" },
  { name: "Experience",   desc: "Personal stories and cultural experiences from our reporters" },
  { name: "Editorial",    desc: "Opinion pieces and editorials from the editorial staff" },
];

const NavWrapper = styled.nav`
  position: relative;
  background: #ffffff;
  border-top: 2px solid #3e5977;
  border-bottom: 1px solid #e8e8e8;
  z-index: 100;
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

const DropPanel = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.09);
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
  padding: 14px 34px 16px;
  display: flex;
  align-items: baseline;
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
  line-height: 1.5;
`;

const NavBar = () => {
  const [hovered, setHovered] = useState(null);
  const lastHovered = useRef(null);
  const hideTimer = useRef(null);

  const onEnter = (name) => {
    clearTimeout(hideTimer.current);
    setHovered(name);
    lastHovered.current = name;
  };

  const onLeave = () => {
    hideTimer.current = setTimeout(() => setHovered(null), 120);
  };

  const displaySection = SECTIONS.find(
    (s) => s.name === (hovered || lastHovered.current)
  );

  return (
    <NavWrapper onMouseLeave={onLeave}>
      <Inner>
        <SectionBar>
          {SECTIONS.map((s) => (
            <SectionItem key={s.name} onMouseEnter={() => onEnter(s.name)}>
              <SectionLink to={"/section/" + s.name} $active={hovered === s.name}>
                {s.name}
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
              <DropDivider />
              <DropDesc>{displaySection.desc}</DropDesc>
            </>
          )}
        </DropInner>
      </DropPanel>
    </NavWrapper>
  );
};

export default NavBar;
