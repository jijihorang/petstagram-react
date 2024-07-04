import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import "./FriendFeed.css";

import useUser from "../hook/useUser";
import useAllUser from "../hook/useAllUser";
import useFollow from "../hook/useFollow";
import usePost from "../hook/usePost";
import useFollowCounts from "../hook/useFollowCounts";

import FriendFollowModal from "../ui/FriendFollowListModal";
import useReporting from "../hook/useReporting";
import icons from "../../assets/ImageList";
import useModal from "../hook/useModal";
import MoreModal from "../ui/MoreModal";

const FriendFeed = () => {
    const { profileInfo } = useUser();
    const { userId } = useParams();
    const { allUserProfiles } = useAllUser();
    const {
        isFollowing,
        handleFollow,
        handleUnfollow,
        userFollowerList,
        userFollowingList,
        fetchUserFollowerList,
        fetchUserFollowingList,
        fetchFollowingList,
    } = useFollow();

    const { handleReportBanned, handleUnBanned, fetchBannedUsers, isBanned } =
        useReporting();
    const { postUserList, fetchUserPosts } = usePost();
    const [friendProfile, setFriendProfile] = useState(null);
    const [filteredPostUserList, setFilteredPostUserList] = useState([]);

    // 모달 상태 관리
    const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
    const [isFollowingModalOpen, setIsFollowingModalOpen] = useState(false);
    const { openModal, closeModal, isModalOpen } = useModal();

    const getImageUrl = (image) =>
        `http://localhost:8088/uploads/${image.imageUrl}`;

    const getVideoUrl = (video) =>
        `http://localhost:8088/uploads/${video.videoUrl}`;

    useEffect(() => {
        const user = allUserProfiles.find(
            (profile) => profile.email === userId
        );
        if (user) {
            setFriendProfile(user);
        }
    }, [userId, allUserProfiles]);

    const fetchData = useCallback(async () => {
        if (friendProfile?.id) {
            await fetchUserPosts(friendProfile.id);
            await fetchUserFollowerList(friendProfile.id);
            await fetchUserFollowingList(friendProfile.id);
            await fetchFollowingList();
        }
    }, [
        friendProfile,
        fetchUserPosts,
        fetchUserFollowerList,
        fetchUserFollowingList,
        fetchFollowingList,
    ]);

    useEffect(() => {
        if (friendProfile?.id) {
            fetchData();
        }
    }, [friendProfile, fetchData]);

    const { fetchFollowCounts, followersCount, followingsCount } =
        useFollowCounts(friendProfile ? friendProfile.id : null);

    const isCurrentlyFollowing = isFollowing(friendProfile?.id);
    const isBannedUser = isBanned(friendProfile?.id);

    useEffect(() => {
        if (isBannedUser) {
            setFilteredPostUserList([]);
        } else {
            setFilteredPostUserList(
                postUserList.sort(
                    (a, b) => new Date(b.regTime) - new Date(a.regTime)
                )
            );
        }
    }, [isBannedUser, postUserList]);

    useEffect(() => {
        fetchFollowCounts();
    }, [fetchFollowCounts, isCurrentlyFollowing]);

    if (!friendProfile) {
        return <div>Loading...</div>;
    }

    const handleFollowClick = async () => {
        if (isFollowing(friendProfile.id)) {
            await handleUnfollow(friendProfile.id);
            await fetchUserFollowerList(friendProfile.id);
        } else {
            await handleFollow(friendProfile.id);
            await fetchUserFollowerList(friendProfile.id);
        }
        fetchFollowCounts();
    };

    const handleBanClick = async () => {
        if (isBannedUser) {
            await handleUnBanned(friendProfile.id);
        } else {
            await handleReportBanned(friendProfile.id, "");
        }
        fetchBannedUsers();
        fetchFollowCounts();
    };

    const getFriendMore = () => {
        return [
            {
                label: isBannedUser ? "차단 해제" : "차단",
                className: isBannedUser
                    ? "friend-more-unbanned"
                    : "friend-more-banned",
                onClick: async () => {
                    await handleBanClick();
                    closeModal("friend-more");
                },
            },
            {
                label: "취소",
                className: "moreoption-cancel",
                onClick: () => closeModal("friend-more"),
            },
        ];
    };

    return (
        <div className="friendfeed-frame">
            <div className="friendfeed-user-info">
                <div className="friendfeed-user-avatar">
                    <img
                        src={friendProfile.profileImageUrl || ""}
                        alt="User Avatar"
                    />
                </div>
                <div className="friendfeed-user-main">
                    <div className="friendfeed-user-header">
                        <h2 className="friendfeed-user-email">
                            {friendProfile.email}
                        </h2>
                        <div className="friendfeed-user-actions">
                            {profileInfo.email !== friendProfile.email &&
                                (isBannedUser ? (
                                    <button
                                        className="friendfeed-unban-btn"
                                        onClick={handleBanClick}
                                    >
                                        차단 해제
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className={`friendfeed-follow-btn ${
                                                isFollowing(friendProfile.id)
                                                    ? "following"
                                                    : ""
                                            }`}
                                            onClick={handleFollowClick}
                                        >
                                            {isFollowing(friendProfile.id)
                                                ? "팔로잉"
                                                : "팔로우"}
                                        </button>
                                        <button className="friendfeed-dm-btn">
                                            메시지 보내기
                                        </button>
                                    </>
                                ))}
                            <button
                                className="friendfeed-more-btn"
                                onClick={() => openModal("friend-more")}
                            >
                                <img
                                    src={icons.moreIcon}
                                    alt="더보기"
                                    className="friendfeed-more-img"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="friendfeed-user-stats">
                        <div className="friendfeed-user-stat-post">
                            <span className="friendfeed-stat-label">
                                게시물
                            </span>
                            <span className="friendfeed-stat-number">
                                {filteredPostUserList.length}
                            </span>
                        </div>
                        <div
                            className="friendfeed-user-stat"
                            onClick={() => setIsFollowerModalOpen(true)}
                        >
                            <span className="friendfeed-stat-label">
                                팔로워
                            </span>
                            <span className="friendfeed-stat-number">
                                {followersCount}
                            </span>
                        </div>
                        <div
                            className="friendfeed-user-stat"
                            onClick={() => setIsFollowingModalOpen(true)}
                        >
                            <span className="friendfeed-stat-label">
                                팔로우
                            </span>
                            <span className="friendfeed-stat-number">
                                {followingsCount}
                            </span>
                        </div>
                    </div>
                    <div className="friendfeed-user-bio">
                        <span className="friendfeed-user-profile">
                            {friendProfile.name}
                        </span>
                        {friendProfile.bio}
                    </div>
                </div>
            </div>
            <div className="friendfeed-container">
                <div className="friendfeed-grid-container">
                    {filteredPostUserList.map((post, index) => (
                        <div key={index} className="friendfeed-grid-item">
                            {post.imageList && post.imageList.length > 0 && (
                                <div className="image-wrapper">
                                    <img
                                        src={getImageUrl(post.imageList[0])}
                                        alt={`grid-${index}-img-0`}
                                        className="friendfeed-grid-image"
                                    />
                                </div>
                            )}
                            {post.videoList && post.videoList.length > 0 && (
                                <video
                                    key={index}
                                    src={getVideoUrl(post.videoList[0])}
                                    className="friendfeed-grid-video"
                                >
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 팔로워 모달 */}
            {isFollowerModalOpen && (
                <FriendFollowModal
                    fetchFollowList={fetchUserFollowerList}
                    followList={userFollowerList}
                    onClose={() => setIsFollowerModalOpen(false)}
                    title="팔로워"
                />
            )}

            {/* 팔로잉 모달 */}
            {isFollowingModalOpen && (
                <FriendFollowModal
                    fetchFollowList={fetchUserFollowingList}
                    followList={userFollowingList}
                    onClose={() => setIsFollowingModalOpen(false)}
                    title="팔로잉"
                />
            )}

            {isModalOpen("friend-more") && (
                <MoreModal
                    options={getFriendMore()}
                    onClose={() => closeModal("friend-more")}
                />
            )}
        </div>
    );
};

export default FriendFeed;
