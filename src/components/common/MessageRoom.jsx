import React, { useState } from "react";
import "./MessageRoom.css";
import ChatRoomService from "../service/ChatRoomService";

const MessageRoom = ({ chatRoom, selectedUser, messages, setMessages }) => {
    const [messageContent, setMessageContent] = useState(""); // 메시지 입력 상태 관리

    // 메시지 입력 핸들러
    const handleMessageChange = (event) => {
        setMessageContent(event.target.value);
    };

    // onKeyDown 이벤트 핸들러를 추가, Enter 키로 메시지 전송
    const handleKeyDown = async (event) => {
        if (event.key === "Enter") {
            await sendMessage();
        }
    };

    // 메시지 전송 핸들러
    const sendMessage = async () => {
        if (messageContent.trim() === "") return; // 메시지가 비어있는 경우 전송하지 않음

        const messageData = {
            messageContent: messageContent,
            chatRoomId: chatRoom,
            receiverEmail: selectedUser?.email, // 선택된 사용자의 이메일 동적 설정
        };

        try {
            const response = await ChatRoomService.sendMessage(messageData); // 메시지 전송
            console.log("메시지 전송 결과:", response);
            setMessageContent(""); // 메시지 전송 후 입력 필드 초기화

            // 새로운 메시지를 메시지 목록에 추가
            setMessages((prevMessages) => [
                ...prevMessages,
                { content: messageContent, ...response },
            ]);
        } catch (error) {
            console.error("메시지 전송 실패:", error);
        }
    };
    return (
        <div className="messageroom">
            <div className="user_container">
                <img className="profile_image1" />
                <div className="user_name_one">User_Name</div>
                <img
                    className="profile_detail"
                    src="../src/assets/message/material-symbols_info-outline.png"
                    alt="Info Icon"
                />
            </div>

            <div className="user_info">
                <img className="profile_image2" />
                <div className="user_name_two">{selectedUser?.name}</div>
                <div className="user_status">
                    {selectedUser?.email} • petstagram
                </div>
                <button
                    className="profile_btn"
                    onClick={() => {
                        selectedUser?.id;
                    }}
                >
                    프로필 보기
                </button>
            </div>

            <div className="message_list">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.sender ? "receive" : "send"}`}
                    >
                        {msg.messageContent}
                    </div>
                ))}
            </div>

            <div className="input_section">
                <img
                    className="smile_icon"
                    src="../src/assets/message/smile.png"
                    alt="smile icon"
                />
                <input
                    type="text"
                    className="input_message"
                    placeholder="메시지 입력 .."
                    value={messageContent}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                />
                <img
                    className="mic_icon"
                    src="../src/assets/message/bi_mic.png"
                    alt="mic icon"
                />
                <img
                    className="image_icon"
                    src="../src/assets/message/mynaui_image.png"
                    alt="image icon"
                />
            </div>
        </div>
    );
};

export default MessageRoom;
