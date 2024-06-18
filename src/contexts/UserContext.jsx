import React, { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import UserService from "../components/service/UserService";
import BasicImage from "../assets/basic-profile.jpeg";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(UserService.isAuthenticated());
    const [profileInfo, setProfileInfo] = useState({});

    const getProfileImageUrl = (profileImage) => {
        if (profileImage && profileImage.imageUrl) {
            return `http://localhost:8088/uploads/${profileImage.imageUrl}`;
        }
        return BasicImage;
    };

    const fetchProfileInfo = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await UserService.getMyProfile(token);
            const profileWithImageUrl = {
                ...response,
                profileImageUrl: getProfileImageUrl(response.profileImage),
            };
            setProfileInfo(profileWithImageUrl);
        } catch (error) {
            console.error("프로필 정보를 가져오는 중 오류 발생:", error);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp < currentTime) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                UserService.logout();
                setIsLoggedIn(false);
                return;
            } else {
                setIsLoggedIn(true);
                fetchProfileInfo();
            }
        }
    }, [isLoggedIn, fetchProfileInfo]);

    return (
        <UserContext.Provider
            value={{ isLoggedIn, setIsLoggedIn, profileInfo, fetchProfileInfo }}
        >
            {children}
        </UserContext.Provider>
    );
};

export { UserContext };
