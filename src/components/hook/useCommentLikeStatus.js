import { useState, useEffect, useCallback } from "react";
import useComment from "./useComment";

const useCommentLikeStatus = (commentId) => {
    const { updateCommentLike, toggleCommentLike } = useComment();
    const [commentLiked, setCommentLiked] = useState(false);
    const [commentLikesCount, setCommentLikesCount] = useState(0);

    /* 댓글 좋아요 */
    const fetchCommentLikeStatus = useCallback(async () => {
        const { commentLiked, commentLikesCount } = await updateCommentLike(
            commentId
        );
        setCommentLiked(commentLiked);
        setCommentLikesCount(commentLikesCount);
    }, [commentId, updateCommentLike]);

    useEffect(() => {
        fetchCommentLikeStatus();
    }, [fetchCommentLikeStatus]);

    /* 댓글 좋아요 Click E  */
    const handleCommentLikeClick = useCallback(
        async (commentId) => {
            const likeChange = await toggleCommentLike(commentId, commentLiked);
            console.log(commentId);

            setCommentLiked(!commentLiked);
            setCommentLikesCount((prevCount) => prevCount + likeChange);
        },
        [commentLiked, toggleCommentLike]
    );

    return {
        commentLiked,
        commentLikesCount,
        handleCommentLikeClick,
        fetchCommentLikeStatus,
    };
};

export default useCommentLikeStatus;
