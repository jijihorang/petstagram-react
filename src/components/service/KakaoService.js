import axios from "axios";

class KakaoService {
    static BASE_URL = "/api";

    static async getAccessToken(code) {
        try {
            const response = await axios.get(
                `${KakaoService.BASE_URL}/login/kakao?code=${code}`
            );
            return response.data;
        } catch (error) {
            console.error("로그인 실패: ", error.message);
            throw new Error("로그인 실패: " + error.message);
        }
    }
}

export default KakaoService;
