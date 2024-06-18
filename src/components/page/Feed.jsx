import "./Feed.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useUser from "../hook/useUser";
import useAllUser from "../hook/useAllUser";
import usePost from "../hook/usePost";
import useLikeStatus from "../hook/useLikeStatus";
import useFollow from "../hook/useFollow";
import useComment from "../hook/useComment";
import useModal from "../hook/useModal";

import PostViewModal from "../ui/PostViewUI/PostViewModal";
import MoreModal from "../ui/MoreModal";
import BanReportModal from "../ui/BanReportModal";

import icons from "../../assets/ImageList";
import GetRelativeTime from "../../utils/GetRelativeTime";

import KakaoShare from "../ui/kakaoshare/KakaoShare";

const Feed = () => {
    const { profileInfo } = useUser();
    const { postList = [], deletePost } = usePost();
    const { commentList, submitComment } = useComment();
    const { openModal, closeModal, isModalOpen } = useModal();

    const [selectedPost, setSelectedPost] = useState(postList);
    const [modalType, setModalType] = useState("feed");

    const handlePostViewClick = (post) => {
        setSelectedPost(post);
        setModalType(profileInfo.email === post.email ? "myfeed" : "feed");
        openModal("postview");
    };

    return (
        <div>
            {postList.map((post) => {
                const postComments =
                    commentList.find((c) => c.postId === post?.id)?.comments ||
                    [];
                return (
                    post &&
                    post.id && (
                        <FeedItem
                            key={post.id}
                            post={post}
                            comments={postComments}
                            submitComment={submitComment}
                            handlePostViewClick={handlePostViewClick}
                            deletePost={deletePost}
                            profileInfo={profileInfo}
                        />
                    )
                );
            })}
            {isModalOpen("postview") && selectedPost && (
                <PostViewModal
                    post={selectedPost}
                    deletePost={deletePost}
                    onClose={() => closeModal("postview")}
                    modalType={modalType}
                />
            )}
        </div>
    );
};

