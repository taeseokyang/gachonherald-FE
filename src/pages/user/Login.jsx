import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { PageContainer } from "../../components/StyledComponents";
import Footer from "../../components/Footer";
import TopHeader from "../../components/TopHeader";
import { useCookies } from "react-cookie";
import moment from "moment";

const Content = styled.div`
  display: flex;
  gap: 10px;
  overflow: hidden;
  align-items: center;
  max-width: 1200px;
  min-height: 500px;
  margin: 0px auto;
  margin-top: 100px;
  flex-direction: column;
  padding: 10px 20px;
`;

const InputBox = styled.input`
  width: 400px;
  padding: 17px 10px;
  box-sizing: border-box;
  border-radius: 12px;
  background: #f5f5f5;
  font-weight: 700;
  color: #000000;
  border: none;
  outline: none;
`;

const VerifyCodeInput = styled.input`
  padding: 17px 10px;
  box-sizing: border-box;
  border-radius: 12px;
  background: #f5f5f5;
  font-weight: 700;
  color: #000000;
  border: none;
  outline: none;
  flex: 1;
`;

const VerifyBox = styled.div`
  width: 400px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
`;

const SendEmail = styled.button`
  padding: 15px 30px;
  border-radius: 12px;
  background: #3E5977;
  text-align: center;
  font-weight: 700;
  color: #ffffff;
  outline: none;
  border: none;
  cursor: pointer;
`;

const EmailLogin = styled.div`
  width: 400px;
  padding: 15px 0px;
  border-radius: 12px;
  background: #3E5977;
  text-align: center;
  font-weight: 700;
  color: #ffffff;
  outline: none;
  cursor: pointer;
`;

const Or = styled.div`
  width: 400px;
  padding: 10px 0px;
  text-align: center;
  font-weight: 700;
`;

const KakaoLogin = styled.div`
  width: 400px;
  padding: 15px 0px;
  border-radius: 12px;
  background: #FEE502;
  text-align: center;
  font-weight: 700;
`;

const TitleImg = styled.img`
  display: block;
  height: 100px;
  margin: 80px 0px;
  @media screen and (max-width: 600px) {
    height: 50px;
  }
`;

const ErrorMessage = styled.div`
  color: #828282;
  margin: 10px 0;
  font-size: 16px;
  font-weight: 700;
`;

const Login = () => {
  const navigate = useNavigate(); 

  const intervalIdRef = useRef(null);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [generation, setGeneration] = useState('');
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(0);
  const [, setCookie] = useCookies(); 
  const [timer, setTimer] = useState(180); // 타이머를 180초로 설정
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkEmail = async () => {
    setCode('');
    setNickname('');
    setPassword('');
    setConfirmPassword('');
    setIsTimerActive(false);
    setIsEmailSent(false);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACK_URL}/account/email-check/${email}`);
      setLoginStatus(response.data.data.status);
    } catch (error) {
      console.error("오류 발생:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  const handleContinueClick = () => {
    // 입력 필드 확인
    if (!email) {
      setErrorMessage("Please enter your email."); // 에러 메시지 설정
      return;
    }

    setErrorMessage(""); // 에러 메시지 초기화

    if (loginStatus === 0) {
      checkEmail();
    } else if (loginStatus === 1) {
      handleSignIn();
    } else if (loginStatus === 2) {
      handleSignUp();
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/account/email/signin`, {
        email,
        password,
      });
      if (response.data.code === 200) {
        const expires = moment().add(48, "hours").toDate();
        setCookie("id", response.data.data.id, { path: "/", expires });
        setCookie("accessToken", response.data.data.accessToken, { path: "/", expires });
        setCookie("userId", response.data.data.userId, { path: "/", expires });
        setCookie("nickname", response.data.data.nickname, { path: "/", expires });
        setCookie("roles", response.data.data.roles, { path: "/", expires });
        navigate("/");
      }else{
        setErrorMessage("Please check your email and password again.");
      }
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignUp = async () => {
    if (!code) {
      setErrorMessage("Please enter the verification code.");
      return;
    }

    if (!password || !nickname || !phone || !generation || !name) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACK_URL}/account/email/signup`, {
        email,
        nickname,
        name,
        phone,
        password,
        generation,
        code
      });
      if (response.data.code === 200) {
        const expires = moment().add(48, "hours").toDate();
        setCookie("id", response.data.data.id, { path: "/", expires });
        setCookie("accessToken", response.data.data.accessToken, { path: "/", expires });
        setCookie("userId", response.data.data.userId, { path: "/", expires });
        setCookie("nickname", response.data.data.nickname, { path: "/", expires });
        setCookie("roles", response.data.data.roles, { path: "/", expires });
        navigate("/");
      }else if (response.data.code === 401){
        setErrorMessage("The verification code is incorrect.");
      }else  if(response.data.code === 409){
        setErrorMessage("The email is already registered.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setIsEmailSent(true);
      startTimer(); // 타이머 시작
      await axios.post(`${process.env.REACT_APP_BACK_URL}/account/email-verify/${email}`);
    } catch (error) {
      setIsTimerActive(false);
      setIsEmailSent(false);
      setErrorMessage("Please enter a valid email or check your network.");
      console.error("인증 이메일 전송 오류:", error);
    }
  };

  const filter = (text) => {
    return text.replace(/[^a-zA-Z0-9@!?.]/g, '');
  };

  const startTimer = () => {

    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }

    setIsTimerActive(true);
    setTimer(180);
    intervalIdRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(intervalIdRef.current);
          setIsTimerActive(false);
          setIsEmailSent(false);
          return 180; // 타이머 초기화
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    setLoginStatus(0);
  }, [email]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // mm:ss 형식으로 반환
  };

  return (
    <PageContainer>
      <TopHeader />
      <Content>
        <Link to={"/"}>
          <TitleImg src="/images/gachonherald.svg" />
        </Link>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <InputBox 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(filter(e.target.value))} 
        />
        {loginStatus === 2 && (
          <>
            <VerifyBox>
              <VerifyCodeInput 
                placeholder={isTimerActive ? formatTime(timer) : "Verification code" }
                value={code} 
                disabled={!isEmailSent}
                onChange={(e) => setCode(e.target.value)} 
              />
              <SendEmail onClick={sendVerificationEmail}>
                Send
              </SendEmail>
            </VerifyBox>
            <InputBox 
              type="number" 
              placeholder="Generation" 
              min="1" 
              step="1" 
              value={generation} 
              onChange={(e) => setGeneration(e.target.value)} 
            />
            <InputBox 
              placeholder="Korean Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
            <InputBox 
              placeholder="English Name" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
            />
            <InputBox 
              placeholder="Phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
            <InputBox 
              placeholder="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <InputBox 
              placeholder="Password Confirm" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </>
        )}
        {loginStatus === 1 && (
          <InputBox 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        )}
        <EmailLogin onClick={handleContinueClick}>
          {loginStatus === 2 ? "Sign Up" : "Continue"}
        </EmailLogin>
        {/* <Or>or</Or> 
        <a href={"https://kauth.kakao.com/oauth/authorize?client_id=ddef038fa084012b787cdc2e0ac14a40&redirect_uri=https://baram.today/oauth/kakao&response_type=code"}>
          <KakaoLogin>Continue with Kakao Talk</KakaoLogin>
        </a> */}
      </Content>
      <Footer />
    </PageContainer>
  );
};

export default Login;
