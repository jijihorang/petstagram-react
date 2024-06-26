// MessageRoom.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./MessageRoom.css";
import {
    sendMessageWithImage,
    sendMessageWithAudio,
} from "../service/ChatWebSocketService.js";
import ChatRoomService from "../service/ChatRoomService";
import useChatRoom from "../hook/useChatRoom";
import useUser from "../hook/useUser";
import useModal from "../hook/useModal.js";
import useAudioRecorder from "../hook/useAudioRecorder.js";

import CreateChatRoom from "../ui/message/CreateChatRoom.jsx";
import CustomAudioPlay from "../ui/message/CustomAudioPlay.jsx";

import icons from "../../assets/ImageList.js";

const MessageRoom = () => {
    const { selectedUser, chatRoomId, messages } = useChatRoom();
    const { profileInfo } = useUser();
    const { openModal, closeModal, isModalOpen } = useModal();
    const {
        isRecording,
        audioBlob,
        startRecording,
        stopRecording,
        resetRecording,
    } = useAudioRecorder();
    const fileInputRef = useRef(null);
    const messageEndRef = useRef(null);

    const [messageContent, setMessageContent] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [recordingTime, setRecordingTime] = useState(0);
    const [isReset, setIsReset] = useState(true);
    
    const location = useLocation();

    const getImageUrl = (image) => {
        return `http://localhost:8088/uploads/${image.imageUrl}`;
    };

    const handleMessageChange = (e) => {
        setMessageContent(e.target.value);
    };

    const handleSendMessage = async () => {
        if (!messageContent && selectedImages.length === 0) {
            return;
        }

        let imageUrls = [];

        if (selectedImages.length > 0) {
            for (let image of selectedImages) {
                const imageToUpload = image.file;
                const imageUrl = await ChatRoomService.uploadImage(
                    imageToUpload
                );
                imageUrls.push(imageUrl);
            }
        }

        await sendMessageWithImage(
            chatRoomId,
            profileInfo.id,
            selectedUser.id,
            messageContent,
            imageUrls
        );

        setMessageContent("");
        setSelectedImages([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        scrollToBottom();
    };

    const handleSendAudioMessage = async () => {
        if (!audioBlob) {
            return;
        }

        const formData = new FormData();
        formData.append("file", audioBlob, "audioMessage.mp3");

        try {
            const response = await fetch("/api/user/uploadAudio", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await response.json();
            const audioUrl = data.audioUrl;

            await sendMessageWithAudio(
                chatRoomId,
                profileInfo.id,
                selectedUser.id,
                audioUrl
            );

            // Stop recording and reset states
            stopRecording();
            setAudioUrl("");
            setRecordingTime(0);
            setIsReset(true);
            setMessageContent("");
            setSelectedImages([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            scrollToBottom();
        } catch (error) {
            console.error("Failed to upload audio file:", error);
        }
    };

    useEffect(() => {
        if (audioBlob) {
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
        }
    }, [audioBlob]);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prevTime) => {
                    if (prevTime >= 59) {
                        stopRecording();
                        clearInterval(interval);
                        return 60;
                    }
                    return prevTime + 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRecording, stopRecording]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const fileObjects = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setSelectedImages((prevImages) => [...prevImages, ...fileObjects]);
    };

    const handleRemoveImage = (index) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((_, i) => i !== index)
        );
    };

    const handleEnterSubmit = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            handleSendMessage();
        }
    };

    const handleEmojiClick = (emoji) => {
        setMessageContent(messageContent + emoji);
        setShowEmojiPicker(false);
    };

    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCancelRecording = () => {
        stopRecording();
        setAudioUrl("");
        setRecordingTime(0);
        setShowEmojiPicker(false);
        setIsReset(true);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, chatRoomId]);

    useEffect(() => {
        setTimeout(scrollToBottom, 100);
    }, [location]);

    useEffect(() => {
        setMessageContent("");
        setSelectedImages([]);
        setAudioUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setRecordingTime(0);
        stopRecording();
        setIsReset(true);
    }, [chatRoomId]);

    if (!selectedUser) {
        return (
            <div className="messageroom-no-message-container">
                <div className="messageroom-no-message-wrapper">
                    <img
                        src=""
                        alt="추후 삽입"
                        className="messageroom-no-message-icon"
                    />
                    <h2>내 메시지</h2>
                    <p>친구나 그룹에 비공개 사진과 메시지를 보내세요</p>
                    <button
                        className="messageroom-no-message-btn"
                        onClick={() => openModal("create-chatroom")}
                    >
                        메시지 보내기
                    </button>
                </div>
            </div>
        );
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

    return (
        <div className="messageroom-container">
            <div className="messageroom-user-container">
                <img
                    className="messageroom-profile-image"
                    src={selectedUser?.profileImageUrl}
                />
                <div className="messageroom-user-name-one">
                    {selectedUser?.name}
                </div>
                <img
                    className="messageroom-profile-info"
                    src={icons.messageInfoIcon}
                    alt="Info Icon"
                />
            </div>

            <div
                className={`messageroom-scroll-section ${
                    selectedImages.length > 0 ? "image-selected" : ""
                }`}
            >
                <div className="messageroom-user-info">
                    <img
                        className="messageroom-user-info-profile-image"
                        src={selectedUser?.profileImageUrl}
                    />
                    <div className="messageroom-user-info-name">
                        {selectedUser?.name}
                    </div>
                    <div className="messageroom-user-info-status">
                        {selectedUser?.email} • petstagram
                    </div>
                    <button className="messageroom-profile-btn">
                        <Link to={`/friendfeed/${selectedUser?.email}`}>
                            프로필 보기
                        </Link>
                    </button>
                </div>

                <div className="messageroom-dm-section">
                    {messages
                        .filter((message) => message.chatRoomId === chatRoomId)
                        .map((message, index, array) => {
                            const isLastConsecutiveMessage =
                                index === array.length - 1 ||
                                array[index + 1].senderId !== message.senderId;

                            return (
                                <div
                                    key={index}
                                    className={`messageroom-dm-container ${
                                        message.senderId === profileInfo.id
                                            ? "sent"
                                            : "received"
                                    }`}
                                >
                                    {message.senderId !== profileInfo.id &&
                                        isLastConsecutiveMessage && (
                                            <img
                                                className="messageroom-dm-profile-image"
                                                src={
                                                    selectedUser?.profileImageUrl
                                                }
                                                alt="Profile"
                                            />
                                        )}
                                    <div
                                        className={`messageroom-dm ${
                                            message.senderId === profileInfo.id
                                                ? "sent"
                                                : "received"
                                        }`}
                                        style={{
                                            marginLeft:
                                                message.senderId !==
                                                    profileInfo.id &&
                                                !isLastConsecutiveMessage
                                                    ? "50px"
                                                    : "0",
                                        }}
                                    >
                                        <div className="messageroom-dm-content-wrapper">
                                            {message.imageList &&
                                                message.imageList.map(
                                                    (image, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={getImageUrl(
                                                                image
                                                            )}
                                                            alt={`Message ${
                                                                idx + 1
                                                            }`}
                                                            className="messageroom-dm-image"
                                                        />
                                                    )
                                                )}
                                            <div className="messageroom-dm-content">
                                                {message.messageContent}
                                            </div>
                                            {message.audioUrl && (
                                                <audio
                                                    controls
                                                    className="messageroom-dm-audio"
                                                >
                                                    <source
                                                        src={`http://localhost:8088/uploads/${message.audioUrl}`}
                                                        type="audio/webm"
                                                    />
                                                </audio>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    <div ref={messageEndRef} />
                </div>
            </div>

            <div className="messageroom-input-section">
                {selectedImages.length > 0 && (
                    <div className="messageroom-selected-image-container">
                        {selectedImages.map((image, index) => (
                            <div
                                key={index}
                                className="messageroom-selected-image-wrapper"
                            >
                                <img
                                    className="messageroom-selected-image-preview"
                                    src={image.url}
                                    alt={`Selected ${index}`}
                                />
                                <button
                                    className="messageroom-remove-image-btn"
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    x
                                </button>
                            </div>
                        ))}
                        <div
                            className="messageroom-selected-image_icon-wrapper"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <img
                                className="messageroom-selected-image_icon"
                                src={icons.messageImageInputIcon}
                                alt="image icon"
                            />
                        </div>
                    </div>
                )}
                <div className="messagerooom-input-wrapper">
                    {isRecording ? (
                        <>
                            <img
                                className="messageroom-close_icon"
                                src={icons.messageAudioClose}
                                alt="close icon"
                                onClick={handleCancelRecording}
                            />
                            <div className="audio-recording">
                                <div className="audio-recording-bar">
                                    <button
                                        className="audio-recording-stop-button"
                                        onClick={() => {
                                            stopRecording();
                                            setIsReset(false);
                                        }}
                                    >
                                        <img
                                            src={icons.messagePauseIcon}
                                            alt="Pause"
                                            className="audio-recoring-stop-button-img"
                                        />
                                    </button>
                                    <div
                                        className="audio-recording-bar-fill"
                                        style={{
                                            width: `${
                                                (recordingTime / 60) * 100
                                            }%`,
                                        }}
                                    ></div>
                                    <div className="audio-recording-time">
                                        {formatTime(recordingTime)}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {isReset ? (
                                <>
                                    <img
                                        className="messageroom-smile_icon"
                                        src={icons.messageSmileIcon}
                                        alt="smile icon"
                                        onClick={() =>
                                            setShowEmojiPicker(!showEmojiPicker)
                                        }
                                    />
                                    <input
                                        className="messagerooom-input-message"
                                        placeholder="메시지 입력 .."
                                        value={messageContent}
                                        onChange={handleMessageChange}
                                        onKeyUp={handleEnterSubmit}
                                    />
                                    {selectedImages.length > 0 ||
                                    messageContent ? (
                                        <button
                                            className="messageroom-send-dm"
                                            onClick={handleSendMessage}
                                        >
                                            보내기
                                        </button>
                                    ) : (
                                        <>
                                            <img
                                                className="messageroom-mic_icon"
                                                src={icons.messageMicIcon}
                                                alt="mic icon"
                                                onClick={() => {
                                                    startRecording();
                                                    setIsReset(false);
                                                }}
                                            />
                                            <img
                                                className="messageroom-image_icon"
                                                src={
                                                    icons.messageImageInputIcon2
                                                }
                                                alt="image icon"
                                                onClick={() =>
                                                    fileInputRef.current.click()
                                                }
                                            />
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    {audioUrl && (
                                        <div className="audio-preview">
                                            <img
                                                className="messageroom-close_icon"
                                                src={icons.messageAudioClose}
                                                alt="close icon"
                                                onClick={handleCancelRecording}
                                            />
                                            <CustomAudioPlay
                                                src={audioUrl}
                                                duration={recordingTime}
                                            />
                                        </div>
                                    )}

                                    <button
                                        className="messageroom-send-dm"
                                        onClick={handleSendAudioMessage}
                                    >
                                        보내기
                                    </button>
                                </>
                            )}
                        </>
                    )}
                    <input
                        type="file"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                    />
                </div>
            </div>

            {isModalOpen("create-chatroom") && (
                <CreateChatRoom onClose={() => closeModal("create-chatroom")} />
            )}
        </div>
    );
};

export default MessageRoom;
