import React, { useState, useEffect } from "react";
import "./MyFeed.css";

import useUser from "../hook/useUser";
import useModal from "../hook/useModal";
import usePost from "../hook/usePost";
import useFollow from "../hook/useFollow";
import useFollowCounts from "../hook/useFollowCounts";

import ProfileUpdateModal from "../ui/ProfileUpdateModal";
import FollowListModal from "../ui/FollowListModal";
import SelectUpload from "../ui/SelectUpload";
import PostViewModal from "../ui/PostViewUI/PostViewModal";

import icons from "../../assets/ImageList";

import SettingModal from "../ui/settingUI/SettingModal";


const MyFeed = () => {
    const { profileInfo } = useUser();
    const { openModal, closeModal, isModalOpen } = useModal();
    const {
        postUserList = [],
        deletePost,
        fetchUserPosts,
        postSuccess,
    } = usePost();
    const {
        handleDeleteFollower,
        handleUnfollow,
        followerList,
        followingList,
        fetchFollowingList,
        fetchFollowerList,
    } = useFollow();

    const { followersCount, followingsCount, fetchFollowCounts } =
        useFollowCounts(profileInfo.id);

    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchUserPosts(profileInfo.id);
    }, [profileInfo, fetchUserPosts, postSuccess]);

    useEffect(() => {
        fetchFollowerList();
        fetchFollowingList();
    }, [fetchFollowCounts, fetchFollowerList, fetchFollowingList]);

    const handleFollowButtonClick = async (userId, action) => {
        await action(userId);
        await fetchFollowCounts();
    };

    const getImageUrl = (image) =>
        `http://localhost:8088/uploads/${image.imageUrl}`;

    const getVideoUrl = (video) =>
        `http://localhost:8088/uploads/${video.videoUrl}`;

    const handlePostView = (post) => {
        setSelectedPost(post);
        openModal("postview");
    };

    const images = postUserList.flatMap((post) => post.imageList);
    const videos = postUserList.flatMap((post) => post.videoList);

    return (
        <div className="myfeed-frame">
            <UserProfile
                profileInfo={profileInfo}
                postCount={postUserList.length}
                followersCount={followersCount}
                followingsCount={followingsCount}
                onProfileModalOpen={() => openModal("profileUpdate")}
                onFollowerModalOpen={() => openModal("followerList")}
                onFollowingModalOpen={() => openModal("followingList")}
                onUploadModalOpen={() => openModal("upload")}
                onSettingModalOpen={() => openModal("setting")}
            />
            <div className="myfeed-container">
                {images.length === 0 && videos.length === 0 ? (
                    <EmptyFeed onUploadModalOpen={() => openModal("upload")} />
                ) : (
                    <ImageGrid
                        posts={postUserList}
                        getImageUrl={getImageUrl}
                        getVideoUrl={getVideoUrl}
                        onMediaClick={handlePostView}
                    />
                )}
            </div>
            {isModalOpen("profileUpdate") && (
                <ProfileUpdateModal
                    onClose={() => closeModal("profileUpdate")}
                />
            )}
            {isModalOpen("upload") && (
                <SelectUpload onClose={() => closeModal("upload")} />
            )}
            {isModalOpen("followerList") && (
                <FollowListModal
                    title="팔로워"
                    followList={followerList}
                    onClose={() => closeModal("followerList")}
                    onButtonClick={(userId) =>
                        handleFollowButtonClick(userId, handleDeleteFollower)
                    }
                    buttonLabel="삭제"
                    fetchFollowCounts={fetchFollowCounts}
                    fetchFollowList={fetchFollowerList}
                />
            )}
            {isModalOpen("followingList") && (
                <FollowListModal
                    title="팔로잉"
                    followList={followingList}
                    onClose={() => closeModal("followingList")}
                    onButtonClick={(userId) =>
                        handleFollowButtonClick(userId, handleUnfollow)
                    }
                    buttonLabel="팔로잉"
                    fetchFollowCounts={fetchFollowCounts}
                    fetchFollowList={fetchFollowingList}
                />
            )}
            {isModalOpen("postview") && selectedPost && (
                <PostViewModal
                    post={selectedPost}
                    deletePost={deletePost}
                    onClose={() => closeModal("postview")}
                    modalType="myfeed"
                />
            )}
            {isModalOpen("setting") && ( // SettingModal 열림
                <SettingModal
                    onClose={() => closeModal("setting")}
                    profileInfo={profileInfo}
                />
            )}
        </div>
    );
};

