import React, {
    createContext,
    useState,
    useCallback,
    useEffect,
    useContext,
} from "react";
import CommentService from "../components/service/CommentService";
import usePost from "../components/hook/usePost";

const CommentContext = createContext();

export const CommentProvider = ({ children }) => {
    const { postList = [] } = usePost();

    const [commentList, setCommentList] = useState([]);
    const [commentSuccess, setCommentSuccess] = useState(false);
    const [commentLikes, setCommentLikes] = useState({}); // 댓글 좋아요
    const [commentLiked, setCommentLiked] = useState({}); // 댓글 좋아요 상태

    const [replyComments, setReplyComments] = useState({});
    const [replySuccess, setReplySuccess] = useState(false);
    const [replyCommentLikes, setReplyCommentLikes] = useState({}); // 대댓글 좋아요
    const [replyCommentLiked, setReplyCommentLiked] = useState({}); // 대댓글 좋아요 상태

    /* 댓글 전체 조회 */
    const fetchAllComments = useCallback(async () => {
        try {
            const comments = await Promise.all(
                postList.map(async (post) => {
                    const postComments = await CommentService.getCommentList(
                        post.id
                    );
                    const likes = {};
                    const liked = {};
                    for (const comment of postComments) {
                        const { commentLiked, commentLikesCount } =
                            await CommentService.getPostCommentStatus(
                                comment.id
                            );
                        likes[comment.id] = commentLikesCount;
                        liked[comment.id] = commentLiked;
                    }
                    setCommentLikes((prev) => ({ ...prev, ...likes }));
                    setCommentLiked((prev) => ({ ...prev, ...liked }));
                    return { postId: post.id, comments: postComments };
                })
            );
            setCommentList(comments);
        } catch (error) {
            console.error("댓글 리스트 오류:", error);
        }
    }, [postList]);

    useEffect(() => {
        if (postList.length > 0) {
            fetchAllComments();
        }
    }, [postList, fetchAllComments]);

    /* 댓글 작성 */
    const submitComment = useCallback(async (postId, commentText) => {
        if (commentText.trim() === "") return;

        const commentData = {
            commentContent: commentText,
            id: postId,
        };

        try {
            await CommentService.writeComment(commentData, postId);
            setCommentSuccess(true);
        } catch (error) {
            console.log("댓글을 작성하는 중 오류가 발생했습니다.", error);
        }
    }, []);

    /* 댓글 삭제 */
    const deleteComment = useCallback(async (commentId) => {
        try {
            await CommentService.deleteComment(commentId);
            setCommentList((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );
            setCommentSuccess(true);
        } catch (error) {
            console.error(
                "댓글 삭제 중 오류가 발생했습니다:",
                error.response ? error.response.data : error.message
            );
        }
    }, []);

    /* 댓글 좋아요 상태 변경 */
    const handleCommentLikeClick = async (commentId) => {
        try {
            await toggleCommentLike(commentId);
        } catch (error) {
            console.error(
                "댓글 좋아요 상태 변경 중 오류가 발생했습니다.",
                error
            );
        }
    };

    /* 댓글 좋아요 상태 토글 */
    const toggleCommentLike = useCallback(
        async (commentId) => {
            try {
                await CommentService.toggleCommentLike(commentId);
                setCommentLiked((prev) => ({
                    ...prev,
                    [commentId]: !prev[commentId],
                }));
                setCommentLikes((prev) => ({
                    ...prev,
                    [commentId]:
                        prev[commentId] + (commentLiked[commentId] ? -1 : 1),
                }));
            } catch (error) {
                console.error(
                    "댓글 좋아요 상태 변경 중 오류가 발생했습니다.",
                    error
                );
            }
        },
        [commentLiked]
    );

    /* 대댓글 조회 */
    const fetchReplyComments = useCallback(async (commentId) => {
        try {
            const replies = await CommentService.getReplyCommentList(commentId);
            const replyLikes = {};
            const replyLiked = {};
            for (const reply of replies) {
                const { replyCommentLiked, replyCommentLikesCount } =
                    await CommentService.getReplyCommentLikeStatus(reply.id);
                replyLikes[reply.id] = replyCommentLikesCount;
                replyLiked[reply.id] = replyCommentLiked;
            }
            setReplyComments((prev) => ({ ...prev, [commentId]: replies }));
            setReplyCommentLikes((prev) => ({ ...prev, ...replyLikes }));
            setReplyCommentLiked((prev) => ({ ...prev, ...replyLiked }));
        } catch (error) {
            console.error("대댓글을 불러오는 중 오류가 발생했습니다.", error);
        }
    }, []);

    /* 대댓글 작성 */
    const submitReplyComment = useCallback(
        async (commentId, replyCommentText) => {
            if (replyCommentText.trim() === "") return;

            const replyCommentData = { replyCommentContent: replyCommentText };

            try {
                const newReplyComment = await CommentService.writeReplyComment(
                    commentId,
                    replyCommentData
                );
                setReplyComments((prev) => ({
                    ...prev,
                    [commentId]: [newReplyComment, ...(prev[commentId] || [])],
                }));
            } catch (error) {
                console.error("대댓글 작성 중 오류가 발생했습니다.", error);
            }
        },
        []
    );

    /* 대댓글 삭제 */
    const deleteReplyComment = useCallback(async (replyCommentId) => {
        try {
            await CommentService.deleteReplyComment(replyCommentId);
            setReplyComments((prev) => {
                const newReplies = { ...prev };
                for (const commentId in newReplies) {
                    newReplies[commentId] = newReplies[commentId].filter(
                        (reply) => reply.id !== replyCommentId
                    );
                }
                return newReplies;
            });
        } catch (error) {
            console.error(
                "대댓글 삭제 중 오류가 발생했습니다:",
                error.response ? error.response.data : error.message
            );
            alert("대댓글 삭제에 실패했습니다. 다시 시도해 주세요.");
        }
    }, []);

    /* 대댓글 좋아요 상태 변경 */
    const handleReplyCommentLikeClick = async (replyCommentId) => {
        try {
            await toggleReplyCommentLike(replyCommentId);
        } catch (error) {
            console.error(
                "대댓글 좋아요 상태 변경 중 오류가 발생했습니다.",
                error
            );
        }
    };

    /* 대댓글 좋아요 상태 토글 */
    const toggleReplyCommentLike = useCallback(
        async (replyCommentId) => {
            try {
                await CommentService.toggleReplyCommentLike(replyCommentId);
                setReplyCommentLiked((prev) => ({
                    ...prev,
                    [replyCommentId]: !prev[replyCommentId],
                }));
                setReplyCommentLikes((prev) => ({
                    ...prev,
                    [replyCommentId]:
                        prev[replyCommentId] +
                        (replyCommentLiked[replyCommentId] ? -1 : 1),
                }));
            } catch (error) {
                console.error(
                    "대댓글 좋아요 상태 변경 중 오류가 발생했습니다.",
                    error
                );
            }
        },
        [replyCommentLiked]
    );

    useEffect(() => {
        if (commentSuccess) {
            fetchAllComments();
            setCommentSuccess(false);
        }
    }, [commentSuccess, fetchAllComments]);

    useEffect(() => {
        if (replySuccess) {
            fetchReplyComments();
            setReplySuccess(false);
        }
    }, [replySuccess, fetchReplyComments]);

    return (
        <CommentContext.Provider
            value={{
                commentList,
                setCommentList,
                setCommentSuccess,
                fetchAllComments,
                submitComment,
                deleteComment,
                handleCommentLikeClick,
                commentLikes,
                commentLiked,
                replyComments,
                setReplyComments,
                setReplySuccess,
                fetchReplyComments,
                submitReplyComment,
                deleteReplyComment,
                handleReplyCommentLikeClick,
                replyCommentLikes,
                replyCommentLiked,
            }}
        >
            {children}
        </CommentContext.Provider>
    );
};

export { CommentContext };
