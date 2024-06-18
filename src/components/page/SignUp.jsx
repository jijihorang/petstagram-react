import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import Button from "../ui/Button";
import UserService from "../service/UserService";

const SignUp = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [isButtonEnabled, setIsButtonEnabled] = useState(false);
    const [userData, setUserData] = useState({
        email: "",
        name: "",
        phone: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: false,
        name: false,
        phone: false,
        password: false,
    });
    const [touched, setTouched] = useState({
        email: false,
        name: false,
        phone: false,
        password: false,
    });

    useEffect(() => {
        const isValid = (value) => value.trim() !== "";
        const newErrors = {
            email: touched.email && !isValid(userData.email),
            name: touched.name && !isValid(userData.name),
            phone: touched.phone && !isValid(userData.phone),
            password: touched.password && !isValid(userData.password),
        };
        setErrors(newErrors);
        setIsButtonEnabled(!Object.values(newErrors).some(Boolean));
    }, [userData, touched]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
        setTouched({ ...touched, [name]: true });

        if (name === "phone") {
            setUserData({ ...userData, [name]: formatPhoneNumber(value) });
        } else {
            setUserData({ ...userData, [name]: value });
        }

        if (errors[name]) {
            setErrors({ ...errors, [name]: false });
            setErrorMessage("");
        }
    };

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, "");
        let formattedNumber = "";

        if (numbers.length <= 3) {
            formattedNumber = numbers;
        } else if (numbers.length <= 7) {
            formattedNumber = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        } else {
            formattedNumber = `${numbers.slice(0, 3)}-${numbers.slice(
                3,
                7
            )}-${numbers.slice(7, 11)}`;
        }

        return formattedNumber;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTouched = {
            email: true,
            name: true,
            phone: true,
            password: true,
        };
        setTouched(newTouched);
        const isValid = Object.values(userData).every(
            (value) => value.trim() !== ""
        );
        if (!isValid) {
            setErrorMessage("모든 필드를 채워주세요.");
            return;
        }
        try {
            await UserService.signup(userData);
            setUserData({
                name: "",
                email: "",
                phone: "",
                password: "",
            });
            /* SweetAlert 커스텀 하기 */
            alert("회원가입 완료");
            navigate("/");
        } catch (error) {
            setErrorMessage(error.response?.data || "회원가입에 실패했습니다.");
            if (error.response?.data?.includes("이메일")) {
                setErrors({ ...errors, email: true });
            }
        }
    };

    return (
        <>
            <div className="signup-container">
                <div className="signup-form">
                    <div className="signup-info">
                        <h1>Petstagram</h1>
                        <h4>반려견의 사진과 동영상을 보려면 가입하세요.</h4>
                    </div>
                    <div className="facebook-login">
                        <Button href="#" backgroundColor="#2593FF">
                            Facebook으로 로그인
                        </Button>
                    </div>
                    <div className="or-separator">
                        <div className="line"></div>
                        <div className="or-text">또는</div>
                        <div className="line"></div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                name="email"
                                placeholder="이메일 주소"
                                value={userData.email}
                                onChange={handleInputChange}
                                className={`signup-input-email ${
                                    errors.email ? "error" : ""
                                }`}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="name"
                                placeholder="사용자 이름"
                                value={userData.name}
                                onChange={handleInputChange}
                                className={`signup-input-name ${
                                    errors.name ? "error" : ""
                                }`}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                name="phone"
                                placeholder="휴대폰 번호"
                                value={userData.phone}
                                onChange={handleInputChange}
                                className={`signup-input-phone ${
                                    errors.phone ? "error" : ""
                                }`}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="비밀번호"
                                value={userData.password}
                                onChange={handleInputChange}
                                className={`signup-input-password ${
                                    errors.password ? "error" : ""
                                }`}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`signup-submit ${
                                isButtonEnabled ? "enabled" : "disabled"
                            }`}
                        >
                            가입
                        </button>
                    </form>
                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}
                </div>
                <div className="login-section">
                    <div className="login-box">
                        <p>
                            계정이 있으신가요?{" "}
                            <a href="/" className="login-link">
                                로그인
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
