import axios from "axios";

class CommentService {
    static BASE_URL = "/api";

    // 댓글 리스트 조회
    static async getCommentList(postId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${CommentService.BASE_URL}/comment/list/${postId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    }

    // 댓글 작성
    static async writeComment(formData, postId) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${CommentService.BASE_URL}/comment/write/${postId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    }

    // 댓글 수정
    static async updateComment(commentId, commentData) {
        const token = localStorage.getItem("token");
        const response = await axios.put(
            `${CommentService.BASE_URL}/comment/update/${commentId}`,
            commentData,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 댓글 삭제
    static async deleteComment(commentId) {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${CommentService.BASE_URL}/comment/delete/${commentId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 댓글 좋아요 추가 및 삭제
    static async toggleCommentLike(commentId) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${CommentService.BASE_URL}/comment/toggle/${commentId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 댓글 좋아요 상태 조회
    static async getPostCommentStatus(commentId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${CommentService.BASE_URL}/comment/status/${commentId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 댓글 좋아요 누른 사용자 리스트
    static async getCommentLikedUsers(commentId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${CommentService.BASE_URL}/comment/liked/${commentId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 대댓글 작성
    static async writeReplyComment(commentId, formData) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${CommentService.BASE_URL}/comment/replywrite/${commentId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    }

    // 대댓글 리스트 조회
    static async getReplyCommentList(commentId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${CommentService.BASE_URL}/comment/replylist/${commentId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    }

    // 대댓글 삭제
    static async deleteReplyComment(replyCommentId) {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${CommentService.BASE_URL}/comment/replydelete/${replyCommentId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 대댓글 좋아요 추가 및 삭제
    static async toggleReplyCommentLike(replyCommentId) {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${CommentService.BASE_URL}/comment/replytoggle/${replyCommentId}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 대댓글 좋아요 상태 조회
    static async getReplyCommentLikeStatus(replyCommentId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${CommentService.BASE_URL}/comment/replystatus/${replyCommentId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }

    // 대댓글 좋아요 누른 사용자 리스트
    static async getReplyCommentLikedUsers(replyCommentId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${CommentService.BASE_URL}/comment/replyliked/${replyCommentId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    }
}

export default CommentService;
