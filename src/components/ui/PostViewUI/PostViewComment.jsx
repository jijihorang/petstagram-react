import React from "react";
import MoreModal from "../MoreModal";
import useUser from "../../hook/useUser"; 

import icons from "../../../assets/ImageList";
import { getDisplayTime } from "../../../utils/GetNotiTime";

const PostViewComment = ({
    comment,
    getUserProfileImage,
    handleReplyClick,
    handleCommentLikeClick,
    isModalOpen,
    openModal,
    closeModal,
    fetchAllComments,
    deleteComment,
    deleteReplyComment,
    handleReplyCommentLikeClick,
    showReplies,
    toggleReplies,
    commentLikes,
    commentLiked,
    replyCommentLikes,
    replyCommentLiked,
    modalType,
}) => {
    const { profileInfo } = useUser(); // 현재 로그인한 사용자 정보 가져오기

    const commentOptions = (modalType === "myfeed" || comment.commentEmail === profileInfo.email)
        ? [
            {
                label: "삭제",
                className: "moreoption-remove",
                onClick: async () => {
                    try {
                        await deleteComment(comment.id);
                        closeModal(`commentmore-${comment.id}`);
                        await fetchAllComments();
                    } catch (error) {
                        console.error("댓글 삭제 중 오류가 발생했습니다.", error);
                    }
                },
            },
            {
                label: "취소",
                className: "commentoption-cancel",
                onClick: () => closeModal(`commentmore-${comment.id}`),
            },
        ]
        : [
            {
                label: "신고",
                className: "moreoption-report",
                onClick: () => {
                    console.log("댓글 신고");
                    closeModal(`commentmore-${comment.id}`);
                },
            },
            {
                label: "취소",
                className: "commentoption-cancel",
                onClick: () => closeModal(`commentmore-${comment.id}`),
            },
        ];

    const replyCommentOptions = (reply) =>
        modalType === "myfeed" || reply.replyCommentEmail === profileInfo.email
            ? [
                  {
                      label: "삭제",
                      className: "moreoption-remove",
                      onClick: async () => {
                          try {
                              await deleteReplyComment(reply.id);
                              closeModal(`replycommentmore-${reply.id}`);
                              await fetchAllComments();
                          } catch (error) {
                              console.error(
                                  "대댓글 삭제 중 오류가 발생했습니다.",
                                  error
                              );
                          }
                      },
                  },
                  {
                      label: "취소",
                      className: "commentoption-cancel",
                      onClick: () => closeModal(`replycommentmore-${reply.id}`),
                  },
              ]
            : [
                  {
                      label: "신고",
                      className: "moreoption-report",
                      onClick: () => {
                          console.log("대댓글 신고");
                          closeModal(`replycommentmore-${reply.id}`);
                      },
                  },
                  {
                      label: "취소",
                      className: "commentoption-cancel",
                      onClick: () => closeModal(`replycommentmore-${reply.id}`),
                  },
              ];

    return (
        <div>
            <div className="postview-comments">
                <img
                    src={getUserProfileImage(comment.commentEmail)}
                    alt="댓글 사용자 이미지"
                    className="postview-comments-profile-img"
                />
                <div className="postview-comments-details">
                    <div className="postview-comments-header">
                        <div className="postview-comments-name">
                            {comment.commentEmail}
                        </div>
                        <div className="postview-comments-content">
                            {comment.commentContent}
                        </div>
                    </div>
                    <div className="postview-comments-footer">
                        <div className="postview-comments-date">
                            {getDisplayTime(comment.commentRegTime)}
                        </div>
                        {commentLikes[comment.id] > 0 && (
                            <div className="postview-comments-likes">
                                좋아요 {commentLikes[comment.id]}개
                            </div>
                        )}
                        <div
                            className="postview-comments-reply"
                            onClick={() =>
                                handleReplyClick(
                                    comment.id,
                                    comment.commentEmail
                                )
                            }
                        >
                            답글 달기
                        </div>
                        <img
                            src={icons.moreIcon2}
                            alt="더보기"
                            className="postview-comments-more-icon"
                            onClick={() =>
                                openModal(`commentmore-${comment.id}`)
                            }
                        />
                    </div>
                </div>
                <img
                    src={
                        commentLiked[comment.id]
                            ? icons.heartFillIcon
                            : icons.heartIcon
                    }
                    alt="heart-icon"
                    className="postview-heart"
                    onClick={() => handleCommentLikeClick(comment.id)}
                />
                {isModalOpen(`commentmore-${comment.id}`) && (
                    <MoreModal
                        key={`commentmore-${comment.id}`}
                        options={commentOptions}
                    />
                )}
            </div>
            {comment.replyCommentList &&
                comment.replyCommentList.length > 0 && (
                    <div
                        className="postview-toggle-replies"
                        onClick={() => toggleReplies(comment.id)}
                    >
                        <img
                            src={icons.lineIcon}
                            alt="line-icon"
                            className="postview-toggle-replies-line-icon"
                        />
                        {showReplies[comment.id]
                            ? "답글 숨기기"
                            : `답글 보기 (${comment.replyCommentList.length}개)`}
                    </div>
                )}
            {showReplies[comment.id] && (
                <div
                    className="postview-reply-comments-section"
                    key={`replies-${comment.id}`}
                >
                    {comment.replyCommentList.map((reply) => (
                        <div className="postview-reply-comment" key={reply.id}>
                            <img
                                src={getUserProfileImage(
                                    reply.replyCommentEmail
                                )}
                                alt="대댓글 사용자 이미지"
                                className="postview-reply-comments-profile-img"
                            />
                            <div className="postview-reply-comments-details">
                                <div className="postview-reply-comments-header">
                                    <div className="postview-reply-comments-name">
                                        {reply.replyCommentEmail}
                                    </div>
                                    <div className="postview-reply-comments-content">
                                        {reply.replyCommentContent}
                                    </div>
                                </div>
                                <div className="postview-reply-comments-footer">
                                    <div className="postview-reply-comments-date">
                                        {getDisplayTime(
                                            reply.replyCommentRegTime
                                        )}
                                    </div>
                                    {replyCommentLikes[reply.id] > 0 && (
                                        <div className="postview-reply-comments-likes">
                                            좋아요 {replyCommentLikes[reply.id]}
                                            개
                                        </div>
                                    )}
                                    <div
                                        className="postview-comments-reply"
                                        onClick={() =>
                                            handleReplyClick(
                                                comment.id,
                                                reply.replyCommentEmail
                                            )
                                        }
                                    >
                                        답글 달기
                                    </div>
                                    <img
                                        src={icons.moreIcon2}
                                        alt="더보기 이모티콘"
                                        className="postview-reply-comments-more-icon"
                                        onClick={() =>
                                            openModal(
                                                `replycommentmore-${reply.id}`
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <img
                                src={
                                    replyCommentLiked[reply.id]
                                        ? icons.heartFillIcon
                                        : icons.heartIcon
                                }
                                alt="heart-icon"
                                className="postview-heart"
                                onClick={() =>
                                    handleReplyCommentLikeClick(reply.id)
                                }
                            />
                            {isModalOpen(`replycommentmore-${reply.id}`) && (
                                <MoreModal
                                    key={`replycommentmore-${reply.id}`}
                                    options={replyCommentOptions(reply)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostViewComment;
