import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UserService from "../../service/UserService";
import useUser from "../../hook/useUser";

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 5px;
`;

const Title = styled.h2`
    font-size: 20px;
    width: 50%;
`;

const SmallText = styled.p`
    font-size: 14px;
    color: #888;
    margin: 0;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const SubHeader = styled.div`
    font-size: 14px;
    color: #888;
    margin-bottom: 10px;
`;

const InputContainer = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 18px;
`;

const Input = styled.input`
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding-right: 40px;
`;

const Icon = styled.div`
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
`;

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;
`;

const ForgotPassword = styled.a`
    color: #1e90ff;
    font-size: 13px;
    text-decoration: none;
    font-weight: bold;
    display: block;
    margin-top: 1px;
    margin-bottom: 12px;

    &:hover {
        text-decoration: underline;
    }
`;

const Checkbox = styled.input`
    margin-right: 5px;
`;

const CheckboxLabel = styled.label`
    font-size: 14px;
    color: #333;
`;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: ${(props) => (props.disabled ? "#e6e6fa" : "#d8bfd8")};
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 30px;

    &:hover {
        background-color: ${(props) =>
            props.disabled ? "#e6e6fa" : "#dda0dd"};
    }
`;

const SettingPasswordModal = ({ isOpen, onClose, profileInfo }) => {
    const { setIsLoggedIn } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [checkboxChecked, setCheckboxChecked] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isFormValid = () => {
        return (
            currentPassword !== "" &&
            newPassword !== "" &&
            confirmPassword !== "" &&
            newPassword === confirmPassword &&
            checkboxChecked
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("비밀번호가 서로 일치하지 않습니다.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            // 현재 비밀번호 검증을 위해 로그인 시도
            await UserService.login(profileInfo.email, currentPassword);
            // 비밀번호 변경
            await UserService.updatePassword(
                profileInfo.id,
                newPassword,
                token
            );
            alert("비밀번호가 성공적으로 변경되었습니다.");
            if (checkboxChecked) {
                // 로그아웃 처리
                UserService.logout();
                setIsLoggedIn(false);
            }
            onClose();
        } catch (error) {
            alert("현재 비밀번호가 일치하지 않습니다.");
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="setting-password-modal-title"
            aria-describedby="setting-password-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 550,
                    height: 550,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    background: "linear-gradient(to right, #FFEEEE, #f2fcfe)",
                    borderRadius: 5,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton onClick={onClose} sx={{ flexGrow: 0 }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                <SubHeader>{profileInfo.email} · Petstagram</SubHeader>
                <Header>
                    <Title>비밀번호 변경</Title>
                </Header>
                <form onSubmit={handleSubmit}>
                    <SmallText>
                        비밀번호는 최소 6자 이상이어야 하며 숫자, 영문, 특수
                        문자(!$@%*)의 조합을 포함해야 합니다.
                    </SmallText>

                    <InputContainer>
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="current-password"
                            placeholder="현재 비밀번호"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <Icon onClick={handleTogglePasswordVisibility}>
                            {showPassword ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </Icon>
                    </InputContainer>

                    <InputContainer>
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="new-password"
                            placeholder="새 비밀번호"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Icon onClick={handleTogglePasswordVisibility}>
                            {showPassword ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </Icon>
                    </InputContainer>

                    <InputContainer>
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="confirm-password"
                            placeholder="새 비밀번호 재입력"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Icon onClick={handleTogglePasswordVisibility}>
                            {showPassword ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </Icon>
                    </InputContainer>

                    <ForgotPassword href="#">
                        비밀번호를 잊으셨나요?
                    </ForgotPassword>

                    <CheckboxContainer>
                        <Checkbox
                            type="checkbox"
                            id="logout-other-devices"
                            checked={checkboxChecked}
                            onChange={(e) =>
                                setCheckboxChecked(e.target.checked)
                            }
                        />
                        <CheckboxLabel htmlFor="logout-other-devices">
                            다른 기기에서 로그아웃합니다. 다른 사람이 회원님의
                            계정을 사용한 경우 선택하세요.
                        </CheckboxLabel>
                    </CheckboxContainer>

                    <Button type="submit" disabled={!isFormValid()}>
                        비밀번호 변경
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default SettingPasswordModal;
