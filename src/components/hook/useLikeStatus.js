import { useState, useEffect, useCallback } from "react";
import usePost from "./usePost";

const useLikeStatus = (postId) => {
    const { updateLikeStatus, getLikesUserList, toggleLikeStatus } = usePost();
    const [postLiked, setPostLiked] = useState(false);
    const [postLikesCount, setPostLikesCount] = useState(0);
    const [likedUsers, setLikedUsers] = useState([]);

    /* 게시글 좋아요 상태 fetch */
    const fetchLikeStatus = useCallback(async () => {
        const { postLiked, postLikesCount } = await updateLikeStatus(postId);
        setPostLiked(postLiked);
        setPostLikesCount(postLikesCount);
    }, [postId, updateLikeStatus]);

    useEffect(() => {
        fetchLikeStatus();
    }, [fetchLikeStatus]);

    /* 게시글 좋아요 누른 사용자 목록 fetch */
    const fetchLikedUsers = useCallback(async () => {
        const { likedUsers } = await getLikesUserList(postId);
        setLikedUsers(likedUsers);
    }, [postId, getLikesUserList]);

    useEffect(() => {
        fetchLikedUsers();
    }, [fetchLikedUsers]);

    /* 게시글 좋아요 Click E  */
    const handleLikeClick = useCallback(async () => {
        const likeChange = await toggleLikeStatus(postId, postLiked);
        setPostLiked(!postLiked);
        setPostLikesCount((prevCount) => prevCount + likeChange);
    }, [postId, postLiked, toggleLikeStatus]);

    return {
        postLiked,
        postLikesCount,
        likedUsers,
        handleLikeClick,
        fetchLikeStatus,
        fetchLikedUsers,
    };
};

export default useLikeStatus;
