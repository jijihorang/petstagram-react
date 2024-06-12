import "./FriendNav.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserService from "../service/UserService";

import useUser from "../hook/useUser";
import useAllUser from "../hook/useAllUser";
import useModal from "../hook/useModal";
import useFollow from "../hook/useFollow";

import FollowCancelModal from "../ui/FollowCancelModal";
import useReporting from "../hook/useReporting";

const FriendNav = () => {
    const { setIsLoggedIn } = useUser();
    const { fetchAllUsers } = useAllUser();
    const { openModal, closeModal, isModalOpen } = useModal();
    const { bannedUsers } = useReporting();
    const { isFollowing, handleFollow, handleUnfollow } = useFollow();
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState(null);

    const handleLogout = () => {
        const confirmDelete = window.confirm("로그아웃 하시겠습니까?");
        if (confirmDelete) {
            UserService.logout();
            setIsLoggedIn(false);
        }
    };

    const openFollowCancelModal = (user) => {
        setSelectedUser(user);
        openModal("followCancel");
    };

    const closeFollowCancelModal = () => {
        setSelectedUser(null);
        closeModal("followCancel");
    };

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]);

    return (
        <div className="friendnav">
            <MyProfile onLogout={handleLogout} />
            <Recommendation
                isFollowing={isFollowing}
                openFollowCancelModal={openFollowCancelModal}
                handleFollow={handleFollow}
                navigate={navigate}
                bannedUsers={bannedUsers}
            />
            {selectedUser && isModalOpen("followCancel") && (
                <FollowCancelModal
                    isOpen={isModalOpen("followCancel")}
                    onClose={() => closeModal("followcancel")}
                    user={selectedUser}
                    onUnfollow={handleUnfollow}
                />
            )}
        </div>
    );
};

const MyProfile = ({ onLogout }) => {
    const { profileInfo } = useUser();

    return (
        <div className="friendnav-user-info">
            <img
                className="friendnav-user-profile-image"
                src={profileInfo.profileImageUrl}
                alt="Profile"
            />
            <div className="friendnav-user-profile">
                <div className="friendnav-user-profile-wrapper">
                    <div className="friendnav-user-email">
                        {profileInfo.email}
                    </div>
                    <div className="friendnav-user-name">
                        {profileInfo.name}
                    </div>
                </div>
            </div>
            <div className="friendnav-logout">
                <div className="friendnav-logout-btn" onClick={onLogout}>
                    로그아웃
                </div>
            </div>
        </div>
    );
};

const Recommendation = ({
    isFollowing,
    openFollowCancelModal,
    handleFollow,
    navigate,
    bannedUsers,
}) => {
    const { profileInfo } = useUser();
    const { allUserProfiles } = useAllUser();

    const bannedUserIds = bannedUsers.map(user => user.reportedUserId);

    return (
        <div>
            <div className="friendnav-recommend">
                <div className="friendnav-recommend-wrapper">
                    <div className="friendnav-recommend-text">
                        <div className="text-wrapper-8">회원님을 위한 추천</div>
                    </div>
                </div>
                <div className="friendnav-all-text-wrapper">
                    <div className="friendnav-all-text">모두 보기</div>
                </div>
            </div>

            <div className="friendnav-item-div">
                {allUserProfiles
                    .filter(
                        (user) =>
                            user.email !== profileInfo.email &&
                            user.isRecommend === true &&
                            !bannedUserIds.includes(user.id)
                    )
                    .slice(0, 5)
                    .map((user) => (
                        <div key={user.email} className="friendnav-item">
                            <div
                                className="friendnav-item-list"
                                onClick={() => {
                                    navigate(`/friendfeed/${user.email}`);
                                }}
                            >
                                <div className="friendnav-image-wrapper">
                                    <img
                                        src={user.profileImageUrl}
                                        className="friendnav-profile-image"
                                        alt="프로필 이미지"
                                    />
                                </div>

                                <div className="friendnav-recommend-user">
                                    <div className="friendnav-recommend-user-email">
                                        {user.email}
                                    </div>
                                    <div className="friendnav-recommend-user-text">
                                        회원님을 위한 추천
                                    </div>
                                </div>
                            </div>

                            <div>
                                {isFollowing(user.id) ? (
                                    <button
                                        className="friendnav-following-btn"
                                        onClick={() =>
                                            openFollowCancelModal(user)
                                        }
                                    >
                                        팔로잉
                                    </button>
                                ) : (
                                    <button
                                        className="friendnav-follow-btn"
                                        onClick={() => handleFollow(user.id)}
                                    >
                                        팔로우
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default FriendNav;
