import axios from "axios";

class HashTagService {
    static BASE_URL = "/api";

    // 해시태그 리스트 조회
    static async getHashTagList() {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${HashTagService.BASE_URL}/hashtags/list`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    // 추천 해시태그 조회
    static async getPopularHashTags() {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${HashTagService.BASE_URL}/hashtags/popular-hashtags`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    // 해시태그 사용 횟수 조회
    static async getHashTagUsageCounts() {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${HashTagService.BASE_URL}/hashtags/usage-counts`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }
}

export default HashTagService;