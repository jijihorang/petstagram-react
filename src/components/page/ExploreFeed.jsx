import React, { useState } from "react";
import "./ExploreFeed.css";
import usePost from "../hook/usePost";
import useModal from "../hook/useModal";
import useComment from "../hook/useComment";
import PostViewModal from "../ui/PostViewUI/PostViewModal";
import useLikeStatus from "../hook/useLikeStatus";
import useFollow from "../hook/useFollow";
import icons from "../../assets/ImageList";

const ExploreFeed = () => {
    const { postList = [] } = usePost();
    const { openModal, closeModal, isModalOpen } = useModal();
    const { commentList } = useComment();
    const { isFollowing, handleFollow, handleUnfollow } = useFollow();
    const [selectedPost, setSelectedPost] = useState(null);
    const [modalType, setModalType] = useState("explorefeed");

    const handleMediaClick = (post) => {
        setSelectedPost(post);
        openModal("postview");
    };

    const getImageUrl = (image) => {
        return `http://localhost:8088/uploads/${image.imageUrl}`;
    };

    const getVideoUrl = (video) => {
        return `http://localhost:8088/uploads/${video.videoUrl}`;
    };

    const getModalOptions = (post) => {
        const commonOptions = [
            {
                label: "취소",
                className: "moreoption-cancel",
                onClick: () => closeModal("more"),
            },
        ];
        return [
            {
                label: "이 계정 정보",
                className: "moreoption-account",
                onClick: () => console.log("추후 작성"),
            },
            {
                label: isFollowing(post.userId)
                    ? "팔로우 취소"
                    : `${post.email}님 팔로우`,
                className: isFollowing(post.userId)
                    ? "moreoption-unfollow"
                    : "moreoption-follow",
                onClick: async () => {
                    if (isFollowing(post.userId)) {
                        await handleUnfollow(post.userId);
                    } else {
                        await handleFollow(post.userId);
                    }
                    closeModal("more");
                },
            },
            {
                label: "공유",
                className: "moreoption-share",
                onClick: () => {
                    console.log("카카오톡 api 공유 추후 작성");
                    closeModal("more");
                },
            },
            ...commonOptions,
        ];
    };

    return (
        <div className="explore">
            <div className="explore-frame">
                <div className="grid-container">
                    {postList.map((post) => (
                        <ExploreFeedItem
                            key={post.id}
                            post={post}
                            getImageUrl={getImageUrl}
                            getVideoUrl={getVideoUrl}
                            handleMediaClick={handleMediaClick}
                            commentList={commentList}
                        />
                    ))}
                </div>
            </div>

            {isModalOpen("postview") && selectedPost && (
                <PostViewModal
                    post={selectedPost}
                    onClose={() => closeModal("postview")}
                    modalType={modalType}
                    getModalOptions={getModalOptions}
                />
            )}
        </div>
    );
};

const ExploreFeedItem = ({ post, getImageUrl, getVideoUrl, handleMediaClick, commentList }) => {
    const { postLikesCount } = useLikeStatus(post.id);
    const postComments = commentList.find((c) => c.postId === post.id)?.comments || [];

    return (
        <div className="grid-item" onClick={() => handleMediaClick(post)}>
            {post.imageList && post.imageList.length > 0 && (
                <div className="image-wrapper">
                    <img
                        src={getImageUrl(post.imageList[0])}
                        alt="post-thumbnail"
                        className="explore-grid-image"
                    />
                    {post.imageList.length > 1 && (
                        <img
                            src={icons.imageIcon}
                            alt="multi-image-icon"
                            className="explore-multi-image-icon"
                        />
                    )}
                </div>
            )}
            {post.videoList && post.videoList.length > 0 && (
                <div className="video-wrapper">
                    <video
                        src={getVideoUrl(post.videoList[0])}
                        className="explore-grid-video"
                        controls
                    />
                    <img
                        src={icons.videoIcon}
                        alt="video-icon"
                        className="explore-video-icon"
                    />
                </div>
            )}
            <div className="overlay">
                <div className="info">
                    <span>
                        <img src={icons.heartwhite} alt="Likes" />
                    </span>
                    <span>{postLikesCount}</span>
                    <span>
                        <img src={icons.commentwhite} alt="Comments" />
                    </span>
                    <span>{postComments.length}</span>
                </div>
            </div>
        </div>
    );
};

export default ExploreFeed;
