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

const MyFeed = () => {
    const { profileInfo } = useUser();
    const { openModal, closeModal, isModalOpen } = useModal();
    const { postUserList = [], deletePost, fetchUserPosts, postSuccess } = usePost();
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
    };

    const getImageUrl = (image) =>
        `http://localhost:8088/uploads/${image.imageUrl}`;

    const handlePostView = (post) => {
        setSelectedPost(post);
        openModal("postview");
    };

    const images = postUserList.flatMap((post) => post.imageList);

    return (
        <div className="myfeed-frame">
            <UserProfile
                profileInfo={profileInfo}
                imagesCount={images.length}
                followersCount={followersCount}
                followingsCount={followingsCount}
                onProfileModalOpen={() => openModal("profileUpdate")}
                onFollowerModalOpen={() => openModal("followerList")}
                onFollowingModalOpen={() => openModal("followingList")}
                onUploadModalOpen={() => openModal("upload")}
            />
            <div className="myfeed-container">
                {images.length === 0 ? (
                    <EmptyFeed onUploadModalOpen={() => openModal("upload")} />
                ) : (
                    <ImageGrid posts={postUserList} getImageUrl={getImageUrl} onImageClick={handlePostView} />
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
        </div>
    );
};

const UserProfile = ({
    profileInfo,
    imagesCount,
    followersCount,
    followingsCount,
    onProfileModalOpen,
    onFollowerModalOpen,
    onFollowingModalOpen,
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
                    <button className="myfeed-settings-btn">
                        <span>⚙️</span>
                    </button>
                </div>
            </div>
            <div className="myfeed-user-stats">
                <UserStat label="게시물" count={imagesCount} />
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

const ImageGrid = ({ getImageUrl, posts, onImageClick }) => (
    <div className="myfeed-grid-container">
        {posts.map((post, index) => (
            <div key={index} className="myfeed-grid-item" onClick={() => onImageClick(post)}>
                <img src={getImageUrl(post.imageList[0])} alt={`grid-${index}`} />
            </div>
        ))}
    </div>
);

export default MyFeed;
