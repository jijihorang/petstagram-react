import axios from 'axios';
import { useEffect } from 'react';
import styled from 'styled-components';

const KakaoAuthHandle = (props) => {
  useEffect(() => {
    let code = new URL(window.location.href).searchParams.get('code');

    const kakaoLogin = async () => {
      try {
        const res = await axios.get(`http://localhost:8088/login/oauth2/callback/kakao?code=${code}`);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        window.location.href = "/";
      } catch (error) {
        console.error('Error during Kakao login:', error);
      }
    };

    kakaoLogin();
  }, []);

  return (
    <Container>
      <p>로그인 중입니다...</p>
    </Container>
  );
};

export default KakaoAuthHandle;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
