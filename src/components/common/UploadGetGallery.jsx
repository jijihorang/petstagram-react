import "./UploadModal.css";
import * as mobilenet from "@tensorflow-models/mobilenet";
import React, { useRef, useEffect, useState } from "react";
import PostService from "../service/PostService";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import useModal from "../hook/useModal";
import useUser from "../hook/useUser";
import usePost from "../hook/usePost";

import Loading from "../ui/Loading";
import DeleteConfirm from "../ui/DeleteConfirm";
import EmojiPicker from "../ui/EmojiPicker";
import KakaoMapModal from "../ui/kakaomap/KakaoMapModal";
import HashTagsModal from "../ui/HashTagsModal";

import icons from "../../assets/ImageList";

const UploadGetGallery = ({ onClose }) => {
    const { isLoggedIn, profileInfo } = useUser();
    const { postList, setPostList, setPostSuccess } = usePost(
        isLoggedIn,
        profileInfo
    );
    const { openModal, closeModal, isModalOpen, toggleModal } = useModal();

    const fileInputRef = useRef(null);
    const sliderRef = useRef(null);

    const [selectedMedia, setSelectedMedia] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [mediaType, setMediaType] = useState("");
    const [text, setText] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [hashtags, setHashtags] = useState([]);

    const maxTextLength = 2200;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    if (file.type.startsWith("image")) {
                        resolve({ src: reader.result, file });
                    } else if (file.type.startsWith("video")) {
                        const video = document.createElement("video");
                        video.src = reader.result;
                        video.onloadedmetadata = () => {
                            const isLandscape =
                                video.videoWidth > video.videoHeight;
                            resolve({ src: reader.result, file, isLandscape });
                        };
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises)
            .then((media) => {
                const isImage = media.every((m) =>
                    m.file.type.startsWith("image")
                );
                const isVideo = media.every((m) =>
                    m.file.type.startsWith("video")
                );
                if (isImage) {
                    setSelectedMedia(media);
                    setMediaType("image");
                } else if (isVideo) {
                    setSelectedMedia(media);
                    setMediaType("video");
                } else {
                    console.error(
                        "이미지와 비디오를 혼합해서 업로드할 수 없습니다."
                    );
                }
            })
            .catch((error) => {
                console.error("파일을 읽는 중 오류가 발생했습니다:", error);
            });
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

    const handleSubmit = async () => {
        try {
            openModal("loading");
            const postData = { postContent: text, location: selectedAddress };
            const formData = new FormData();
            formData.append(
                "post",
                new Blob([JSON.stringify(postData)], {
                    type: "application/json",
                })
            );

            formData.append("hashtags", JSON.stringify(hashtags));

            if (selectedMedia && selectedMedia.length > 0) {
                if (mediaType === "image") {
                    for (let media of selectedMedia) {
                        const breed = await PostService.classifyImage(
                            media.file
                        );
                        console.log("Predictions: ", breed);

                        formData.append("breed", breed);
                        formData.append("file", media.file);
                    }
                } else if (mediaType === "video") {
                    setTimeout(() => {
                        formData.append("file", selectedMedia[0].file);
                        completeSubmit(formData);
                    }, 3000);
                    return;
                }
            } else {
                console.error("파일이 선택되지 않았습니다.");
                closeModal("loading");
                return;
            }

            completeSubmit(formData);
        } catch (error) {
            console.error("게시글 업로드 중 오류 발생:", error);
            setPostList(postList);
        }
    };

    const completeSubmit = async (formData) => {
        try {
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

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (current, next) => setCurrentSlide(next),
    };

    const next = () => {
        sliderRef.current.slickNext();
    };

    const previous = () => {
        sliderRef.current.slickPrev();
    };

    const handleAddHashtag = (hashtag) => {
        setHashtags([...hashtags, hashtag]);
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
                        {selectedMedia ? (
                            <div className="slider-container">
                                <Slider ref={sliderRef} {...sliderSettings}>
                                    {selectedMedia.map((media, index) => (
                                        <div key={index}>
                                            {mediaType === "image" ? (
                                                <img
                                                    src={media.src}
                                                    alt={`Selected ${index}`}
                                                    className="post-selected-image"
                                                />
                                            ) : (
                                                <video
                                                    controls
                                                    src={media.src}
                                                    className={
                                                        media.isLandscape
                                                            ? "post-selected-video landscape"
                                                            : "post-selected-video portrait"
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
                                </Slider>
                                {currentSlide > 0 && (
                                    <button
                                        className="post-slider-prev-btn"
                                        onClick={previous}
                                    >
                                        {"<"}
                                    </button>
                                )}
                                {currentSlide < selectedMedia.length - 1 && (
                                    <button
                                        className="post-slider-prev-next"
                                        onClick={next}
                                    >
                                        {">"}
                                    </button>
                                )}
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
                                display: selectedMedia ? "none" : "block",
                            }}
                        >
                            <div
                                className="post-file-select"
                                onClick={() => fileInputRef.current.click()}
                            >
                                컴퓨터에서 선택
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                multiple
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
                        <div className="post-hashtag-container">
                            <img
                                className="post-hashtag-icon"
                                alt="hashtag icon"
                                src={icons.addHashTagIcon}
                                onClick={() => openModal("addHashtag")}
                            />
                            <div className="post-hashtag-wrapper">
                                {hashtags.length === 0 ? (
                                    <div className="post-hashtags-empty">
                                        #해시태그
                                    </div>
                                ) : (
                                    hashtags.map((hashtag, index) => (
                                        <div
                                            key={index}
                                            className="post-hashtags"
                                        >
                                            {hashtag}
                                        </div>
                                    ))
                                )}
                            </div>
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
            {isModalOpen("kakaoMap") && (
                <KakaoMapModal
                    onClose={() => closeModal("kakaoMap")}
                    setSelectedAddress={setSelectedAddress}
                />
            )}
            {isModalOpen("addHashtag") && (
                <HashTagsModal
                    onClose={() => closeModal("addHashtag")}
                    onAddHashtag={handleAddHashtag}
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

export default UploadGetGallery;
