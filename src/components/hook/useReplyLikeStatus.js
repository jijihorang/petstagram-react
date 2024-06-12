import { useState, useEffect, useCallback } from "react";
import useComment from "./useComment";

const useReplyLikeStatus = (replyCommentId) => {
    const { updateReplyLike, toggleReplyLike } = useComment();
    const [replyLiked, setReplyLiked] = useState(false);
    const [replyLikesCount, setReplyLikesCount] = useState(0);

    /* 대댓글 좋아요 */
    const fetchReplyLikeStatus = useCallback(async () => {
        const { replyLiked, replyLikesCount } = await updateReplyLike(replyCommentId);
        setReplyLiked(replyLiked);
        setReplyLikesCount(replyLikesCount);
    }, [replyCommentId, updateReplyLike]);

    useEffect(() => {
        fetchReplyLikeStatus();
    }, [fetchReplyLikeStatus]);

    /* 대댓글 좋아요 Click E  */
    const handleReplyLikeClick = useCallback(async () => {
        const likeChange = await toggleReplyLike(replyCommentId, replyLiked);
        setReplyLiked(!replyLiked);
        setReplyLikesCount((prevCount) => prevCount + likeChange);
    }, [replyCommentId, replyLiked, toggleReplyLike]);

    return { replyLiked, replyLikesCount, handleReplyLikeClick, fetchReplyLikeStatus };
};

export default useReplyLikeStatus;
