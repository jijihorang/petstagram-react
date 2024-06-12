import axios from "axios";

class UserService {
    static BASE_URL = "/api";

    // 로그인
    static async login(email, password) {
        const response = await axios.post(
            `${UserService.BASE_URL}/user/login`,
            {
                email,
                password,
            }
        );
        return response.data;
    }

    // 회원가입
    static async signup(userData) {
        const response = await axios.post(
            `${UserService.BASE_URL}/user/signup`,
            userData
        );
        return response.data;
    }

    // 마이페이지
    static async getYourProfile(token) {
        const response = await axios.get(
            `${UserService.BASE_URL}/user/profile`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 회원 수정
    static async updateUser(userId, formData, token) {
        const response = await axios.put(
            `${UserService.BASE_URL}/user/edit/${userId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    }

    // 회원 삭제
    static async deleteUser(userId, token) {
        const response = await axios.delete(
            `${UserService.BASE_URL}/user/delete/${userId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 모든 회원 조회
    static async getAllUsers(token) {
        const response = await axios.get(
            `${UserService.BASE_URL}/user/getAllUsers`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 회원 한명 조회
    static async getUserById(userId, token) {
        const response = await axios.get(
            `${UserService.BASE_URL}/user/get/${userId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    /* ****** 팔로우, 팔로잉 서비스 ****** */
    // 팔로우
    static async follow(toUserId, token) {
        const response = await axios.post(
            `${UserService.BASE_URL}/user/follow/${toUserId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    // 언팔로우
    static async unfollow(toUserId, token) {
        const response = await axios.delete(
            `${UserService.BASE_URL}/user/unfollow/${toUserId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    // 팔로워 삭제
    static async deleteFollower(fromUserId, token) {
        const response = await axios.delete(
            `${UserService.BASE_URL}/user/deleteFollower/${fromUserId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    // 팔로우 상태 확인
    static async getFollowStatus(toUserId, token) {
        const response = await axios.get(
            `${UserService.BASE_URL}/user/follow-status/${toUserId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    // 팔로워 수 가져오기
    static async getFollowersCount(userId, token) {
        const response = await axios.get(
            `${UserService.BASE_URL}/user/followersCount/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    // 팔로잉 수 가져오기
    static async getFollowingsCount(userId, token) {
        const response = await axios.get(
            `${UserService.BASE_URL}/user/followingsCount/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    // 현재 로그인한 사용자의 팔로잉 리스트 가져오기
    static async getFollowings() {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${UserService.BASE_URL}/user/following`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    // 현재 로그인한 사용자의 팔로워 리스트 가져오기
    static async getFollowers() {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${UserService.BASE_URL}/user/followers`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    // 특정 사용자의 팔로잉 리스트 가져오기
    static async getFollowingsByUserId(userId, token) {
        const response = await axios.get(
            `${this.BASE_URL}/user/${userId}/following`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    // 특정 사용자의 팔로워 리스트 가져오기
    static async getFollowersByUserId(userId, token) {
        const response = await axios.get(
            `${this.BASE_URL}/user/${userId}/followers`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    /* ****** 신고 서비스 ****** */

    // 신고한 회원 목록
    static async getBannedUsers() {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${this.BASE_URL}/report/banned-users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    // 자신을 신고한 회원 목록
    static async getBannedMe() {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${this.BASE_URL}/report/banned-me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } 

    // 특정 회원 신고
    static async reportingBannedUser(formData, reportedUserId) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${this.BASE_URL}/report/banned/${reportedUserId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    }

    // 특정 회원 신고 취소
    static async unBanned(reportedUserId) {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${this.BASE_URL}/report/unbanned/${reportedUserId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    }

    // 특정 회원 누적 신고 조회
    static async reportingBannedCount(userId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${this.BASE_URL}/report/bannedCount/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem("role");
        return role === "ADMIN";
    }

    static isUser() {
        const role = localStorage.getItem("role");
        return role === "USER";
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;
