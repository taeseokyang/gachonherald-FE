import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import { useCookies } from "react-cookie";
import moment from "moment";

const Page = styled.div`
  min-height: 100vh;
  background: #f8f9fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 44px 40px 40px;
  width: 100%;
  max-width: 400px;
`;

const LogoLink = styled(Link)`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
`;

const LogoImg = styled.img`
  height: 36px;
`;

const CardTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 14px;
`;

const InputField = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px;
  font-size: 14px;
  border: 1px solid #d8d8d8;
  border-radius: 6px;
  outline: none;
  color: #1a1a1a;
  transition: border-color 0.15s;
  background: #ffffff;

  &:focus {
    border-color: #3e5977;
  }

  &::placeholder {
    color: #b0b0b0;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const VerifyRow = styled.div`
  display: flex;
  gap: 10px;
`;

const SendButton = styled.button`
  flex-shrink: 0;
  padding: 0 16px;
  background: #3e5977;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: #2e4666;
  }
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #3e5977;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.15s;

  &:hover {
    background: #2e4666;
  }
`;

const ErrorMessage = styled.div`
  font-size: 13px;
  color: #d0453a;
  margin-bottom: 12px;
  padding: 10px 14px;
  background: #fff5f5;
  border: 1px solid #f5c6c6;
  border-radius: 6px;
`;

const TimerNote = styled.div`
  font-size: 12px;
  color: #9b9b9b;
  margin-top: -4px;
  margin-bottom: 4px;
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
  const [timer, setTimer] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => clearInterval(intervalIdRef.current);
  }, []);

  useEffect(() => {
    setLoginStatus(0);
  }, [email]);

  const filter = (text) => text.replace(/[^a-zA-Z0-9@!?.]/g, '');

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startTimer = () => {
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    setIsTimerActive(true);
    setTimer(180);
    intervalIdRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(intervalIdRef.current);
          setIsTimerActive(false);
          setIsEmailSent(false);
          return 180;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const checkEmail = async () => {
    setCode(''); setNickname(''); setPassword(''); setConfirmPassword('');
    setIsTimerActive(false); setIsEmailSent(false);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACK_URL}/account/email-check/${email}`);
      setLoginStatus(res.data.data.status);
    } catch (e) { console.error(e); }
  };

  const handleSignIn = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACK_URL}/account/email/signin`, { email, password });
      if (res.data.code === 200) {
        const expires = moment().add(48, "hours").toDate();
        const d = res.data.data;
        setCookie("id", d.id, { path: "/", expires });
        setCookie("accessToken", d.accessToken, { path: "/", expires });
        setCookie("userId", d.userId, { path: "/", expires });
        setCookie("nickname", d.nickname, { path: "/", expires });
        setCookie("roles", d.roles, { path: "/", expires });
        navigate("/");
      } else {
        setErrorMessage("Please check your email and password again.");
      }
    } catch (e) { console.error(e); }
  };

  const handleSignUp = async () => {
    if (!code) { setErrorMessage("Please enter the verification code."); return; }
    if (!password || !nickname || !phone || !generation || !name) { setErrorMessage("Please fill in all fields."); return; }
    if (password !== confirmPassword) { setErrorMessage("The passwords do not match."); return; }
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACK_URL}/account/email/signup`, { email, nickname, name, phone, password, generation, code });
      if (res.data.code === 200) {
        const expires = moment().add(48, "hours").toDate();
        const d = res.data.data;
        setCookie("id", d.id, { path: "/", expires });
        setCookie("accessToken", d.accessToken, { path: "/", expires });
        setCookie("userId", d.userId, { path: "/", expires });
        setCookie("nickname", d.nickname, { path: "/", expires });
        setCookie("roles", d.roles, { path: "/", expires });
        navigate("/");
      } else if (res.data.code === 401) {
        setErrorMessage("The verification code is incorrect.");
      } else if (res.data.code === 409) {
        setErrorMessage("The email is already registered.");
      }
    } catch (e) { console.error(e); }
  };

  const sendVerificationEmail = async () => {
    try {
      setIsEmailSent(true);
      startTimer();
      await axios.post(`${process.env.REACT_APP_BACK_URL}/account/email-verify/${email}`);
    } catch (e) {
      setIsTimerActive(false);
      setIsEmailSent(false);
      setErrorMessage("Please enter a valid email or check your network.");
    }
  };

  const handleContinue = () => {
    if (!email) { setErrorMessage("Please enter your email."); return; }
    setErrorMessage("");
    if (loginStatus === 0) checkEmail();
    else if (loginStatus === 1) handleSignIn();
    else if (loginStatus === 2) handleSignUp();
  };

  const cardTitle = loginStatus === 2 ? "Create your account" : loginStatus === 1 ? "Welcome back" : "Sign in to The Gachon Herald";

  return (
    <Page>
      <Card>
        <LogoLink to="/">
          <LogoImg src="/images/gachonherald.svg" alt="The Gachon Herald" />
        </LogoLink>

        <CardTitle>{cardTitle}</CardTitle>

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <InputGroup>
          <InputField
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(filter(e.target.value))}
          />

          {loginStatus === 1 && (
            <InputField
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {loginStatus === 2 && (
            <>
              <VerifyRow>
                <InputField
                  placeholder={isTimerActive ? formatTime(timer) : "Verification code"}
                  value={code}
                  disabled={!isEmailSent}
                  onChange={(e) => setCode(e.target.value)}
                />
                <SendButton onClick={sendVerificationEmail}>Send</SendButton>
              </VerifyRow>
              {isTimerActive && <TimerNote>Code expires in {formatTime(timer)}</TimerNote>}
              <InputField type="number" placeholder="Generation (기수)" min="1" step="1" value={generation} onChange={(e) => setGeneration(e.target.value)} />
              <InputField placeholder="Korean Name (본명)" value={name} onChange={(e) => setName(e.target.value)} />
              <InputField placeholder="English Name (영문 이름)" value={nickname} onChange={(e) => setNickname(e.target.value)} />
              <InputField placeholder="Phone (전화번호)" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <InputField placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <InputField placeholder="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </>
          )}
        </InputGroup>

        <ContinueButton onClick={handleContinue}>
          {loginStatus === 2 ? "Create Account" : "Continue"}
        </ContinueButton>
      </Card>
    </Page>
  );
};

export default Login;
