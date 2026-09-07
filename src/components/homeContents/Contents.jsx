import { Link } from "react-router-dom";
import styled from "styled-components";
import TopBlock from "./TopBlock";
import ImageNo from "./ImageNo";
import ImageOneFull from "./ImageOneFull";
import ImageOne from "./ImageOne";
import ImageTwo from "./ImageTwo";
import ImageThree from "./ImageThree";
import HorizontalLine from "./HorizontalLine";
import SectionGroup from "./SectionGroup";
import ImagePhotoEssay from "./ImagePhotoEssay";
import { Container } from "../StyledComponents";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Sections that should always occupy a full row regardless of article count.
const FULL_ROW_SECTIONS = ["Photo Essay"];

// "Light" sections that look sparse as a full row.
// Full row needs: 2+ images, OR 1 image + 2+ text articles, OR 3+ text articles.
function isLightSection(section) {
  if (FULL_ROW_SECTIONS.includes(section.sectionName)) return false;
  const { imageArticles, articles } = section;
  if (imageArticles.length >= 2) return false;
  if (imageArticles.length === 1 && articles.length >= 2) return false;
  if (imageArticles.length === 0 && articles.length >= 3) return false;
  return true;
}

// Group consecutive light sections into rows of 2–3.
// A lone remaining light section renders normally (full row).
function buildRows(sections) {
  const rows = [];
  let pending = [];

  sections.forEach((section) => {
    const total = section.imageArticles.length + section.articles.length;
    if (total === 0) return;

    if (isLightSection(section)) {
      pending.push(section);
      if (pending.length === 3) {
        rows.push({ type: "group", sections: [...pending] });
        pending = [];
      }
    } else {
      if (pending.length >= 2) {
        rows.push({ type: "group", sections: [...pending] });
      } else if (pending.length === 1) {
        rows.push({ type: "single", section: pending[0] });
      }
      pending = [];
      rows.push({ type: "single", section });
    }
  });

  if (pending.length >= 2) {
    rows.push({ type: "group", sections: pending });
  } else if (pending.length === 1) {
    rows.push({ type: "single", section: pending[0] });
  }

  return rows;
}

function renderSection(section) {
  const { sectionId, sectionName, imageArticles, articles } = section;

  // Photo Essay: full-width unconstrained image layout
  if (sectionName === "Photo Essay" && imageArticles.length >= 1)
    return <ImagePhotoEssay sectionId={sectionId} sectionName={sectionName} imageArticles={imageArticles} />;

  if (articles.length === 0 && imageArticles.length === 1)
    return <ImageOneFull sectionId={sectionId} sectionName={sectionName} article={imageArticles[0]} />;
  if (articles.length > 0 && imageArticles.length === 1)
    return <ImageOne sectionId={sectionId} sectionName={sectionName} imageArticles={imageArticles} articles={articles} />;
  if (imageArticles.length === 2)
    return <ImageTwo sectionId={sectionId} sectionName={sectionName} imageArticles={imageArticles} articles={articles} />;
  if (imageArticles.length === 3)
    return <ImageThree sectionId={sectionId} sectionName={sectionName} imageArticles={imageArticles} articles={articles} />;
  if (articles.length > 0 && imageArticles.length === 0)
    return <ImageNo sectionId={sectionId} sectionName={sectionName} articles={articles} />;
  return null;
}

const Contents = () => {
  const [editorsPicks, setEditorsPicks] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACK_URL + "/articles/home");
        setEditorsPicks(response.data.data.editorsPicks);
        setSections(response.data.data.sections);
      } catch (error) {
        console.error("오류 발생:", error);
      }
    };
    fetchData();
  }, []);

  const rows = buildRows(sections);

  return (
    <Container>
      <TopBlock articles={editorsPicks} />
      {rows.map((row, index) => (
        <React.Fragment key={index}>
          <HorizontalLine />
          {row.type === "group"
            ? <SectionGroup sections={row.sections} />
            : renderSection(row.section)
          }
        </React.Fragment>
      ))}
    </Container>
  );
};

export default Contents;
