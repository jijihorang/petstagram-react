import { useState, useEffect, useCallback } from "react";
import UserService from "../service/UserService";

const useFollowCounts = (userId) => {
    const [followersCount, setFollowersCount] = useState(0);
    const [followingsCount, setFollowingsCount] = useState(0);

    const fetchFollowCounts = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            if (userId && token) {
                const followersResponse = await UserService.getFollowersCount(userId, token);
                setFollowersCount(followersResponse);

                const followingsResponse = await UserService.getFollowingsCount(userId, token);
                setFollowingsCount(followingsResponse);
            }
        } catch (error) {
            console.error("팔로우 숫자 가져오기 중 오류 발생:", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchFollowCounts();
    }, [fetchFollowCounts]);

    return {
        fetchFollowCounts,
        followersCount,
        followingsCount,
    };
};

export default useFollowCounts;
