import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Axios 라이브러리를 import

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);

  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    // 이메일 유효성 검사: @ 포함
    const isValid = enteredEmail.includes('@');
    setIsValidEmail(isValid);
    setEmail(enteredEmail);
  };

  const handlePasswordChange = (e) => {
    const enteredPassword = e.target.value;
    // 비밀번호 유효성 검사: 8자 이상
    const isValid = enteredPassword.length >= 8;
    setIsValidPassword(isValid);
    setPassword(enteredPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사 통과 여부 확인
    if (isValidEmail && isValidPassword) {
      // Axios를 사용하여 로그인 API 호출
      axios
        .post('https://www.pre-onboarding-selection-task.shop/auth/signin', {
          email,
          password,
        })
        .then((response) => {
          if (response.status === 200) {
            // 로그인 성공 시 JWT 토큰을 로컬 스토리지에 저장
            localStorage.setItem('access_token', response.data.access_token);
            // 로그인이 성공하면 /todo 페이지로 이동
            console.log('로그인 성공');
            console.log(localStorage.getItem('access_token'));
            window.location.href = '/todo'; // 브라우저를 통한 리다이렉트
          } else {
            // 로그인 실패 처리
            console.error('로그인 실패:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('로그인 오류 발생:', error);
        });
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            data-testid="email-input"
            type="text"
            name="email"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
          />
          {!isValidEmail && <p>이메일은 @를 포함해야 합니다.</p>}
        </div>
        <div>
          <input
            data-testid="password-input"
            type="password"
            name="password"
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={handlePasswordChange}
          />
          {!isValidPassword && <p>비밀번호는 8자 이상이어야 합니다.</p>}
        </div>
        <div>
          <button data-testid="signin-button" type="submit" disabled={!isValidEmail || !isValidPassword}>
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signin;
