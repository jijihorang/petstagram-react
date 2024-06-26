import React, {
    createContext,
    useState,
    useCallback,
    useEffect,
    useContext,
} from "react";
import PostService from "../components/service/PostService";
import { UserContext } from "./UserContext";
import useReporting from "../components/hook/useReporting";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const { isLoggedIn, profileInfo } = useContext(UserContext);
    const { bannedUsers, fetchBannedUsers, bannedMe, fetchBannedMe } =
        useReporting();
    const [postList, setPostList] = useState([]);
    const [postUserList, setPostUserList] = useState([]);
    const [postSuccess, setPostSuccess] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            fetchBannedUsers();
            fetchBannedMe();
        }
    }, [isLoggedIn, fetchBannedUsers, fetchBannedMe]);

    /* 차단한 사용자 게시글 필터 */
    const filterBannedUserPosts = useCallback(
        (posts) => {
            const bannedUserIds = bannedUsers.map(
                (user) => user.reportedUserId
            );
            const bannedMeIds = bannedMe.map((user) => user.reporterUserId);
            return posts.filter(
                (post) =>
                    !bannedUserIds.includes(post.userId) &&
                    !bannedMeIds.includes(post.userId)
            );
        },
        [bannedUsers, bannedMe]
    );

    const fetchPosts = useCallback(async () => {
        try {
            const posts = await PostService.getPostList();
            const filteredPosts = filterBannedUserPosts(posts);
            setPostList(filteredPosts);
        } catch (error) {
            console.error("게시글을 가져오는 중 오류 발생:", error);
        }
    }, [filterBannedUserPosts]);

    const fetchUserPosts = useCallback(
        async (userId) => {
            if (userId) {
                try {
                    const postUserList = await PostService.getPostsByUserId(
                        userId
                    );
                    const filteredPosts = filterBannedUserPosts(postUserList);
                    setPostUserList(filteredPosts);
                } catch (error) {
                    console.error(
                        "사용자가 작성한 게시물을 가져오는 중 오류 발생:",
                        error
                    );
                }
            }
        },
        [filterBannedUserPosts]
    );

    /* 게시글 수정 */
    const updatePost = useCallback(async (post, currentFile, currentText) => {
        try {
            const postId = post.id;

            const updatedPost = {
                ...post,
                postContent: currentText,
            };

            const formData = new FormData();
            formData.append(
                "post",
                new Blob([JSON.stringify(updatedPost)], {
                    type: "application/json",
                })
            );
            if (currentFile) {
                // const currentBreed = await PostService.classifyImage(
                //     currentFile
                // );

                formData.append("breed", "");
                formData.append("file", currentFile);
            } else {
                // 기존 이미지 정보를 유지하기 위해 이미지 URL을 포함
                if (post.imageList && post.imageList.length > 0) {
                    formData.append("imageUrl", post.imageList[0].imageUrl);
                }
                if (post.videoList && post.videoList.length > 0) {
                    formData.append("videoUrl", post.videoList[0].videoUrl);
                }
            }

            const token = localStorage.getItem("token");
            const response = await PostService.updatePost(
                postId,
                formData,
                token
            );

            setPostSuccess(true);
            return response.data;
        } catch (error) {
            console.error("게시글 수정 중 오류가 발생했습니다.", error);
            throw error;
        }
    }, []);

    /* 게시글 삭제 */
    const deletePost = useCallback(async (postId) => {
        try {
            const token = localStorage.getItem("token");
            await PostService.deletePost(postId, token);
            setPostSuccess(true);
        } catch (error) {
            console.error("게시글 삭제 중 오류가 발생했습니다.", error);
            throw error;
        }
    }, []);

    /* 특정 게시물 좋아요 누른 사용자 목록 */
    const getLikesUserList = useCallback(async (postId) => {
        try {
            const users = await PostService.getPostLikesList(postId);
            return { likedUsers: users };
        } catch (error) {
            console.error("좋아요 리스트 오류", error);
            return { likedUsers: [] };
        }
    }, []);

    /* 특정 게시물 좋아요 상태 및 갯수 들고옴 */
    const updateLikeStatus = useCallback(async (postId) => {
        try {
            const { postLiked, postLikesCount } =
                await PostService.getPostLikeStatus(postId);
            return { postLiked, postLikesCount };
        } catch (error) {
            console.error(
                "좋아요 정보를 불러오는 중 오류가 발생했습니다.",
                error
            );
            return { postLiked: false, postLikesCount: 0 };
        }
    }, []);

    /* 좋아요 상태 토글 */
    const toggleLikeStatus = useCallback(async (postId, postLiked) => {
        try {
            await PostService.togglePostLike(postId);
            return postLiked ? -1 : 1;
        } catch (error) {
            console.error("좋아요 상태 변경 중 오류가 발생했습니다.", error);
            return 0;
        }
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            fetchPosts();
        }
    }, [isLoggedIn, fetchPosts]);

    useEffect(() => {
        if (isLoggedIn && profileInfo && profileInfo.id) {
            fetchUserPosts();
        }
    }, [isLoggedIn, profileInfo, fetchUserPosts, postSuccess]);

    useEffect(() => {
        if (postSuccess) {
            fetchPosts();
            fetchUserPosts();
            setPostSuccess(false);
        }
    }, [postSuccess, fetchPosts, fetchUserPosts]);

    useEffect(() => {
        if (bannedUsers.length > 0 || bannedMe.length > 0) {
            fetchPosts();
            fetchUserPosts(profileInfo.id);
        }
    }, [bannedUsers, bannedMe, fetchPosts, fetchUserPosts, profileInfo.id]);

    return (
        <PostContext.Provider
            value={{
                postList,
                postUserList,
                setPostList,
                setPostUserList,
                updatePost,
                deletePost,
                postSuccess,
                setPostSuccess,
                getLikesUserList,
                updateLikeStatus,
                toggleLikeStatus,
                fetchPosts,
                fetchUserPosts,
            }}
        >
            {children}
        </PostContext.Provider>
    );
};

export { PostContext };
