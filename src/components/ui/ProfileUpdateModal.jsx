import React, { useState, useEffect, useRef } from "react";
import "./ProfileUpdateModal.css";
import useUser from "../hook/useUser";
import Select from "react-select";
import styled from "styled-components";
import UserService from "../service/UserService";

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContainer = styled.div`
    background: white;
    width: 600px;
    min-height: 250px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 20px 0;
`;

const ModalTitle = styled.h2`
    padding: 30px;
    color: #333;
    font-size: 30px;
    text-align: center;
    font-weight: 500;
    width: 100%;
`;

const ModalButton = styled.button`
    background-color: white;
    color: ${(props) => props.color || "#000"};
    border: none;
    border-top: 1px solid #ccc; // 상단 선 추가
    padding: 20px 0;
    font-weight: bold;
    cursor: pointer;
    text-align: center;
    font-size: 22px;
    &:hover {
        opacity: 0.85;
    }

    &:first-child {
        border-top: none; // 첫 번째 버튼에는 상단 선 없음
    }

    &:last-child {
        padding: 20px 0 0 0;
    }

    // 모든 버튼에 대해 border-radius 제거
    border-radius: 0;
`;

const genderOptions = [
    { value: "비공개", label: "밝히고 싶지 않음" },
    { value: "남성", label: "남성" },
    { value: "여성", label: "여성" },
];

const ProfileUpdateModal = ({
    onClose,
}) => {
    const { profileInfo, fetchProfileInfo } = useUser();
    const [bio, setBio] = useState(profileInfo.bio || "");
    const [gender, setGender] = useState(profileInfo.gender || "비공개");
    const [showRecommendations, setShowRecommendations] = useState(
        profileInfo.isRecommend || false
    );
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        setIsSubmitDisabled(true);
    }, []);

    const handleChange = (setter) => (value) => {
        setter(value);
        setIsSubmitDisabled(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = { bio, gender, isRecommend: showRecommendations };

        const formData = new FormData();
        formData.append(
            "user",
            new Blob([JSON.stringify(userData)], { type: "application/json" })
        );
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            const token = localStorage.getItem("token");
            await UserService.updateUser(profileInfo.id, formData, token);
            await fetchProfileInfo();
            onClose();
        } catch (error) {
            console.error("Error updating user:", error);
            alert("프로필 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
                setShowModal(false);
            };
            reader.readAsDataURL(file);
        }
        setIsSubmitDisabled(false);
    };

    const handleDeleteImage = () => {
        
    };

    return (
        <div className="profile-modal">
            <div className="profile-modal-content">
                <div className="profile-header">
                    <h2>프로필 편집</h2>
                    <button
                        type="button"
                        className="profile-close-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="profile-section">
                        <img
                            className="profile-pic"
                            src={selectedImage || profileInfo.profileImageUrl}
                            alt="Profile"
                        />
                        <div className="profile-info">
                            <div className="profile-email">
                                {profileInfo.email}
                            </div>
                            <div className="profile-name">
                                {profileInfo.name}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="profile-change-pic-btn"
                            onClick={() => setShowModal(true)}
                        >
                            사진 변경
                        </button>
                    </div>

                    <div className="profile-input-bio">
                        <label>소개</label>
                        <textarea
                            value={bio}
                            onChange={(e) =>
                                handleChange(setBio)(e.target.value)
                            }
                            maxLength={149}
                            placeholder="소개"
                        />
                        <small>{bio.length} / 150</small>
                    </div>
                    <div className="profile-input-gen">
                        <label>성별</label>
                        <Select
                            value={genderOptions.find(
                                (option) => option.value === gender
                            )}
                            onChange={(option) =>
                                handleChange(setGender)(option.value)
                            }
                            options={genderOptions}
                            className="profile-select"
                            classNamePrefix="profile-select"
                            placeholder="성별 선택"
                        />
                        <small>
                            이 정보는 공개 프로필에 포함되지 않습니다.
                        </small>
                    </div>
                    <div className="profile-input-recommend">
                        <label>프로필에 계정 추천 표시</label>
                        <div className="profile-recommend-border">
                            <div className="profile-recommend-toggle">
                                <span>프로필에 계정 추천 표시</span>
                                <label
                                    className="profile-toggle-switch"
                                    htmlFor="recommendations"
                                >
                                    <input
                                        type="checkbox"
                                        id="recommendations"
                                        checked={showRecommendations}
                                        onChange={(e) =>
                                            handleChange(
                                                setShowRecommendations
                                            )(e.target.checked)
                                        }
                                    />
                                    <span className="profile-slider round"></span>
                                </label>
                            </div>
                            <small>
                                사람들이 회원님의 프로필에서 비슷한 계정 추천을
                                볼 수 있는지와 회원님의 계정이 다른 프로필에서
                                추천될 수 있는지를 선택하세요.
                            </small>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="profile-submit-btn"
                        disabled={isSubmitDisabled}
                    >
                        제출
                    </button>
                </form>
            </div>
            {showModal && (
                <ModalBackdrop onClick={() => setShowModal(false)}>
                    <ModalContainer onClick={(e) => e.stopPropagation()}>
                        <ModalTitle>프로필 사진 바꾸기</ModalTitle>
                        <ModalButton
                            color="rgb(65, 147, 239)"
                            onClick={() => fileInputRef.current.click()}
                        >
                            사진 업로드
                        </ModalButton>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <ModalButton color="#ff5a5a" onClick={handleDeleteImage}>
                            현재 사진 삭제
                        </ModalButton>
                        <ModalButton
                            color="#000"
                            onClick={() => setShowModal(false)}
                        >
                            취소
                        </ModalButton>
                    </ModalContainer>
                </ModalBackdrop>
            )}
        </div>
    );
};

export default ProfileUpdateModal;
