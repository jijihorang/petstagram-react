import React, { useState, useEffect } from "react";
import "./FeedStoryList.css";
import useUser from "../../hook/useUser";
import { useNavigate } from "react-router-dom";
import useStory from "../../hook/useStory";

const FeedStoryList = () => {
    const { profileInfo, getProfileImageUrl } = useUser();
    const { groupedStories, setReadStory, fetchReadStatus, readStatus } =
        useStory();
    const navigate = useNavigate();

    /* 특정 사용자의 스토리 읽음 유무 확인 */
    useEffect(() => {
        const fetchStatus = async () => {
            if (Object.keys(groupedStories).length > 0 && profileInfo.id) {
                const status = await fetchReadStatus(
                    groupedStories,
                    profileInfo.id
                );
            }
        };
        fetchStatus();
    }, [groupedStories, profileInfo.id, fetchReadStatus]);

    /* 사용자별 스토리를 최신순으로 정렬 */
    const sortedUsers = Object.keys(groupedStories)
        .map((userId) => {
            const userStories = groupedStories[userId];
            const latestStory = userStories.reduce((latest, story) => {
                return new Date(story.regTime) > new Date(latest.regTime)
                    ? story
                    : latest;
            }, userStories[0]);
            return {
                user: userStories[0].user,
                latestStoryTime: new Date(latestStory.regTime),
                hasUnread: userStories.some((story) => !readStatus[story.id]),
            };
        })
        .sort((a, b) => {
            /* 읽지 않은 스토리가 있는 사용자를 앞에 배치하고, 최신 스토리 순으로 정렬 */
            if (a.hasUnread && !b.hasUnread) return -1;
            if (!a.hasUnread && b.hasUnread) return 1;
            return b.latestStoryTime - a.latestStoryTime;
        })
        .map((item) => item.user);

    /* 특정 사용자의 모든 스토리를 읽었는지 확인하는 함수 (Story Border Gradient 판별) */
    const hasUnreadStories = (userId) => {
        const userStories = groupedStories[userId];
        return userStories.some((story) => !readStatus[story.id]);
    };

    const handleStoryClick = async (userId) => {
        const userStories = groupedStories[userId];
        if (userStories && userStories.length > 0) {
            const unreadStory = userStories.find(
                (story) => !readStatus[story.id]
            );
            const storyToRead =
                unreadStory || userStories[userStories.length - 1];
            await setReadStory(storyToRead.id, profileInfo.id);
            navigate(`/story-detail/${userId}?storyId=${storyToRead.id}`);
        }
    };

    return (
        <div
            className="feed-story-list"
            onClick={() => {
                console.log(groupedStories);
            }}
        >
            <div
                className="feed-story-profile-wrapper"
                onClick={() => navigate("/story-upload")}
            >
                <img
                    src={getProfileImageUrl(profileInfo.profileImage)}
                    alt="프로필 이미지"
                    className="feed-story-profile-image"
                />
                <button className="feed-story-upload-btn">+</button>
            </div>

            {sortedUsers.map((user) => (
                <div
                    key={user.id}
                    className="feed-story-item"
                    onClick={() => handleStoryClick(user.id)}
                >
                    <div
                        className="feed-story-image-wrapper"
                        style={{
                            background: hasUnreadStories(user.id)
                                ? "linear-gradient(to right, #fd1d1d, #fcb045, #833ab4)"
                                : "rgb(224, 224, 224)",
                        }}
                    >
                        <img
                            src={getProfileImageUrl(user.profileImage)}
                            alt="스토리"
                            className="feed-story-image"
                        />
                    </div>
                    <span className="feed-story-username">{user.email}</span>
                </div>
            ))}
        </div>
    );
};

export default FeedStoryList;
