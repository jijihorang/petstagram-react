import axios from "axios";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";

class PostService {
    static BASE_URL = "/api";

    // 텐서플로우 이미지 분류
    static async classifyImage(file) {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);

        await new Promise((resolve) => {
            img.onload = resolve;
        });

        const model = await mobilenet.load();
        const predictions = await model.classify(img);

        return predictions[0].className;
    }

    // 모든 게시글 리스트 조회
    static async getPostList() {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${PostService.BASE_URL}/post/list`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    // 사용자가 작성한 게시물 조회
    static async getPostsByUserId(userId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${PostService.BASE_URL}/post/user/${userId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 게시글 작성
    static async createPost(formData, token) {
        try {
            const response = await axios.post(
                `${PostService.BASE_URL}/post/write`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("게시글 작성 중 오류 발생:", error);
            throw error;
        }
    }

    // 게시글 상세보기
    static async readPost(postId, token) {
        const response = await axios.get(
            `${PostService.BASE_URL}/post/read/${postId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 게시글 수정
    static async updatePost(postId, postData, token) {
        const response = await axios.put(
            `${PostService.BASE_URL}/post/update/${postId}`,
            postData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    }

    // 게시글 삭제
    static async deletePost(postId, token) {
        const response = await axios.delete(
            `${PostService.BASE_URL}/post/delete/${postId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 게시물 좋아요 추가
    static async togglePostLike(postId) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${PostService.BASE_URL}/post/toggle/${postId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 게시물 좋아요 상태
    static async getPostLikeStatus(postId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${PostService.BASE_URL}/post/status/${postId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 게시글 좋아요 누른 사용자 리스트
    static async getPostLikesList(postId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${PostService.BASE_URL}/post/likes/${postId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }
}

export default PostService;