const FeedItem = ({
    post,
    comments,
    submitComment,
    handlePostViewClick,
    deletePost,
    profileInfo,
}) => {
    const { allUserProfiles } = useAllUser();
    const { openModal, closeModal, isModalOpen } = useModal();
    const { postLiked, postLikesCount, handleLikeClick } = useLikeStatus(
        post.id
    );
    const { isFollowing, handleFollow, handleUnfollow } = useFollow();
    const navigate = useNavigate();
    const uploadPostTime = GetRelativeTime(post.regTime);
    const [commentText, setCommentText] = useState("");
    const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
    const [isBanReportModalOpen, setIsBanReportModalOpen] = useState(false);
    const [showFullContent, setShowFullContent] = useState(false);

    const getImageUrl = (image) => {
        return `http://localhost:8088/uploads/${image.imageUrl}`;
    };

    const getProfileImageUrlForWriter = (email) => {
        const user = allUserProfiles.find((user) => user.email === email);
        if (user && user.profileImageUrl) {
            return user.profileImageUrl;
        }
        return icons.BasicImage;
    };

    const getUserIdByEmail = (email) => {
        const user = allUserProfiles.find((user) => user.email === email);
        return user ? user.id : null;
    };

    const writerId = getUserIdByEmail(post.email);
    const profileImageUrl = getProfileImageUrlForWriter(post.email);

    const handleUserClick = () => {
        if (profileInfo.email === post.email) {
            navigate(`/profile`);
        } else {
            navigate(`/friendfeed/${post.email}`);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (commentText.trim() === "") return;

        await submitComment(post.id, commentText);
        setCommentText("");
    };

    const handleDeletePost = async () => {
        try {
            await deletePost(post.id);
            setIsMoreModalOpen(false);
        } catch (error) {
            console.error("게시글 삭제 중 오류가 발생했습니다.", error);
        }
    };

    const getMoreOptions = () => {
        const commonOptions = [
            {
                label: "취소",
                className: "moreoption-cancel",
                onClick: () => setIsMoreModalOpen(false),
            },
        ];

        if (profileInfo.email === post.email) {
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
        } else {
            return [
                {
                    label: "신고",
                    className: "moreoption-report",
                    onClick: () => {
                        setIsBanReportModalOpen(true);
                        setIsMoreModalOpen(false);
                    },
                },
                {
                    label: "이 계정 정보",
                    className: "moreoption-account",
                    onClick: () => {
                        console.log("이 계정 정보");
                        setIsMoreModalOpen(false);
                    },
                },
                {
                    label: "공유",
                    className: "moreoption-share",
                    onClick: () => setIsMoreModalOpen(false),
                },
                {
                    label: isFollowing(writerId)
                        ? "팔로우 취소"
                        : `${post.email}님 팔로우`,
                    className: isFollowing(writerId)
                        ? "moreoption-unfollow"
                        : "moreoption-follow",
                    onClick: async () => {
                        if (isFollowing(writerId)) {
                            await handleUnfollow(writerId);
                        } else {
                            await handleFollow(writerId);
                        }
                        setIsMoreModalOpen(false);
                    },
                },
                ...commonOptions,
            ];
        }
    };

    return (
        <div className="feed">
            <div className="feed-frame">
                <div className="feed-info">
                    <div className="feed-user-info" onClick={handleUserClick}>
                        <div>
                            <img
                                className="feed-profile-img"
                                src={profileImageUrl}
                                alt="프로필"
                            />
                        </div>
                        <div className="feed-writer-name">
                            {post.email}
                        </div>
                        <div>
                            <div className="feed-writer-date">
                                {"· " + uploadPostTime + " ·"}
                            </div>
                        </div>

                        {profileInfo.email !== post.email &&
                            writerId &&
                            (isFollowing(writerId) ? (
                                <button
                                    className="feed-user-following"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 상위 div의 onClick 이벤트 전파를 막기 위해 사용
                                        handleUnfollow(writerId);
                                    }}
                                >
                                    팔로잉
                                </button>
                            ) : (
                                <button
                                    className="feed-user-follow"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleFollow(writerId);
                                    }}
                                >
                                    팔로우
                                </button>
                            ))}
                    </div>
                    

                    <div className="feed-more">
                        <button
                            className="feed-more-btn"
                            onClick={() => {
                                setIsMoreModalOpen(true);
                                document.body.style.overflow = "hidden";
                            }}
                        >
                            <img
                                className="feed-more-img"
                                src={icons.moreIcon}
                                alt="더보기"
                            />
                        </button>
                        {isMoreModalOpen && (
                            <MoreModal options={getMoreOptions()} />
                        )}
                    </div>
                </div>
                {post.imageList && post.imageList.length > 0 && (
                    <div className="feed-post-photos">
                        {post.imageList.map((image, index) => (
                            <img
                                key={index}
                                className="feed-post-photo"
                                src={getImageUrl(image)}
                                alt={`Post ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
                <div className="feed-active">
                    <div className="feed-active-btn">
                        <img
                            className={`heart_img ${postLiked ? "liked" : ""}`}
                            alt="좋아요"
                            src={
                                postLiked
                                    ? icons.heartFillIcon
                                    : icons.heartIcon
                            }
                            onClick={handleLikeClick}
                        />
                         <img
                            className="comment_img"
                            alt="댓글"
                            src={icons.commentIcon}
                        />
                        <KakaoShare post={post} />  {/* KakaoShare 컴포넌트 사용 */}
                    </div>
                    <img
                        className="bookmark-img"
                        alt="저장"
                        src={icons.bookmarkIcon}
                    />
                </div>
                <div className="feed-post-info">
                    <div className="feed-heart-count">
                        좋아요 {postLikesCount}개
                    </div>
                    <div>
                        <p className="feed-post-content">
                            <span className="post-email-content-more">{post.email} </span>
                            <span className="post-content-more">
                                {showFullContent || post.postContent.length <= 15
                                    ? post.postContent
                                    : post.postContent.substring(0, 15) + "..."}
                            </span>
                            {post.postContent.length > 15 && !showFullContent && (
                                <span
                                    className="feed-post-more"
                                    onClick={() => setShowFullContent(true)}
                                >
                                    더 보기
                                </span>
                            )}
                        </p>
                    </div>

                    <div className="feed-comment-more">
                        <span onClick={() => handlePostViewClick(post)}>
                            댓글 {comments.length}개 모두 보기
                        </span>
                    </div>

                    <form
                        className="feed-comment"
                        onSubmit={handleCommentSubmit}
                    >
                        <input
                            type="text"
                            className="feed-comment-input"
                            placeholder="댓글 달기..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button type="submit" className="feed-comment-regi">
                            게시
                        </button>
                    </form>
                </div>
            </div>
            {isBanReportModalOpen && (
                <BanReportModal
                    onClose={() => {
                        setIsBanReportModalOpen(false);
                    }}
                    reportedUserId={getUserIdByEmail(post.email)}
                />
            )}
        </div>
    );
};

export default Feed;
