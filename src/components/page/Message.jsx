import React, { useState, useEffect } from "react";
import "./Message.css";
import useAllUser from "../hook/useAllUser";
import MessageList from "../common/MessageList";
import MessageRoom from "../common/MessageRoom";
import ChatRoomService from "../service/ChatRoomService";

const Message = () => {
    const { allUserProfiles } = useAllUser();
    const [chatRoom, setChatRoom] = useState(null); // 채팅방 ID를 저장할 상태
    const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자 저장할 상태
    const [messages, setMessages] = useState([]); // 메시지 상태 추가

    // 사용자 선택후 채팅방 생성
    const handleSelectedUser = async (selectedUser) => {
        console.log("선택된 사용자:", selectedUser);
        setSelectedUser(selectedUser); // 선택된 사용자 저장

        const chatRoomDTO = {
            userEmails: [selectedUser.email],
        };

        try {
            const response = await ChatRoomService.createChatRoom(chatRoomDTO);
            setChatRoom(response.id); // 채팅방 ID 저장
        } catch (error) {
            console.error("채팅방 생성 실패:", error);
        }
    };

    return (
        <div>
            <MessageList
                allUserProfiles={allUserProfiles}
                handleSelectedUser={handleSelectedUser}
                messages={messages} // 메시지 상태 전달
            />
            <MessageRoom
                chatRoom={chatRoom}
                allUserProfiles={allUserProfiles}
                selectedUser={selectedUser} // 선택된 사용자 상태 전달
                messages={messages} // 메시지 상태 전달
                setMessages={setMessages} // 메시지 상태 업데이트 함수 전달
            />
        </div>
    );
};

export default Message;
