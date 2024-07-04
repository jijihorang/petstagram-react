import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const socketUrl = "http://localhost:8088/ws";
let stompClient = null;

export const connect = (
    chatRoomId,
    userEmail,
    onMessageReceived,
    onChatRoomListUpdate,
    onMessageCountUpdate
) => {
    const token = localStorage.getItem("token");
    const socket = new SockJS(`${socketUrl}?token=${token}`);

    stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
            // console.log(str);
        },
        onConnect: () => {
            // console.log("Connected to WebSocket");

            // 채팅방 구독 설정
            stompClient.subscribe(`/sub/chat/room/${chatRoomId}`, (message) => {
                const chatMessage = JSON.parse(message.body);
                onMessageReceived(chatMessage);
            });

            // 채팅방 리스트 구독 설정
            stompClient.subscribe(
                `/sub/chatRoomList/${userEmail}`,
                (message) => {
                    const chatRoomList = JSON.parse(message.body);
                    onChatRoomListUpdate(chatRoomList);
                }
            );

            // 메시지 개수 구독
            stompClient.subscribe(
                `/sub/messageCount/${userEmail}`,
                (message) => {
                    const messageCount = JSON.parse(message.body);
                    onMessageCountUpdate(messageCount);
                }
            );
        },
        onDisconnect: (frame) => {
            // console.log("Disconnected from WebSocket", frame);
        },
        onStompError: (frame) => {
            // console.error(`Broker reported error: ${frame.headers.message}`);
            // console.error(`Additional details: ${frame.body}`);
        },
    });

    stompClient.activate();
};

// 메시지 보내기
export const sendMessageWithImage = async (
    chatRoomId,
    senderId,
    receiverId,
    messageContent,
    imageUrls
) => {
    try {
        if (!stompClient || !stompClient.connected) {
            throw new Error("WebSocket not connected");
        }

        const payload = {
            chatRoomId,
            senderId,
            receiverId,
            messageContent,
            imageUrls,
        };

        // 메시지와 이미지를 함께 전송
        stompClient.publish({
            destination: `/pub/sendMessage/${chatRoomId}`,
            body: JSON.stringify(payload),
        });

    } catch (error) {
        console.error("Failed to send message:", error.message);
    }
};

// 음성 메시지 보내기
export const sendMessageWithAudio = async (
    chatRoomId,
    senderId,
    receiverId,
    audioUrl
) => {
    try {
        if (!stompClient || !stompClient.connected) {
            throw new Error("WebSocket not connected");
        }

        const payload = {
            chatRoomId,
            senderId,
            receiverId,
            audioUrl,
        };


        // 음성 메시지를 전송
        stompClient.publish({
            destination: `/pub/sendAudioMessage/${chatRoomId}`,
            body: JSON.stringify(payload),
        });

    } catch (error) {
        console.error("Failed to send audio message:", error.message);
    }
};

// WebSocket 연결 해제
export const disconnect = (chatRoomId, userEmail) => {
    if (stompClient && stompClient.connected) {
        // 사용자가 채팅방을 떠났음을 알리는 메시지 전송
        const payload = {
            chatRoomId,
            userEmail,
        };
        stompClient.publish({
            destination: `/pub/leaveRoom/${chatRoomId}`,
            body: JSON.stringify({ userEmail }),
        });

        stompClient.deactivate();
    }
};
