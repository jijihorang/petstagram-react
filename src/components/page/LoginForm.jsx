import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import facebook_logo from "/src/assets/facebook.png";
import UserService from "../service/UserService";
import icons from "../../assets/ImageList";
import { KAKAO_AUTH_URL } from "../service/OAuth";

const LoginForm = ({ setIsLoggedIn }) => {
    const [email, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userData = await UserService.login(email, password);
            if (userData.token) {
                localStorage.setItem("token", userData.token);
                localStorage.setItem("role", userData.role);

                setIsLoggedIn(true);
            } else {
                setError(userData.message);
            }
        } catch (error) {
            console.log(error);
            setError("아이디 또는 비밀번호가 잘못되었습니다.", error.message);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="login-form">
                    <h1 className="login-header">Petstagram</h1>
                    <form onSubmit={handleLogin}>
                        <div className="login-form-group">
                            <input
                                type="text"
                                placeholder="전화번호, 사용자 이름 또는 이메일"
                                value={email}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="login-input-email"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-input-password"
                            />
                        </div>

                        <button type="submit" className="login-submit">
                            로그인
                        </button>
                    </form>
                    {error && <p className="login-error-message">{error}</p>}
                    <div className="or-separator">
                        <div className="line"></div>
                        <div className="or-text">또는</div>
                        <div className="line"></div>
                    </div>
                    <div className="social-login-wrapper">
                        <img
                            src={facebook_logo}
                            alt="FacebookLogo"
                            className="facebook-login-icon"
                            onClick={() => {
                                console.log("#");
                            }}
                        />

                        <a href={KAKAO_AUTH_URL}>
                            <img
                                src={icons.kakaoLogin}
                                alt="KakaoLogo"
                                className="kakao-login-icon"
                            />
                        </a>
                    </div>

                    <div className="forgot-password">
                        <Link to="/find-password">비밀번호를 잊으셨나요?</Link>
                    </div>
                </div>
                <div className="signup-section">
                    <div className="signup-box">
                        <p>
                            계정이 없으신가요?{" "}
                            <Link to="/signup" className="signup-link">
                                가입하기
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;
