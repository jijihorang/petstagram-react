import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import UserService from "../components/service/UserService";
import useUser from "../components/hook/useUser";
import useAllUser from "../components/hook/useAllUser";

import BasicImage from "../assets/basic-profile.jpeg";

const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
    const { allUserProfiles } = useAllUser();
    const { profileInfo } = useUser();
    const [followedUsers, setFollowedUsers] = useState({});

    const [followerList, setFollowerList] = useState([]);
    const [userFollowerList, setUserFollowerList] = useState([]);

    const [followingList, setFollowingList] = useState([]);
    const [userFollowingList, setUserFollowingList] = useState([]);

    const token = localStorage.getItem("token");

    const getProfileImageUrl = (profileImage) => {
        if (profileImage && profileImage.imageUrl) {
            return `http://localhost:8088/uploads/${profileImage.imageUrl}`;
        }
        return BasicImage;
    };

    const fetchFollowStatus = useCallback(
        async (userId) => {
            try {
                const status = await UserService.getFollowStatus(userId, token);
                setFollowedUsers((prevState) => ({
                    ...prevState,
                    [userId]: status,
                }));
            } catch (error) {
                console.error("팔로우 상태 가져오기 중 오류 발생:", error);
            }
        },
        [token]
    );

    /* 다른 사용자들의 팔로우 상태 체크 */
    useEffect(() => {
        if (allUserProfiles && profileInfo.email) {
            allUserProfiles.forEach((user) => {
                if (user.email !== profileInfo.email) {
                    fetchFollowStatus(user.id);
                }
            });
        }
    }, [allUserProfiles, profileInfo.email, fetchFollowStatus]);

    /* 현재 로그인 유저 follwer 리스트 */
    const fetchFollowerList = useCallback(async () => {
        try {
            if (token) {
                const response = await UserService.getFollowers(token);
                const followersWithProfileImageUrls = response.map((follower) => ({
                    ...follower,
                    profileImageUrl: getProfileImageUrl(follower.profileImage),
                }));
                setFollowerList(followersWithProfileImageUrls);
            }
        } catch (error) {
            console.error("팔로워 가져오는 중 오류 발생:", error);
        }
    }, [token]);


    /* 현재 로그인 유저 follwing 리스트 */
    const fetchFollowingList = useCallback(async () => {
        try {
            if (token) {
                const response = await UserService.getFollowings(token);
                const followingsWithProfileImageUrls = response.map((following) => ({
                    ...following,
                    profileImageUrl: getProfileImageUrl(following.profileImage),
                }));
                setFollowingList(followingsWithProfileImageUrls);
            }
        } catch (error) {
            console.error("팔로잉 가져오는 중 오류 발생:", error);
        }
    }, [token]);

    /* 특정 사용자의 팔로워 리스트 */
    const fetchUserFollowerList = useCallback(async (userId) => {
        try {
            if (token) {
                const response = await UserService.getFollowersByUserId(userId, token);
                const followersWithProfileImageUrls = response.map((follower) => ({
                    ...follower,
                    profileImageUrl: getProfileImageUrl(follower.profileImage),
                }));
                setUserFollowerList(followersWithProfileImageUrls);
            }
        } catch (error) {
            console.error("특정 사용자 팔로워 가져오는 중 오류 발생:", error);
        }
    }, [token]);

    /* 특정 사용자의 팔로잉 리스트 */
    const fetchUserFollowingList = useCallback(async (userId) => {      
        try {
            if (token) {
                const response = await UserService.getFollowingsByUserId(userId, token);
                const followingsWithProfileImageUrls = response.map((following) => ({
                    ...following,
                    profileImageUrl: getProfileImageUrl(following.profileImage),
                }));
                setUserFollowingList(followingsWithProfileImageUrls);
            }
        } catch (error) {
            console.error("특정 사용자 팔로잉 가져오는 중 오류 발생:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchFollowerList();
        fetchFollowingList();

        return () => {
            setFollowerList([]);
            setFollowingList([]);
        };
    }, [fetchFollowerList, fetchFollowingList]);

    const handleFollow = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await UserService.follow(userId, token);
            setFollowedUsers((prevState) => ({
                ...prevState,
                [userId]: true,
            }));
        } catch (error) {
            console.error("팔로우 중 오류 발생:", error);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await UserService.unfollow(userId, token);
            setFollowedUsers((prevState) => ({
                ...prevState,
                [userId]: false,
            }));
        } catch (error) {
            console.error("언팔로우 중 오류 발생:", error);
        }
    };

    const handleDeleteFollower = async (userId) => {
        try {
            const token = localStorage.getItem("token");
            await UserService.deleteFollower(userId, token);
            setFollowedUsers((prevState) => ({
                ...prevState,
                [userId]: false,
            }));
        } catch (error) {
            console.error("팔로워 삭제 중 오류 발생:", error);
        }
    };

    const isFollowing = (userId) => followedUsers[userId] === true;

    return (
        <FollowContext.Provider
            value={{
                fetchFollowStatus,
                followedUsers,
                handleFollow,
                handleUnfollow,
                handleDeleteFollower,
                isFollowing,
                followerList,
                followingList,
                fetchFollowerList,
                fetchFollowingList,
                userFollowerList,
                userFollowingList,
                fetchUserFollowerList,
                fetchUserFollowingList,
            }}
        >
            {children}
        </FollowContext.Provider>
    );
};

export { FollowContext };
