import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyStoryStorage.css";
import useStory from "../../hook/useStory";
import dayjs from "dayjs";
import icons from "../../../assets/ImageList";

const MyStoryStorage = () => {
    const { userStories } = useStory();
    const navigate = useNavigate();

    // 스토리를 최신 순으로 정렬
    const sortedStories = userStories.sort(
        (a, b) => new Date(b.regTime) - new Date(a.regTime)
    );

    const getImageUrl = (image) =>
        `http://localhost:8088/uploads/${image.imageUrl}`;
    const getVideoUrl = (video) =>
        `http://localhost:8088/uploads/${video.videoUrl}`;

    const formatMonth = (month) => {
        const months = [
            "1월",
            "2월",
            "3월",
            "4월",
            "5월",
            "6월",
            "7월",
            "8월",
            "9월",
            "10월",
            "11월",
            "12월",
        ];
        return months[month - 1];
    };

    const formatDate = (date, showYear) => {
        const d = dayjs(date);
        const day = d.format("D");
        const month = formatMonth(d.month() + 1);
        const year = d.format("YYYY");
        return (
            <div className="date-column">
                <div className="day">{day}</div>
                <div className="month">{month}</div>
                {showYear && <div className="year">{year}</div>}
            </div>
        );
    };

    return (
        <div className="mystory">
            <div className="mystory-frame">
                <div className="mystory-prev">
                    <img
                        src={icons.backIcon}
                        alt="<-"
                        onClick={() => navigate("/profile")}
                    />
                    <span>보관</span>
                </div>
                <div className="mystory-story-header">
                    <div className="mystory-story-header-wrapper">
                        <div className="mystory-story-header-div">
                            <img src={icons.myStoryIcon} alt="<3" />
                            <span>스토리</span>
                        </div>
                    </div>
                    <div className="mystory-story-noti">
                        보관된 스토리는 공유하지 않는 한 회원님만 볼 수
                        있습니다.
                    </div>
                </div>
                <div className="mystory-grid-container">
                    {sortedStories.map((story, index) => {
                        const previousStory = sortedStories[index - 1];
                        const showYear =
                            !previousStory ||
                            dayjs(previousStory.regTime).year() !==
                                dayjs(story.regTime).year();
                        const showDate =
                            !previousStory ||
                            dayjs(previousStory.regTime).format(
                                "YYYY-MM-DD"
                            ) !== dayjs(story.regTime).format("YYYY-MM-DD");
                        const storyDate = dayjs(story.regTime).format(
                            "YYYY-MM-DD"
                        );

                        return (
                            <div
                                key={story.id}
                                className="mystory-grid-item"
                                onClick={() => {
                                    navigate(
                                        `/mystory-view/${storyDate}?storyId=${story.id}`
                                    );
                                }}
                            >
                                {showDate && (
                                    <div className="mystory-date">
                                        {formatDate(story.regTime, showYear)}
                                    </div>
                                )}
                                {story.imageList &&
                                    story.imageList.length > 0 &&
                                    story.imageList.map((image, index) => (
                                        <img
                                            key={index}
                                            src={getImageUrl(image)}
                                            alt={`story-image-${story.id}-${index}`}
                                            className="mystory-grid-image"
                                        />
                                    ))}
                                {story.videoList &&
                                    story.videoList.length > 0 &&
                                    story.videoList.map((video, index) => (
                                        <video
                                            key={index}
                                            src={getVideoUrl(video)}
                                            className="mystory-grid-video"
                                        >
                                            Your browser does not support the
                                            video tag.
                                        </video>
                                    ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MyStoryStorage;
