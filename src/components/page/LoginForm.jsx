import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import facebook_logo from "/src/assets/facebook.png";
import UserService from "../service/UserService";

const LoginForm = ({ setIsLoggedIn }) => {
    const [email, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userData = await UserService.login(email, password);
            console.log(userData);
            if (userData.token) {
                localStorage.setItem("token", userData.token);
                localStorage.setItem("role", userData.role);

                setIsLoggedIn(true);
            } else {
                setError(userData.message);
            }
        } catch (error) {
            console.log(error);
            setError("로그인 실패", error.message);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="login-form">
                    <h1>Petstagram</h1>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="전화번호, 사용자 이름 또는 이메일"
                                value={email}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit">로그인</button>
                    </form>
                    <div className="or-separator">
                        <div className="line"></div>
                        <div className="or-text">또는</div>
                        <div className="line"></div>
                    </div>
                    <div className="facebook-login">
                        <img src={facebook_logo} alt="Facebook 로고" />
                        <a href="#">Facebook으로 로그인</a>
                    </div>

                    <div className="forgot-password">
                        <a href="#">비밀번호를 잊으셨나요?</a>
                    </div>
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
        </>
    );
};

export default LoginForm;
