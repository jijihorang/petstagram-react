import React, { useEffect } from "react";
import "./Message.css";

import MessageList from "../common/MessageList";
import MessageRoom from "../common/MessageRoom";

import useChatRoom from "../hook/useChatRoom";
import useUser from "../hook/useUser";

const Message = () => {
    const { fetchChatMessageList, resetChatRoom, handleUserClick } =
        useChatRoom();
    const { isLoggedIn } = useUser();

    // 메시지 컴포넌트가 언마운트시에만 실행
    useEffect(() => {
        return () => {
            resetChatRoom();
        };
    }, []);

    // 채팅방 리스트 가져오기
    useEffect(() => {
        if (isLoggedIn) {
            fetchChatMessageList();
        }
    }, [isLoggedIn, fetchChatMessageList]);

    return (
        <div>
            <MessageList />
            <MessageRoom />
        </div>
    );
};

export default Message;
