import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/user/Home";
import Section from "./pages/user/Section";
import Article from "./pages/user/Article";
import Reporter from "./pages/user/Reporter";
import AboutUs from "./pages/user/AboutUs";
import ContactUs from "./pages/user/ContactUs";
import Login from "./pages/user/Login";
import ReportersPage from "./pages/user/ReportersPage";
import Archive from "./pages/user/Archive";
import AddArticle from "./pages/user/AddArticle";
import UpdateArticle from "./pages/user/UpdateArticle";
import WorkSpace from "./pages/user/WorkSpace";
import PublishManage from "./pages/user/PublishManage";
import SectionManage from "./pages/user/SectionManage";
import UserManage from "./pages/user/UserManage";
import ArticleManage from "./pages/user/ArticleManage";
import CommnetManage from "./pages/user/CommentManage";
import ArticleCheck from "./pages/user/ArticleCheck";
import PublishArticleManage from "./pages/user/PublishArticleManage";
/* eslint-disable */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/section/:sectionId" Component={Section} />
        <Route path="/article/:articleId" Component={Article} />
        <Route path="/reporter/:reporterId" Component={Reporter} />
        <Route path="/aboutus" Component={AboutUs} />
        <Route path="/contactus" Component={ContactUs} />
        <Route path="/login" Component={Login} />
        <Route path="/reporter/manage" Component={ReportersPage} />
        <Route path="/archive" Component={Archive} />
        <Route path="/edit" Component={AddArticle} />
        <Route path="/workspace" Component={WorkSpace} />
        <Route path="/publish" Component={PublishManage} />
        <Route path="/publish/article" Component={PublishArticleManage} />
        <Route path="/edit/:articleId" Component={UpdateArticle} />
        <Route path="/check/:articleId" Component={ArticleCheck} />

        <Route path="/manage/section" Component={SectionManage} />
        <Route path="/manage/user" Component={UserManage} />
        <Route path="/manage/article" Component={ArticleManage} />
        <Route path="/manage/comment" Component={CommnetManage} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;