const UserProfile = ({
    profileInfo,
    postCount,
    followersCount,
    followingsCount,
    onProfileModalOpen,
    onFollowerModalOpen,
    onFollowingModalOpen,
    onSettingModalOpen
}) => (
    <div className="myfeed-user-info">
        <div className="myfeed-user-avatar">
            <img src={profileInfo.profileImageUrl} alt="User Avatar" />
        </div>
        <div className="myfeed-user-main">
            <div className="myfeed-user-header">
                <h2 className="myfeed-user-name">{profileInfo.email}</h2>
                <div className="myfeed-user-actions">
                    <button
                        className="myfeed-edit-btn"
                        onClick={onProfileModalOpen}
                    >
                        프로필 편집
                    </button>
                    <button className="myfeed-story-btn">
                        보관된 스토리 보기
                    </button>
                    <button className="myfeed-settings-btn"> {/* 설정 버튼 클릭 시 SettingModal 열림 */}
                        <span onClick={onSettingModalOpen}>⚙️</span>
                    </button>
                </div>
            </div>
            <div className="myfeed-user-stats">
                <UserStat label="게시물" count={postCount} />
                <UserStat
                    label="팔로워"
                    count={followersCount}
                    onClick={onFollowerModalOpen}
                />
                <UserStat
                    label="팔로우"
                    count={followingsCount}
                    onClick={onFollowingModalOpen}
                />
            </div>
            <div className="myfeed-user-bio">
                <span className="myfeed-user-profile">{profileInfo.name}</span>
                {profileInfo.bio}
            </div>
        </div>
    </div>
);

const UserStat = ({ label, count, onClick }) => (
    <div className="myfeed-user-stat" onClick={onClick}>
        <span className="myfeed-stat-label">{label}</span>
        <span className="myfeed-stat-number">{count}</span>
    </div>
);

const EmptyFeed = ({ onUploadModalOpen }) => (
    <div className="myfeed-empty">
        <img src={icons.shareIcon} alt="No Photos" />
        <h1 className="myfeed-empty-title">사진 공유</h1>
        <p>사진을 공유하면 회원님의 프로필에 표시됩니다.</p>
        <button className="myfeed-upload-btn" onClick={onUploadModalOpen}>
            첫 사진 공유하기
        </button>
    </div>
);

const ImageGrid = ({ getImageUrl, getVideoUrl, posts, onMediaClick }) => {
    /* 게시글 등록 날짜 최신 순으로 정렬 */
    const sortedPosts = [...posts].sort(
        (a, b) => new Date(b.regTime) - new Date(a.regTime)
    );

    return (
        <div className="myfeed-grid-container">
            {sortedPosts.map((post, index) => (
                <div
                    key={index}
                    className="myfeed-grid-item"
                    onClick={() => onMediaClick(post)}
                >
                    {/* 이미지 렌더링 */}
                    {post.imageList && post.imageList.length > 0 && (
                        <div className="image-wrapper">
                            <img
                                src={getImageUrl(post.imageList[0])}
                                alt={`grid-${index}-img-0`}
                                className="myfeed-grid-image"
                            />
                            {post.imageList.length > 1 && (
                                <img
                                    src={icons.imageIcon}
                                    alt="multi-image-icon"
                                    className="myfeed-multi-image-icon"
                                />
                            )}
                        </div>
                    )}
                    {/* 동영상 렌더링 */}
                    {post.videoList && post.videoList.length > 0 && (
                        <div className="video-wrapper">
                            <video
                                key={index}
                                src={getVideoUrl(post.videoList[0])}
                                className="myfeed-grid-video"
                            >
                                Your browser does not support the video tag.
                            </video>
                            <img
                                src={icons.videoIcon}
                                alt="video-icon"
                                className="myfeed-video-icon"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyFeed;
