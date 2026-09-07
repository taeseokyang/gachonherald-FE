import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCookies } from "react-cookie";

const Container = styled.div``;

const Dummy = styled.div`
  height: 30px;
`;

const Layout = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 30px;
  border-bottom: 1px solid #e8e8e8;
`;

const Content = styled.div`
  margin: 0px auto;
  padding: 0px 20px;
  max-width: 1000px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
`;

const Item = styled.div`
  color: #828282;
  span{
    a{
      color: #828282;
    }
  }
`;

const ItemBtn = styled.span`
  margin-left: 10px;
  color: #828282;
  cursor: pointer;
  a {
    color: #828282;
  }
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  margin-right: 6px;
  border-radius: 4px;
  background: #3e5977;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  vertical-align: middle;

  a {
    color: #ffffff;
  }
`;

const TopHeader = () => {
  const [cookie, setCookie, removeCookie] = useCookies(); 
  const navigate = useNavigate(); 
  const handleLogout = () => {
    removeCookie('accessToken', { path: "/" }); 
    removeCookie('userId', { path: "/" }); 
    removeCookie('id', { path: "/" }); 
    removeCookie('nickname', { path: "/" }); 
    removeCookie('roles', { path: "/" }); 

    navigate("/");
  };

  return (  
    <Container>
      <Layout>
        <Content>
          <Item></Item>
          
          <Item>
          {/* <span>{cookie.nickname != null ? (cookie.roles == 'REPORTER' || cookie.roles == 'ADMIN' )  ? <Link to={"/reporter/manage"}>{cookie.nickname} </Link> : cookie.nickname : null}</span> */}
            <span>{cookie.nickname != null ? (cookie.roles == 'REPORTER' || cookie.roles == 'ADMIN' )  ?<><Link to={"/workspace"}><RoleBadge>{cookie.roles}</RoleBadge></Link><Link to={"/reporter/manage"}>{cookie.nickname} </Link></>  : cookie.nickname : null}</span>
            <ItemBtn>
              {cookie.nickname != null ? 
                <span onClick={handleLogout}>Logout</span> : 
               null
              }
            </ItemBtn>
          </Item>
        </Content>
      </Layout>
      <Dummy></Dummy>
    </Container>
  );
};

export default TopHeader;
