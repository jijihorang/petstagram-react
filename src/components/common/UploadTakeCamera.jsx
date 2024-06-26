import React, { useRef, useState } from "react";
import "./UploadModal.css";
import PostService from "../service/PostService";

import useModal from "../hook/useModal";
import useUser from "../hook/useUser";
import usePost from "../hook/usePost";

import Loading from "../ui/Loading";
import DeleteConfirm from "../ui/DeleteConfirm";
import EmojiPicker from "../ui/EmojiPicker";
import WebcamComponent from "../../utils/WebcamComponent";
import KakaoMapModal from "../ui/kakaomap/KakaoMapModal";

import icons from "../../assets/ImageList";

const UploadTakeCamera = ({ onClose }) => {
    const { isLoggedIn, profileInfo } = useUser();
    const { postList, setPostList, setPostSuccess } = usePost(
        isLoggedIn,
        profileInfo
    );
    const { openModal, closeModal, isModalOpen, toggleModal } = useModal();
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [text, setText] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");
    const maxTextLength = 2200;

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

    const handleEmojiClick = (emoji) => {
        setText(text + emoji);
        closeModal("emojiPicker");
    };

    const handleCapture = (imageSrc) => {
        setSelectedImage(imageSrc);
        closeModal("webcam");
    };

    const handleSubmit = async () => {
        try {
            openModal("loading");

            // selectedImage를 Blob 객체로 변환
            const imgResponse = await fetch(selectedImage);
            const blob = await imgResponse.blob();
            const file = new File([blob], "capturedImage.jpg", {
                type: blob.type,
            });

            const postData = { postContent: text };
            const formData = new FormData();
            formData.append(
                "post",
                new Blob([JSON.stringify(postData)], {
                    type: "application/json",
                })
            );

            if (file) {
                const breed = await PostService.classifyImage(file);

                formData.append("breed", breed);
                formData.append("file", file);
            } else {
                console.error("파일이 선택되지 않았습니다.");
                closeModal("loading");
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
        } finally {
            closeModal("loading");
        }
    };

    return (
        <div className="post-frame-container">
            {isModalOpen("loading") && <Loading />}
            <button
                className="post-close-modal"
                onClick={() => openModal("deleteConfirm")}
            >
                ✕
            </button>
            <div className="post-frame">
                <div className="post-header">
                    <div className="post-header-title">새 게시물 만들기</div>
                    <div className="post-header-upload" onClick={handleSubmit}>
                        공유하기
                    </div>
                </div>
                <div className="post-content">
                    <div className="post-image-section">
                        {selectedImage ? (
                            <div className="post-image-wrapper">
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="post-selected-image"
                                />
                            </div>
                        ) : (
                            <div>
                                <img
                                    className="post-image-icon"
                                    src={icons.photoIcon}
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
                                className="post-take-picture"
                                onClick={() => openModal("webcam")}
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
                                className="post-user-profile-image"
                                src={profileInfo.profileImageUrl}
                                alt="User Profile"
                            />
                            <div className="post-user-email">
                                {profileInfo.email}
                            </div>
                        </div>
                        <div className="post-textarea-section">
                            <textarea
                                className="post-textarea-content"
                                placeholder="문구를 입력하세요..."
                                value={text}
                                onChange={handleTextChange}
                            />
                            <div className="post-etc-section">
                                <img
                                    className="post-smile-icon"
                                    alt="smile"
                                    src={icons.smileIcon}
                                    onClick={() => toggleModal("emojiPicker")}
                                />
                                <div className="post-content-count">
                                    {text.length}/{maxTextLength}
                                </div>
                            </div>
                            {isModalOpen("emojiPicker") && (
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            )}
                        </div>
                        <PostOptions
                            openModal={openModal}
                            selectedAddress={selectedAddress}
                        />
                    </div>
                </div>
            </div>
            {isModalOpen("deleteConfirm") && (
                <DeleteConfirm closeModal={closeModal} onClose={onClose} />
            )}
            {isModalOpen("webcam") && (
                <WebcamComponent onCapture={handleCapture} />
            )}
            {isModalOpen("kakaoMap") && (
                <KakaoMapModal
                    onClose={() => closeModal("kakaoMap")}
                    setSelectedAddress={setSelectedAddress} // 주소 설정 함수 전달
                />
            )}
        </div>
    );
};

const PostOptions = ({ openModal, selectedAddress }) => (
    <div className="post-options">
        {[
            {
                label: "위치 ",
                icon: icons.locationIcon,
                onClick: () => openModal("kakaoMap"),
                showAddress: true, 
            },
            {
                label: "접근성",
                icon: icons.underArrowIcon,
                showAddress: false,
            },
            {
                label: "고급 설정",
                icon: icons.underArrowIcon,
                showAddress: false,
            },
        ].map((option, index) => (
            <div className="post-option" key={index} onClick={option.onClick}>
                <div className="post-options-text">
                    {option.label}
                    {option.showAddress && (
                        <span className="post-address"> {selectedAddress}</span>
                    )}
                </div>
                <img className="post-icon" alt="Frame" src={option.icon} />
            </div>
        ))}
    </div>
);

export default UploadTakeCamera;
