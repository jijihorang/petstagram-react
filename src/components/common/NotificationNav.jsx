import React, { useEffect, useState } from "react";
import "./Notification.css";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

import useUser from "../hook/useUser";
import useAllUser from "../hook/useAllUser";
import usePost from "../hook/usePost";
import useNotifications from "../hook/useNotifications";
import useFollow from "../hook/useFollow";
import useComment from "../hook/useComment";
import useModal from "../hook/useModal";

import {
    categorizeNotifications,
    getDisplayTime,
} from "../../utils/GetNotiTime";
import PostViewModal from "../ui/PostViewUI/PostViewModal";
import useReporting from "../hook/useReporting";

const NotificationNav = () => {
    const { profileInfo } = useUser();
    const { allUserProfiles } = useAllUser();
    const { postList = [], deletePost } = usePost();
    const { openModal, closeModal, isModalOpen } = useModal();
    const { commentList, fetchAllComments } = useComment();
    const notifications = useNotifications(profileInfo.id);
    const { isFollowing, handleFollow, handleUnfollow } = useFollow();
    const { bannedUsers } = useReporting();

    const [selectedPost, setSelectedPost] = useState(null);
    const [modalType, setModalType] = useState("myfeed");
    const navigate = useNavigate();

    useEffect(() => {
        const newCommentNotification = notifications.find(
            (notification) => notification.eventType === "comment"
        );

        if (newCommentNotification) {
            fetchAllComments();
        }
    }, [notifications, fetchAllComments]);

    const getLikerImage = (fromUserId) => {
        const user = allUserProfiles.find((user) => user.id === fromUserId);
        return user ? user.profileImageUrl : "src/assets/default-profile.jpeg";
    };

    const getLikerEmail = (fromUserId) => {
        const user = allUserProfiles.find((user) => user.id === fromUserId);
        return user ? user.email : "Unknown";
    };

    const getImageUrl = (image) => {
        return `http://localhost:8088/uploads/${image.imageUrl}`;
    };

    const getPostImage = (postId) => {
        const post = postList.find((post) => post.id === postId);
        if (!post || !post.imageList || post.imageList.length === 0) {
            return "src/assets/default-post-image.jpeg";
        }
        return getImageUrl(post.imageList[0]);
    };

    const handleProfileClick = (fromUserId) => {
        const user = allUserProfiles.find((user) => user.id === fromUserId);
        if (user) {
            navigate(`/friendfeed/${user.email}`);
        }
    };

    const { today, yesterday, thisWeek, thisMonth, pastActivities } =
        categorizeNotifications(notifications);

    // 실시간 댓글 알림을 받으면 postId, commentId로 댓글 내용 불러옴
    const getCommentContent = (notification) => {
        const postComments =
            commentList.find((post) => post.postId === notification.postId)
                ?.comments || [];
        const comment = postComments.find(
            (c) => c.id === notification.commentId
        );
        return comment
            ? comment.commentContent
            : "댓글 내용을 불러오지 못했습니다.";
    };

    const getReplyContent = (notification) => {
        const postComments =
            commentList.find((post) => post.postId === notification.postId)
                ?.comments || [];
        const comment = postComments.find((c) =>
            c.replyCommentList.some(
                (reply) => reply.id === notification.replyId
            )
        );
        const reply = comment?.replyCommentList.find(
            (r) => r.id === notification.replyId
        );

        return reply
            ? reply.replyCommentContent
            : "대댓글 내용을 불러오지 못했습니다.";
    };

    const handleNotificationClick = (postId) => {
        const post = postList.find((post) => post.id === postId);
        if (post) {
            setSelectedPost(post);
            if (post.userId === profileInfo.id) {
                setModalType("myfeed");
            } else {
                setModalType("feed");
            }
            openModal("noti-postview");
        }
    };

    const renderNotification = (notification) => {
        /* 차단한 유저의 알림 숨김 */
        if (
            bannedUsers.some(
                (bannedUser) =>
                    bannedUser.reportedUserId === notification.fromUserId
            )
        ) {
            return null;
        }

        return (
            <div key={notification.id} className="notification-list">
                <div className="notification-type">
                    <div className="notification-list-wrapper">
                        <img
                            src={getLikerImage(notification.fromUserId)}
                            className="notification-profile-image"
                            alt="profile"
                            onClick={() =>
                                handleProfileClick(notification.fromUserId)
                            }
                        />
                    </div>
                    <div className="notification-content">
                        {/* 좋아요 알림 */}
                        {notification.eventType === "like" && (
                            <>
                                <div>
                                    <div
                                        className="notification-like"
                                        onClick={() => {
                                            handleNotificationClick(
                                                notification.postId
                                            );
                                        }}
                                    >
                                        <span className="notification-from-user">
                                            {getLikerEmail(
                                                notification.fromUserId
                                            )}
                                        </span>
                                        님이 회원님의 게시물을 좋아합니다.
                                        <span className="notification-regtime">
                                            {getDisplayTime(
                                                notification.regTime
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="notification-post-image-wrapper">
                                    <img
                                        src={getPostImage(notification.postId)}
                                        className="notification-post-image"
                                        alt="post"
                                    />
                                </div>
                            </>
                        )}

                        {/* 댓글 좋아요 알림 */}
                        {notification.eventType === "comment-like" && (
                            <>
                                <div>
                                    <div
                                        className="notification-like"
                                        onClick={() => {
                                            handleNotificationClick(
                                                notification.postId
                                            );
                                        }}
                                    >
                                        <span className="notification-from-user">
                                            {getLikerEmail(
                                                notification.fromUserId
                                            )}
                                        </span>
                                        님이 회원님의 댓글을 좋아합니다:{" "}
                                        <span>
                                            {getCommentContent(notification)}
                                        </span>
                                        <span className="notification-regtime">
                                            {getDisplayTime(
                                                notification.regTime
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="notification-post-image-wrapper">
                                    <img
                                        src={getPostImage(notification.postId)}
                                        className="notification-post-image"
                                        alt="post"
                                    />
                                </div>
                            </>
                        )}

                        {/* 대댓글 좋아요 알림 */}
                        {notification.eventType === "reply-like" && (
                            <>
                                <div>
                                    <div
                                        className="notification-like"
                                        onClick={() => {
                                            handleNotificationClick(
                                                notification.postId
                                            );
                                        }}
                                    >
                                        <span className="notification-from-user">
                                            {getLikerEmail(
                                                notification.fromUserId
                                            )}
                                        </span>
                                        님이 회원님의 댓글을 좋아합니다:{" "}
                                        <span>
                                            {getReplyContent(notification)}
                                        </span>
                                        <span className="notification-regtime">
                                            {getDisplayTime(
                                                notification.regTime
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="notification-post-image-wrapper">
                                    <img
                                        src={getPostImage(notification.postId)}
                                        className="notification-post-image"
                                        alt="post"
                                    />
                                </div>
                            </>
                        )}

                        {/* 팔로잉 알림 */}
                        {notification.eventType === "following" && (
                            <>
                                <div>
                                    <div className="notification-follow">
                                        {getLikerEmail(notification.fromUserId)}
                                        님이 팔로우하셨습니다.
                                        <span className="notification-regtime">
                                            {getDisplayTime(
                                                notification.regTime
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="notification-follow-btn">
                                    {isFollowing(notification.fromUserId) ? (
                                        <Button
                                            bgColor="rgb(239, 239, 239)"
                                            width="75px"
                                            color="rgb(0, 0, 0)"
                                            onClick={() =>
                                                handleUnfollow(
                                                    notification.fromUserId
                                                )
                                            }
                                        >
                                            팔로잉
                                        </Button>
                                    ) : (
                                        <Button
                                            bgColor="rgb(65, 147, 239)"
                                            width="75px"
                                            onClick={() =>
                                                handleFollow(
                                                    notification.fromUserId
                                                )
                                            }
                                        >
                                            팔로우
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}

                        {/* 댓글 알림 */}
                        {notification.eventType === "comment" && (
                            <>
                                <div>
                                    <div
                                        className="notification-comment"
                                        onClick={() => {
                                            handleNotificationClick(
                                                notification.postId
                                            );
                                        }}
                                    >
                                        <span className="notification-from-user">
                                            {getLikerEmail(
                                                notification.fromUserId
                                            )}
                                        </span>
                                        님이 댓글을 남겼습니다:{" "}
                                        <span>
                                            {getCommentContent(notification)}
                                        </span>
                                        <span className="notification-regtime">
                                            {getDisplayTime(
                                                notification.regTime
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="notification-post-image-wrapper">
                                    <img
                                        src={getPostImage(notification.postId)}
                                        className="notification-post-image"
                                        alt="post"
                                    />
                                </div>
                            </>
                        )}

                        {/* 대댓글 알림 */}
                        {notification.eventType === "reply" && (
                            <>
                                <div>
                                    <div
                                        className="notification-comment"
                                        onClick={() => {
                                            handleNotificationClick(
                                                notification.postId
                                            );
                                        }}
                                    >
                                        <span className="notification-from-user">
                                            {getLikerEmail(
                                                notification.fromUserId
                                            )}
                                        </span>
                                        님이 댓글을 남겼습니다:{" "}
                                        <span>
                                            {getReplyContent(notification)}
                                        </span>
                                        <span className="notification-regtime">
                                            {getDisplayTime(
                                                notification.regTime
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="notification-post-image-wrapper">
                                    <img
                                        src={getPostImage(notification.postId)}
                                        className="notification-post-image"
                                        alt="post"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="notification-container">
            <div className="notification-title">
                <h2>알림</h2>
            </div>

            <div className="notification-recent">
                {today.length > 0 && (
                    <>
                        <div className="notification-date">
                            <h4>오늘</h4>
                        </div>
                        {today.map(renderNotification)}
                    </>
                )}

                {yesterday.length > 0 && (
                    <>
                        <div className="notification-date">
                            <h4>어제</h4>
                        </div>
                        {yesterday.map(renderNotification)}
                    </>
                )}

                {thisWeek.length > 0 && (
                    <>
                        <div className="notification-date">
                            <h4>이번 주</h4>
                        </div>
                        {thisWeek.map(renderNotification)}
                    </>
                )}

                {thisMonth.length > 0 && (
                    <>
                        <div className="notification-date">
                            <h4>이번 달</h4>
                        </div>
                        {thisMonth.map(renderNotification)}
                    </>
                )}

                {pastActivities.length > 0 && (
                    <>
                        <div className="notification-date">
                            <h4>지난 활동</h4>
                        </div>
                        {pastActivities.map(renderNotification)}
                    </>
                )}
            </div>
            {isModalOpen("noti-postview") && selectedPost && (
                <PostViewModal
                    post={selectedPost}
                    deletePost={deletePost}
                    onClose={() => closeModal("noti-postview")}
                    modalType={modalType}
                />
            )}
        </div>
    );
};

export default NotificationNav;
