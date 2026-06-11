import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCookies } from "react-cookie";

const Dummy = styled.div`
  height: 34px;
`;

const Layout = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 34px;
  background: #ffffff;
  border-bottom: 1px solid #eeeeee;
`;

const Content = styled.div`
  margin: 0 auto;
  padding: 0 20px;
  max-width: 1200px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  font-size: 11px;
  color: #b8b8b8;
  letter-spacing: 0.04em;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const RoleBadge = styled(Link)`
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  background: #3e5977;
  padding: 2px 8px;
  border-radius: 3px;
  transition: background 0.15s;
  &:hover { background: #2e4666; }
`;

const NameLink = styled(Link)`
  font-size: 12px;
  font-weight: 500;
  color: #555555;
  transition: color 0.15s;
  &:hover { color: #1a1a1a; }
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background: #e0e0e0;
`;

const TextBtn = styled.span`
  font-size: 12px;
  color: #9b9b9b;
  cursor: pointer;
  transition: color 0.15s;
  &:hover { color: #1a1a1a; }
`;


const TopHeader = () => {
  const [cookie, , removeCookie] = useCookies();
  const navigate = useNavigate();

  const handleLogout = () => {
    ['accessToken', 'userId', 'id', 'nickname', 'roles'].forEach(k => removeCookie(k, { path: '/' }));
    navigate("/");
  };

  const isReporter = cookie.roles === 'REPORTER' || cookie.roles === 'ADMIN';

  return (
    <div>
      <Layout>
        <Content>
          <Left>The Gachon Herald</Left>

          <Right>
            {cookie.nickname ? (
              <>
                {isReporter && (
                  <RoleBadge to="/workspace">{cookie.roles}</RoleBadge>
                )}
                <NameLink to={isReporter ? "/reporter/manage" : "#"}>
                  {cookie.nickname}
                </NameLink>
                <Divider />
                <TextBtn onClick={handleLogout}>Logout</TextBtn>
              </>
            ) : null}
          </Right>
        </Content>
      </Layout>
      <Dummy />
    </div>
  );
};

export default TopHeader;
