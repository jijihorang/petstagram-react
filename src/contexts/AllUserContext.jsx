import React, { createContext, useState, useEffect, useCallback } from "react";
import useUser from "../components/hook/useUser";
import UserService from "../components/service/UserService";
import BasicImage from "../assets/basic-profile.jpeg";
import useReporting from "../components/hook/useReporting";

const AllUserContext = createContext();

export const AllUserProvider = ({ children }) => {
    const { isLoggedIn } = useUser();
    const { bannedMe } = useReporting();
    const [allUserProfiles, setAllUserProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getProfileImageUrl = (profileImage) => {
        if (profileImage && profileImage.imageUrl) {
            return `http://localhost:8088/uploads/${profileImage.imageUrl}`;
        }
        return BasicImage;
    };

    const fetchAllUsers = useCallback(async () => {
        try {
            let users;
            if (isLoggedIn) {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("로그인이 필요합니다.");
                users = await UserService.getAllUsers(token);
            } else {
                users = await UserService.getAllUsersWithoutAuth();
            }

            // 자신을 차단한 사용자를 필터링
            const bannedMeIds = bannedMe.map(user => user.reporterUserId);
            const filteredUsers = users.filter(user => !bannedMeIds.includes(user.id));

            const usersWithProfileImageUrls = filteredUsers.map((user) => ({
                ...user,
                profileImageUrl: getProfileImageUrl(user.profileImage),
            }));

            setAllUserProfiles(usersWithProfileImageUrls);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, [bannedMe, isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            setLoading(true);
            fetchAllUsers();
        }
    }, [isLoggedIn, fetchAllUsers]);

    useEffect(() => {
        setLoading(true);
        fetchAllUsers();
    }, [fetchAllUsers]);

    return (
        <AllUserContext.Provider
            value={{ allUserProfiles, loading, error, fetchAllUsers }}
        >
            {children}
        </AllUserContext.Provider>
    );
};

export { AllUserContext };
