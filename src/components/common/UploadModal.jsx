import "./UploadModal.css";
import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import useUser from "../hook/useUser";
import usePost from "../hook/usePost";
import PostService from "../service/PostService";
import WebcamComponent from "../../utils/WebcamComponent";

// 삭제 확인 모달 스타일
const DeleteConfirmModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
`;

const DeleteConfirmContent = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
`;

const DeleteConfirmTitle = styled.p`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const DeleteConfirmMessage = styled.p`
    font-size: 14px;
    margin-bottom: 20px;
`;

const DeleteConfirmActions = styled.div`
    display: flex;
    justify-content: space-around;
`;

const DeleteConfirmButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &.delete {
        background-color: #e74c3c;
        color: #fff;
    }
    &.cancel {
        background-color: #95a5a6;
        color: #fff;
    }
`;

// 이모지 선택창 스타일
const EmojiPickerModal = styled.div`
    position: relative;
    top: 30px;
    right: 0;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 10px;
    z-index: 1000;
    width: 250px;
`;

const EmojiButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    margin: 5px;
    display: inline-block;
`;

const EmojiTitle = styled.div`
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
`;

const EmojiList = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

export const UploadModal = ({ onClose }) => {
    const { isLoggedIn, profileInfo } = useUser();
    const { postList, setPostList, setPostSuccess } = usePost(isLoggedIn, profileInfo);
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [text, setText] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const maxTextLength = 2200;
    const [showWebcam, setShowWebcam] = useState(false);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTextChange = (e) => {
        const newText = e.target.value;
        if (newText.length <= maxTextLength) {
            setText(newText);
        }
    };

    const handleConfirmDelete = () => {
        setShowDeleteConfirm(false);
        onClose();
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    const handleEmojiClick = (emoji) => {
        setText(text + emoji);
        setShowEmojiPicker(false);
    };
    const handleCapture = (imageSrc) => {
        setSelectedImage(imageSrc);
        setShowWebcam(false);
    };

    const handleSubmit = async () => {
        try {
            const file = fileInputRef.current?.files[0];
            const postData = { postContent: text };
            const formData = new FormData();
            formData.append(
                "post",
                new Blob([JSON.stringify(postData)], {
                    type: "application/json",
                })
            );
            if (file) {
                formData.append("file", file);
            } else if (selectedImage) {
                const blob = await fetch(selectedImage).then((res) => res.blob());
                formData.append("file", blob, "webcam.webp");
            } else {
                console.error("파일이 선택되지 않았습니다.");
                return;
            }

            const token = localStorage.getItem("token");
            const response = await PostService.createPost(formData, token);
            setPostList([...postList, response.data]);
            setPostSuccess(true);
            onClose();
        } catch (error) {
            console.error("게시글 업로드 중 오류 발생:", error);
            setPostList(postList);
        }
    };

    return (
        <div className="post-frame-container">
            <button
                className="post-close-modal"
                onClick={() => setShowDeleteConfirm(true)}
            >
                ✕
            </button>
            <div className="post-frame">
                <div className="post-header">
                    <div className="post-text-wrapper">새 게시물 만들기</div>
                    <div className="post-text-wrapper-2" onClick={handleSubmit}>
                        공유하기
                    </div>
                </div>
                <div className="post-content">
                    <div className="post-image-section">
                        {selectedImage ? (
                            <div className="img_section">
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="selected-image"
                                />
                            </div>
                        ) : (
                            <div className="img_section">
                                <img
                                    className="image_file"
                                    src="../src/assets/postmodal/photo.png"
                                    alt="포스트 모달 이미지"
                                />
                                <br />
                                사진과 동영상을 끌어다 놓으세요
                            </div>
                        )}
                        <div
                            className="post-file-div"
                            style={{
                                display: selectedImage ? "none" : "block",
                            }}
                        >
                            <div
                                className="file_section"
                                onClick={() => fileInputRef.current.click()}
                            >
                                컴퓨터에서 선택
                            </div>
                            <div
                                className="camera-section"
                                onClick={() => setShowWebcam(true)}
                            >
                                촬영
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <div className="post-details-section">
                        <div className="post-user-info">
                            <img
                                className="post-ellipse"
                                src={profileInfo.profileImageUrl}
                                alt="User Profile"
                            />
                            <div className="post-text-wrapper-3">
                                {profileInfo.email}
                            </div>
                        </div>
                        <div className="post-textarea-section">
                            <textarea
                                className="post-input-wrapper"
                                placeholder="문구를 입력하세요..."
                                value={text}
                                onChange={handleTextChange}
                            />
                            <div className="post-counter">
                                <img
                                    className="post-uil-smile"
                                    alt="Uil smile"
                                    src="../src/assets/postmodal/smile.png"
                                    onClick={() =>
                                        setShowEmojiPicker(!showEmojiPicker)
                                    }
                                />
                                <div className="post-text-wrapper-5">
                                    {text.length}/{maxTextLength}
                                </div>
                            </div>
                        </div>
                        <PostOptions />
                    </div>
                </div>
            </div>
            {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
            {showDeleteConfirm && (
                <DeleteConfirmModal>
                    <DeleteConfirmContent>
                        <DeleteConfirmTitle>
                            게시물을 삭제하시겠어요?
                        </DeleteConfirmTitle>
                        <DeleteConfirmMessage>
                            지금 나가면 수정 내용이 저장되지 않습니다.
                        </DeleteConfirmMessage>
                        <DeleteConfirmActions>
                            <DeleteConfirmButton
                                className="delete"
                                onClick={handleConfirmDelete}
                            >
                                삭제
                            </DeleteConfirmButton>
                            <DeleteConfirmButton
                                className="cancel"
                                onClick={handleCancelDelete}
                            >
                                취소
                            </DeleteConfirmButton>
                        </DeleteConfirmActions>
                    </DeleteConfirmContent>
                </DeleteConfirmModal>
            )}
            {showWebcam && (
                <WebcamComponent
                    onCapture={handleCapture}
                    onClose={() => setShowWebcam(false)}
                />
            )}
        </div>
    );
};

const PostOptions = () => (
    <div className="post-options">
        {[
            {
                label: "위치 추가",
                icon: "../src/assets/postmodal/location.png",
            },
            { label: "접근성", icon: "../src/assets/postmodal/under.png" },
            { label: "고급 설정", icon: "../src/assets/postmodal/under.png" },
        ].map((option, index) => (
            <div className="post-option" key={index}>
                <div className="post-text-wrapper-6">{option.label}</div>
                <img className="post-icon" alt="Frame" src={option.icon} />
            </div>
        ))}
    </div>
);

const EmojiPicker = ({ onEmojiClick }) => (
    <EmojiPickerModal>
        <EmojiTitle>최고 인기 이모티콘</EmojiTitle>
        <EmojiList>
            {["🐥", "🐣", "🐤", "🐧", "🐦", "🐰", "🐹"].map((emoji) => (
                <EmojiButton key={emoji} onClick={() => onEmojiClick(emoji)}>
                    {emoji}
                </EmojiButton>
            ))}
        </EmojiList>
    </EmojiPickerModal>
);
