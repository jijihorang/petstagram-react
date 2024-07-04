import axios from "axios";

class StoryService {
    static BASE_URL = "/api";

    /* 스토리 작성 */
    static async uploadStory(formData) {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("인증 토큰이 없습니다.");
            return;
        }

        try {
            const response = await axios.post(
                `${this.BASE_URL}/story/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            throw new Error("Failed to upload story");
        }
    }

    /* 모든 회원의 스토리 조회 */
    static async getStories() {
        try {
            const response = await axios.get(`${this.BASE_URL}/story/list`);
            return response.data;
        } catch (error) {
            console.error(
                "Failed to fetch stories",
                error.response ? error.response.data : error.message
            );
            throw new Error("Failed to fetch stories");
        }
    }

    /* 특정 사용자의 모든 스토리 조회 */
    static async getUserAllStories(userId) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/story/all-list/${userId}`
            );
            return response.data;
        } catch (error) {
            console.error(
                "Failed to fetch user stories",
                error.response ? error.response.data : error.message
            );
            throw new Error("Failed to fetch user stories");
        }
    }

    /* 특정 사용자의 유효한 스토리 조회 */
    static async getUserStories(userId) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/story/list/${userId}`
            );
            return response.data;
        } catch (error) {
            console.error(
                "Failed to fetch user stories",
                error.response ? error.response.data : error.message
            );
            throw new Error("Failed to fetch user stories");
        }
    }

    static async markStoryAsRead(storyId, userId) {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/story/read/${storyId}`,
                null,
                { params: { userId } }
            );
            return response.data;
        } catch (error) {
            console.log("스토리 읽음 처리 오류", error);
        }
    }

    static async isStoryRead(storyId, userId) {
        /* 여기서 받아온 userId는 현재 로그인 유저 */
        try {
            const response = await axios.get(
                `${this.BASE_URL}/story/read/${storyId}`,
                { params: { userId } }
            );
            return response.data;
        } catch (error) {
            console.error("Failed to check if story is read", error);
            throw new Error("Failed to check if story is read");
        }
    }

    static async getUserReadStories(userId) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/story/read/user/${userId}`
            );
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user read stories", error);
            throw new Error("Failed to fetch user read stories");
        }
    }
}

export default StoryService;
