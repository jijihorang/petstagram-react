import React from "react";
import "./MessageList.css";
import { useNavigate } from "react-router-dom";

import useUser from "../hook/useUser";
import useChatRoom from "../hook/useChatRoom";
import useAllUser from "../hook/useAllUser";
import useModal from "../hook/useModal";

import CreateChatRoom from "../ui/message/CreateChatRoom";
import GetRelativeTime from "../../utils/GetRelativeTime";
import icons from "../../assets/ImageList";

const MessageList = () => {
    const { openModal, closeModal, isModalOpen } = useModal();
    const { chatMessageList, handleUserClick } = useChatRoom();
    const { allUserProfiles } = useAllUser();
    const { profileInfo, getProfileImageUrl } = useUser();
    const navigate = useNavigate();

    const handleChatRoomUserClick = async (chatRoomId) => {
        await handleUserClick(chatRoomId);
        navigate(`/messages/${chatRoomId}`, { state: { chatRoomId } }); // 채팅방 ID를 state로 전달
    };

    // 새로운 메시지가 있는지 확인하는 함수
    const hasNewMessage = (chatRoom) => {
        const unreadMessagesExist = chatRoom.messages.some(
            (message) => !message.hasUnreadMessage
        );
        return unreadMessagesExist;
    };

    return (
        <div className="messagelist">
            <div className="Message_title_div">
                <h2 className="Message_title_section">메시지</h2>
                <img
                    className="Message_message_edit"
                    src={icons.messageWrite}
                    alt="edit icon"
                    onClick={() => openModal("create-chatroom")}
                />
            </div>

            {chatMessageList.length > 0 ? (
                chatMessageList.map((chatRoom) => {
                    const isSender = chatRoom.senderId === profileInfo.id;
                    const otherUser = isSender
                        ? chatRoom.receiverName
                        : chatRoom.senderName;

                    const lastMessage =
                        chatRoom.messages.length > 0
                            ? chatRoom.messages[0].imageList &&
                              chatRoom.messages[0].imageList.length > 0
                                ? chatRoom.messages[0].senderId ===
                                  profileInfo.id
                                    ? "나: 사진을 보냈습니다."
                                    : "사진을 보냈습니다."
                                : chatRoom.messages[0].senderId ===
                                  profileInfo.id
                                ? `나: ${chatRoom.messages[0].messageContent}`
                                : chatRoom.messages[0].messageContent
                            : "메시지가 없습니다.";

                    const lastMessageTime =
                        chatRoom.messages.length > 0
                            ? GetRelativeTime(chatRoom.messages[0].regTime)
                            : "";

                    let profileImageUrl;
                    if (isSender) {
                        profileImageUrl = getProfileImageUrl(
                            allUserProfiles.find(
                                (user) => user.id === chatRoom.receiverId
                            )?.profileImage
                        );
                    } else {
                        profileImageUrl = getProfileImageUrl(
                            allUserProfiles.find(
                                (user) => user.id === chatRoom.senderId
                            )?.profileImage
                        );
                    }

                    const hasNew = hasNewMessage(chatRoom);

                    return (
                        <div
                            key={chatRoom.id}
                            className={`Message_message_item ${
                                hasNew ? "new-message" : "read-message"
                            }`}
                            onClick={() => handleChatRoomUserClick(chatRoom.id)}
                        >
                            <img
                                className="Message_profile_image"
                                src={profileImageUrl}
                                alt="Profile"
                            />
                            <div className="Message_message_info">
                                <div className="Message_user_name">
                                    {otherUser}
                                </div>
                                <div className="Message_message_text">
                                    {lastMessage}
                                    {" · "}
                                    <span className="Message_message_time">
                                        {lastMessageTime}
                                    </span>
                                </div>
                            </div>
                            {hasNew && <div className="Message_post-ellipse" />}
                        </div>
                    );
                })
            ) : (
                <div className="Message_message_text">메시지가 없습니다.</div>
            )}

            {isModalOpen("create-chatroom") && (
                <CreateChatRoom onClose={() => closeModal("create-chatroom")} />
            )}
        </div>
    );
};

export default MessageList;
