import React, { useState, useEffect, useRef } from "react";
import "./PostViewModal.css";
import GetRelativeTime from "../../../utils/GetRelativeTime";
import icons from "../../../assets/ImageList";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import useLikeStatus from "../../hook/useLikeStatus";
import useComment from "../../hook/useComment";
import useModal from "../../hook/useModal";
import useAllUser from "../../hook/useAllUser";

import PageEditModal from "../PageEditModal";
import MoreModal from "../MoreModal";

import PostViewComment from "./PostViewComment";
import PostViewFooter from "./PostViewFooter";
import useFollow from "../../hook/useFollow";
import BanReportModal from "../BanReportModal";

const PostViewModal = ({ post, deletePost, onClose, modalType }) => {
    const { allUserProfiles } = useAllUser();
    const { openModal, closeModal, isModalOpen, toggleModal } = useModal();
    const { postLiked, postLikesCount, handleLikeClick, likedUsers } =
        useLikeStatus(post.id);
    const { isFollowing, handleFollow, handleUnfollow } = useFollow();

    const [currentPost, setCurrentPost] = useState(post);
    const [commentText, setCommentText] = useState("");
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [replyingToEmail, setReplyingToEmail] = useState("");
    const [showReplies, setShowReplies] = useState({});

    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderRef = useRef(null);

    const {
        commentList,
        commentLikes,
        commentLiked,
        fetchAllComments,
        submitComment,
        submitReplyComment,
        handleCommentLikeClick,
        handleReplyCommentLikeClick,
        deleteComment,
        deleteReplyComment,
        fetchReplyComments,
        replyCommentLikes,
        replyCommentLiked,
    } = useComment();

    const getModalOptions = () => {
        const commonOptions = [
            {
                label: "취소",
                className: "moreoption-cancel",
                onClick: () => closeModal("more"),
            },
        ];
        switch (modalType) {
            case "myfeed":
                return [
                    {
                        label: "삭제",
                        className: "moreoption-remove",
                        onClick: handleDeletePost,
                    },
                    {
                        label: "수정",
                        className: "moreoption-edit",
                        onClick: () => openModal("edit"),
                    },
                    ...commonOptions,
                ]; 
            case "feed":
                return [
                    {
                        label: "신고",
                        className: "moreoption-report",
                        onClick: () => {
                            openModal("ban-report");
                            closeModal("more");
                        },
                    },
                    {
                        label: "이 계정 정보",
                        className: "moreoption-account",
                        onClick: () => {
                            console.log("이 계정 정보");
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
                    ...commonOptions,
                ];
            case "explorefeed":
                return [
                    {
                        label: "이 계정 정보",
                        className: "moreoption-account",
                        onClick: () => console.log("추후 작성"),
                    },
                    {
                        label: "팔로우 취소",
                        className: "moreoption-unfollow",
                        onClick: () => console.log("추후 작성"),
                    },
                    {
                        label: "공유",
                        className: "moreoption-share",
                        onClick: () => {
                            console.log("카카오톡 api 공유 추후 작성");
                            closeModal("more");
                        },
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
                    ...commonOptions,
                ];
            default:
                return commonOptions;
        }
    };

    const handleDeletePost = async () => {
        try {
            await deletePost(currentPost.id);
            closeModal("more");
            onClose();
        } catch (error) {
            console.error("게시글 삭제 중 오류가 발생했습니다.", error);
        }
    };

    const handleCommentSubmit = async () => {
        if (commentText.trim() !== "") {
            if (replyingToCommentId) {
                await submitReplyComment(replyingToCommentId, commentText);
                setReplyingToCommentId(null);
                setReplyingToEmail("");
            } else {
                await submitComment(currentPost.id, commentText);
            }
            setCommentText("");
            await fetchAllComments();
        }
    };

    const handleReplyClick = (commentId, email) => {
        setReplyingToCommentId(commentId);
        setReplyingToEmail(email);
        setCommentText(`@${email} `);
        document.querySelector(".postview-likes-input").focus();
    };

    const toggleReplies = (commentId) => {
        setShowReplies((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
        if (!showReplies[commentId]) fetchReplyComments(commentId);
    };

    const handleEmojiClick = (emoji) => {
        setCommentText(commentText + emoji);
        closeModal("emojiPicker");
    };

    const getUserProfileImage = (email) => {
        const user = allUserProfiles.find((user) => user.email === email);
        return user ? user.profileImageUrl : "";
    };

    const getImageUrl = (image) =>
        `http://localhost:8088/uploads/${image.imageUrl}`;

    const getVideoUrl = (video) =>
        `http://localhost:8088/uploads/${video.videoUrl}`;

    const postComments =
        commentList.find((c) => c.postId === currentPost.id)?.comments || [];

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (current, next) => setCurrentSlide(next),
        adaptiveHeight: true,
    };

    const next = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const previous = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    if (!currentPost) return null;

    return (
        <>
            <div className="postview-modal-overlay" onClick={onClose}>
                <div
                    className="postview-modal-container"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="postview-content">
                        <div className="postview-img-section">
                            <Slider {...sliderSettings} ref={sliderRef}>
                                {currentPost.imageList.map((image, index) => (
                                    <div key={index} className="postview-slide">
                                        <img
                                            className="postview-image"
                                            src={getImageUrl(image)}
                                            alt={`Post ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </Slider>
                            {currentSlide > 0 && (
                                <button
                                    className="slider-button slider-button-left"
                                    onClick={previous}
                                >
                                    {"<"}
                                </button>
                            )}
                            {currentSlide <
                                currentPost.imageList.length - 1 && (
                                <button
                                    className="slider-button slider-button-right"
                                    onClick={next}
                                >
                                    {">"}
                                </button>
                            )}

                            {currentPost.videoList &&
                                currentPost.videoList[0] && (
                                    <video
                                        controls
                                        src={getVideoUrl(
                                            currentPost.videoList[0]
                                        )}
                                        alt="동영상"
                                        className="postview-video"
                                    />
                                )}
                        </div>

                        <div className="postview-details-section">
                            <div className="postview-header-section">
                                <img
                                    src={getUserProfileImage(currentPost.email)}
                                    alt=""
                                    className="postview-profile-img"
                                />
                                <div className="postview-username">
                                    {currentPost.email}
                                </div>
                                <img
                                    src={icons.moreIcon}
                                    alt="more-icon"
                                    className="postview-more-icon"
                                    onClick={() => openModal("more")}
                                />
                                {isModalOpen("more") && (
                                    <MoreModal options={getModalOptions()} />
                                )}
                            </div>

                            <div className="postview-body-section">
                                <div className="postview-content-section">
                                    <img
                                        src={getUserProfileImage(
                                            currentPost.email
                                        )}
                                        alt=""
                                        className="postview-content-profile-img"
                                    />
                                    <div className="postview-content-details">
                                        <div className="postview-content-username-caption">
                                            <div className="postview-content-username">
                                                {currentPost.email}
                                            </div>
                                            <div className="postview-caption">
                                                {currentPost.postContent}
                                            </div>
                                        </div>
                                        <div className="postview-content-date">
                                            {GetRelativeTime(
                                                currentPost.regTime
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="postview-comments-section">
                                    {postComments.map((comment) => (
                                        <PostViewComment
                                            key={comment.id}
                                            comment={comment}
                                            getUserProfileImage={
                                                getUserProfileImage
                                            }
                                            handleReplyClick={handleReplyClick}
                                            handleCommentLikeClick={
                                                handleCommentLikeClick
                                            }
                                            isModalOpen={isModalOpen}
                                            openModal={openModal}
                                            closeModal={closeModal}
                                            fetchAllComments={fetchAllComments}
                                            deleteComment={deleteComment}
                                            deleteReplyComment={
                                                deleteReplyComment
                                            }
                                            fetchReplyComments={
                                                fetchReplyComments
                                            }
                                            handleReplyCommentLikeClick={
                                                handleReplyCommentLikeClick
                                            }
                                            showReplies={showReplies}
                                            toggleReplies={toggleReplies}
                                            commentLikes={commentLikes}
                                            commentLiked={commentLiked}
                                            replyCommentLiked={
                                                replyCommentLiked
                                            }
                                            replyCommentLikes={
                                                replyCommentLikes
                                            }
                                            modalType={modalType}
                                        />
                                    ))}
                                </div>

                                <PostViewFooter
                                    currentPost={currentPost}
                                    postLiked={postLiked}
                                    postLikesCount={postLikesCount}
                                    likedUsers={likedUsers}
                                    handleLikeClick={handleLikeClick}
                                    commentText={commentText}
                                    setCommentText={setCommentText}
                                    handleCommentSubmit={handleCommentSubmit}
                                    handleEmojiClick={handleEmojiClick}
                                    toggleModal={toggleModal}
                                    isModalOpen={isModalOpen}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen("edit") && (
                <PageEditModal
                    onClose={() => {
                        closeModal("edit");
                        closeModal("more");
                        onClose();
                    }}
                    allUserProfiles={allUserProfiles}
                    post={currentPost}
                    setCurrentPost={setCurrentPost}
                />
            )}

            {isModalOpen("ban-report") && (
                <BanReportModal
                    onClose={() => closeModal("ban-report")}
                    reportedUserId={currentPost.userId}
                    bannedUser={currentPost.email}
                />
            )}
        </>
    );
};

export default PostViewModal;
