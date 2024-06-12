import { useState, useEffect, useCallback } from "react";
import UserService from "../service/UserService";
import useAllUser from "./useAllUser";
import BasicImage from "../../assets/basic-profile.jpeg";

const useFollowList = (userId) => {
    const { allUserProfiles } = useAllUser();
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [friendProfile, setFriendProfile] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const user = allUserProfiles.find(
            (profile) => profile.email === userId
        );
        setFriendProfile(user);
    }, [userId, allUserProfiles]);

    const getProfileImageUrl = (profileImage) => {
        if (profileImage && profileImage.imageUrl) {
            return `http://localhost:8088/uploads/${profileImage.imageUrl}`;
        }
        return BasicImage;
    };

    const fetchFollowers = useCallback(async () => {
        try {
            let response;
            if (friendProfile) {
                response = await UserService.getFollowersByUserId(
                    friendProfile.id,
                    token
                );
            } else {
                response = await UserService.getFollowers(token);
            }

            const followersWithProfileImageUrls = response.map((follower) => ({
                ...follower,
                profileImageUrl: getProfileImageUrl(follower.profileImage),
            }));

            setFollowers(followersWithProfileImageUrls);
        } catch (error) {
            console.error("팔로워 목록을 가져오는 데 실패했습니다:", error);
        }
    }, [friendProfile, token]);

    const fetchFollowings = useCallback(async () => {
        try {
            let response;
            if (friendProfile) {
                response = await UserService.getFollowingsByUserId(
                    friendProfile.id,
                    token
                );
            } else {
                response = await UserService.getFollowings(token);
            }

            const followingsWithProfileImageUrls = response.map(
                (following) => ({
                    ...following,
                    profileImageUrl: getProfileImageUrl(following.profileImage),
                })
            );

            setFollowings(followingsWithProfileImageUrls);
        } catch (error) {
            console.error("팔로잉 목록을 가져오는 데 실패했습니다:", error);
        }
    }, [friendProfile, token]);

    useEffect(() => {
        fetchFollowers();
        fetchFollowings();
    }, [fetchFollowers, fetchFollowings, userId]);

    return { fetchFollowers, fetchFollowings, followers, followings, friendProfile };
};

export default useFollowList;
