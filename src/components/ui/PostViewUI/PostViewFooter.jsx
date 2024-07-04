import React from "react";
import icons from "../../../assets/ImageList";
import EmojiPicker from "../EmojiPicker";
import { getDisplayTime } from "../../../utils/GetNotiTime";

const PostViewFooter = ({
    currentPost,
    postLiked,
    postLikesCount,
    likedUsers,
    handleLikeClick,
    commentText,
    setCommentText,
    handleCommentSubmit,
    handleEmojiClick,
    toggleModal,
    isModalOpen,
}) => {
    return (
        <>
            <div className="postview-image-section">
                <div className="postview-icons-left">
                    <img
                        src={postLiked ? icons.heartFillIcon : icons.heartIcon}
                        alt="heart-icon"
                        className="postview-like-icon"
                        onClick={handleLikeClick}
                    />
                    <img
                        src={icons.commentIcon2}
                        alt="댓글"
                        className="postview-comment-icon"
                        onClick={() => document.querySelector(".postview-likes-input").focus()}
                    />
                </div>
                <img src={icons.bookMarkIcon2} alt="mark-icon" className="postview-mark-icon" />
            </div>

            <div className="postview-likes-section">
                {postLikesCount > 1 ? (
                    <span className="postview-likes-text">
                        <strong>{likedUsers[0]?.email}</strong>
                        님 외 {postLikesCount - 1} 명이 좋아합니다
                    </span>
                ) : postLikesCount === 1 ? (
                    <span className="postview-likes-text">좋아요 1개</span>
                ) : (
                    <span className="postview-likes-text">가장 먼저 좋아요를 눌러보세요</span>
                )}
            </div>
            <div className="postview-likes-date">{getDisplayTime(currentPost.regTime)}</div>

            <div className="postview-likes-input-section">
                <img src={icons.smileIcon} alt="smile-icon" className="postview-likes-input-icon" onClick={() => toggleModal("emojiPicker")} />
                <div className="postview-likes-form">
                    <input
                        placeholder="댓글 달기 ..."
                        className="postview-likes-input"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div onClick={handleCommentSubmit} className="postview-likes-post">
                        게시
                    </div>
                </div>
            </div>
            {isModalOpen("emojiPicker") && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        </>
    );
};

export default PostViewFooter;
