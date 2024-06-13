import React, { useState, useEffect } from "react";
import "./PostViewModal.css";
import GetRelativeTime from "../../../utils/GetRelativeTime";
import icons from "../../../assets/ImageList";

import useLikeStatus from "../../hook/useLikeStatus";
import useComment from "../../hook/useComment";
import useModal from "../../hook/useModal";
import useAllUser from "../../hook/useAllUser";

import PageEditModal from "../PageEditModal";
import MoreModal from "../MoreModal";

import PostViewComment from "./PostViewComment";
import PostViewFooter from "./PostViewFooter";

const PostViewModal = ({ post, deletePost, onClose, modalType }) => {
    const { allUserProfiles } = useAllUser();
    const { openModal, closeModal, isModalOpen, toggleModal } = useModal();
    const { postLiked, postLikesCount, handleLikeClick, likedUsers } =
        useLikeStatus(post.id);

    const [currentPost, setCurrentPost] = useState(post);
    const [commentText, setCommentText] = useState("");
    const [replyingToCommentId, setReplyingToCommentId] = useState(null);
    const [replyingToEmail, setReplyingToEmail] = useState("");
    const [showReplies, setShowReplies] = useState({});

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

    const postComments =
        commentList.find((c) => c.postId === currentPost.id)?.comments || [];

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
                            {currentPost.imageList &&
                                currentPost.imageList[0] && (
                                    <img
                                        src={`http://localhost:8088/uploads/${
                                            currentPost.imageList[0].imageUrl
                                        }?${new Date().getTime()}`}
                                        alt=""
                                        className="postview-image"
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
                              <div className="postview-username-location">
                                    <div className="postview-username">
                                        {currentPost.email}
                                    </div>
                                    <div className="postview-location">
                                        {currentPost.location}
                                    </div>
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
        </>
    );
};

export default PostViewModal;
