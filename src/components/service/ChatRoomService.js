import axios from "axios";

class ChatRoomService {
    static BASE_URL = "/api";

    // 메시지 작성
    static async sendMessage(formData) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${ChatRoomService.BASE_URL}/user/message/send`,
            formData,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // // 메세지 삭제
    // static async deleteMessage(commentId) {
    //   const token = localStorage.getItem('token');
    //   const response = await axios.delete(
    //     `${ChatRoomService.BASE_URL}/user/message/delete/${commentId}`,
    //     {
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );
    //   return response.data;
    // }

    // 채팅방 생성
    static async createChatRoom(chatRoomDTO) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${this.BASE_URL}/user/chatRooms`,
            chatRoomDTO,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 채팅방 및 메시지 목록 조회
    static async addUserToChatRoom(roomId) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${this.BASE_URL}/user/chatRooms/join/${roomId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }
}

export default ChatRoomService;
