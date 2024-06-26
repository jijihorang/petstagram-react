import { useState, useEffect, useCallback } from "react";
import UserService from "../service/UserService";
import useUser from "./useUser";

const useReporting = () => {
    const {  isLoggedIn } = useUser();
    const [bannedUsers, setBannedUsers] = useState([]);
    const [bannedMe, setBannedMe] = useState([]);

    /* 신고 회원 목록 조회 */
    const fetchBannedUsers = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            const banned = await UserService.getBannedUsers();
            setBannedUsers(banned);
        } catch (error) {
            console.error("신고한 회원 목록 조회 오류", error);
        }
    }, [isLoggedIn]);

    const fetchBannedMe = useCallback(async () => {
        if (!isLoggedIn) return;
        try {
            const bannedMeList = await UserService.getBannedMe();
            setBannedMe(bannedMeList);
        } catch (error) {
            console.error("자신을 신고한 회원 목록 조회 오류", error);
        }
    }, [isLoggedIn]);

    /* 신고 핸들러 (차단) */
    const handleReportBanned = useCallback(
        async (reportedUserId, reason) => {
            const formData = {
                reason: reason,
                reportedUserId: reportedUserId,
            };

            try {
                await UserService.reportingBannedUser(formData, reportedUserId);
                await fetchBannedUsers();
            } catch (error) {
                if (error.response && error.response.status === 409) {
                    alert("이미 신고된 회원입니다.");
                } else {
                    alert("신고 중 오류 발생");
                    console.log("신고 중 오류 발생", error);
                }
                throw error;
            }
        },
        [fetchBannedUsers]
    );

    /* 신고 취소 핸들러 (차단 해제) */
    const handleUnBanned = useCallback(async (reportedUserId) => {
        try {
            await UserService.unBanned(reportedUserId);
            setBannedUsers((prev) =>
                prev.filter((id) => id !== reportedUserId)
            );
            await fetchBannedUsers();
        } catch (error) {
            console.error("차단 해제 중 오류", error);
        }
    }, [fetchBannedUsers]);

    useEffect(() => {
        fetchBannedUsers();
        fetchBannedMe();
    }, [fetchBannedUsers, fetchBannedMe]);

    const isBanned = (userId) => {
        return bannedUsers.some(
            (bannedUser) => bannedUser.reportedUserId === userId
        );
    };

    return {
        bannedUsers,
        bannedMe,
        handleReportBanned,
        handleUnBanned,
        fetchBannedUsers,
        fetchBannedMe,
        isBanned,
    };
};

export default useReporting;
