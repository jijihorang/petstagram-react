import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./StoryView.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useStory from "../hook/useStory";
import useUser from "../hook/useUser";

import { getDisplayTime } from "../../utils/GetNotiTime";

const StoryView = () => {
    const { id } = useParams();
    const userId = parseInt(id, 10);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialStoryId = parseInt(queryParams.get("storyId"), 10);
    const { stories, setReadStory, groupedStories, readStatus } = useStory();
    const { getProfileImageUrl, profileInfo } = useUser(); 
    const mainSliderRef = useRef(null);
    const innerSliderRefs = useRef({});
    const [currentSlide, setCurrentSlide] = useState({});
    const [currentInnerSlide, setCurrentInnerSlide] = useState(0);
    const [innerSliderLength, setInnerSliderLength] = useState(0);
    const [activeUserId, setActiveUserId] = useState(userId);
    const [unreadStoryIds, setUnreadStoryIds] = useState([]); // 읽지 않은 스토리 ID를 저장할 상태 추가

    const getImageUrl = (image) =>
        `http://localhost:8088/uploads/${image.imageUrl}`;
    const getVideoUrl = (video) =>
        `http://localhost:8088/uploads/${video.videoUrl}`;

    useEffect(() => {
        if (stories.length === 0) {
            navigate("/");
        }
    }, [stories, navigate]);

    // 사용자별 스토리를 최신순으로 정렬
    const sortedUserIds = Object.keys(groupedStories)
        .map((userId) => {
            const userStories = groupedStories[userId];
            const latestStory = userStories.reduce((latest, story) => {
                return new Date(story.regTime) > new Date(latest.regTime)
                    ? story
                    : latest;
            }, userStories[0]);
            return {
                userId: userId,
                latestStoryTime: new Date(latestStory.regTime),
                hasUnread: userStories.some((story) => !readStatus[story.id]),
            };
        })
        .sort((a, b) => {
            if (a.hasUnread && !b.hasUnread) return -1;
            if (!a.hasUnread && b.hasUnread) return 1;
            return b.latestStoryTime - a.latestStoryTime;
        })
        .map((item) => item.userId);

    useEffect(() => {
        if (activeUserId && groupedStories[activeUserId]) {
            setInnerSliderLength(groupedStories[activeUserId].length);
            const initialIndex = groupedStories[activeUserId].findIndex(
                (story) => story.id === initialStoryId
            );
            setCurrentInnerSlide(initialIndex !== -1 ? initialIndex : 0);
        }
    }, [activeUserId, groupedStories, initialStoryId]);

    useEffect(() => {
        if (initialStoryId && activeUserId && groupedStories[activeUserId]) {
            const initialIndex = groupedStories[activeUserId].findIndex(
                (story) => story.id === initialStoryId
            );
            if (initialIndex !== -1) {
                setCurrentInnerSlide(initialIndex);
                if (innerSliderRefs.current[activeUserId]) {
                    innerSliderRefs.current[activeUserId].slickGoTo(
                        initialIndex
                    );
                }
            }
        }
    }, [initialStoryId, activeUserId, groupedStories]);

    const initialSlideIndex = sortedUserIds.indexOf(id.toString());

    const handleNext = async () => {
        if (currentInnerSlide < innerSliderLength - 1) {
            innerSliderRefs.current[activeUserId].slickNext();
        } else {
            if (mainSliderRef.current) {
                const isLastUser = sortedUserIds.indexOf(activeUserId.toString()) === sortedUserIds.length - 1;
                if (isLastUser) {
                    handleClose();
                } else {
                    mainSliderRef.current.slickNext();
                }
            }
        }

        const nextSlideIndex = currentInnerSlide + 1;
        if (nextSlideIndex < innerSliderLength) {
            const storyToRead = groupedStories[activeUserId][nextSlideIndex];
            if (!readStatus[storyToRead.id] && !unreadStoryIds.includes(storyToRead.id)) {
                setUnreadStoryIds((prev) => [...prev, storyToRead.id]);
            }
        }
    };

    const handlePrev = () => {
        if (currentInnerSlide > 0) {
            innerSliderRefs.current[activeUserId].slickPrev();
        } else {
            if (mainSliderRef.current) {
                mainSliderRef.current.slickPrev();
            }
        }
    };

    const handleClose = async () => {
        if (unreadStoryIds.length > 0) {
            for (const storyId of unreadStoryIds) {
                await setReadStory(storyId, profileInfo.id);
            }
        }
        navigate("/");
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: "0px",
        variableWidth: true,
        initialSlide: initialSlideIndex,
        afterChange: (current) => {
            const newActiveUserId = sortedUserIds[current];
            setActiveUserId(newActiveUserId);
            const firstStoryId = groupedStories[newActiveUserId][0].id;
            navigate(
                `/story-detail/${newActiveUserId}?storyId=${firstStoryId}`
            );
        },
    };

    const innerSettings = (userId) => ({
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0px",
        initialSlide: currentInnerSlide,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentInnerSlide(newIndex);
            setCurrentSlide((prev) => ({
                ...prev,
                [userId]: newIndex,
            }));
            const storyToRead = groupedStories[userId][newIndex];
            navigate(`/story-detail/${userId}?storyId=${storyToRead.id}`);

            if (!readStatus[storyToRead.id] && !unreadStoryIds.includes(storyToRead.id)) {
                setUnreadStoryIds((prev) => [...prev, storyToRead.id]);
            }
        },
    });

    return (
        <div
            className="story-view-container"
            onClick={() => {
                console.log(groupedStories);
            }}
        >
            <Slider {...settings} ref={mainSliderRef}>
                {sortedUserIds.map((userId) => (
                    <div key={userId} className="story-user-slider">
                        <div className="story-slider-container">
                            <div className="story-user-info">
                                <img
                                    src={getProfileImageUrl(
                                        groupedStories[userId][0].user
                                            .profileImage
                                    )}
                                    alt="프로필 이미지"
                                    className="story-profile-image"
                                />
                                <span className="story-username">
                                    {groupedStories[userId][0].user.email}
                                </span>
                                <span className="story-uploadtime">
                                    {getDisplayTime(
                                        groupedStories[userId][0].regTime
                                    )}
                                </span>
                            </div>
                            <div className="story-progress-bar-container">
                                {groupedStories[userId].map((_, index) => (
                                    <div
                                        key={index}
                                        className={`story-progress-bar ${
                                            index <= (currentSlide[userId] || 0)
                                                ? "active"
                                                : ""
                                        }`}
                                        style={{
                                            width: `${
                                                100 /
                                                groupedStories[userId].length
                                            }%`,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="story-slider">
                                <Slider
                                    {...innerSettings(userId)}
                                    ref={(slider) =>
                                        (innerSliderRefs.current[userId] =
                                            slider)
                                    }
                                >
                                    {groupedStories[userId].map((story) => (
                                        <div
                                            key={story.id}
                                            className="story-slide"
                                        >
                                            <div className="story-media-container">
                                                {story.storyType === "video" ? (
                                                    <video
                                                        src={getVideoUrl(
                                                            story.videoList[0]
                                                        )}
                                                        className="story-media"
                                                        controls
                                                    />
                                                ) : (
                                                    <img
                                                        src={getImageUrl(
                                                            story.imageList[0]
                                                        )}
                                                        alt="스토리 이미지"
                                                        className="story-media"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
            <div
                className="story-view-close-button"
                onClick={handleClose}
            >
                <span>✕</span>
            </div>
            <div className="story-control-buttons">
                <button className="story-prev-arrow" onClick={handlePrev}>
                    {"＜"}
                </button>
                <button className="story-next-arrow" onClick={handleNext}>
                    {"＞"}
                </button>
            </div>
        </div>
    );
};

export default StoryView;
