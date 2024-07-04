import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../StoryView.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useStory from "../../hook/useStory";
import useUser from "../../hook/useUser";
import { getDisplayTime } from "../../../utils/GetNotiTime";

const MyStoryView = () => {
    const { date } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialStoryId = parseInt(queryParams.get("storyId"), 10);
    const { groupedByDate } = useStory();
    const { profileInfo, getProfileImageUrl } = useUser();
    const mainSliderRef = useRef(null);
    const innerSliderRefs = useRef({});
    const [currentInnerSlide, setCurrentInnerSlide] = useState({});
    const [currentSlide, setCurrentSlide] = useState({});
    const [activeDate, setActiveDate] = useState(date);

    const sortedDates = Object.keys(groupedByDate).sort(
        (a, b) => new Date(b) - new Date(a)
    );

    const stories = groupedByDate[activeDate] || [];

    useEffect(() => {
        const setInitialIndex = () => {
            if (initialStoryId && groupedByDate[activeDate]) {
                const initialIndex = groupedByDate[activeDate].findIndex(
                    (story) => story.id === initialStoryId
                );
                if (
                    initialIndex !== -1 &&
                    innerSliderRefs.current[activeDate]
                ) {
                    setCurrentInnerSlide((prev) => ({
                        ...prev,
                        [activeDate]: initialIndex,
                    }));
                    setCurrentSlide((prev) => ({
                        ...prev,
                        [activeDate]: initialIndex,
                    }));
                    innerSliderRefs.current[activeDate].slickGoTo(initialIndex);
                }
            }
        };

        setInitialIndex();
    }, [initialStoryId, activeDate, groupedByDate]);

    const initialSlideIndex = sortedDates.indexOf(date);

    const getImageUrl = (image) =>
        `http://localhost:8088/uploads/${image.imageUrl}`;
    const getVideoUrl = (video) =>
        `http://localhost:8088/uploads/${video.videoUrl}`;

    const handleNext = () => {
        if (currentInnerSlide[activeDate] < stories.length - 1) {
            innerSliderRefs.current[activeDate].slickNext();
        } else if (sortedDates.indexOf(activeDate) < sortedDates.length - 1) {
            mainSliderRef.current.slickNext();
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentInnerSlide[activeDate] > 0) {
            innerSliderRefs.current[activeDate].slickPrev();
        } else {
            mainSliderRef.current.slickPrev();
        }
    };

    const handleClose = () => {
        navigate("/mystory");
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
            const newDate = sortedDates[current];
            setActiveDate(newDate);
            const firstStoryId = groupedByDate[newDate][0].id;
            navigate(`/mystory-view/${newDate}?storyId=${firstStoryId}`);
            playVisibleVideo(newDate);
        },
    };

    const innerSettings = (date) => ({
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "0px",
        initialSlide: currentInnerSlide[date] || 0,
        beforeChange: (oldIndex, newIndex) => {
            setCurrentInnerSlide((prev) => ({
                ...prev,
                [date]: newIndex,
            }));
        },
        afterChange: (index) => {
            const newStory = groupedByDate[date][index];
            setCurrentSlide((prev) => ({
                ...prev,
                [date]: index,
            }));
            navigate(`/mystory-view/${date}?storyId=${newStory.id}`);
            playVisibleVideo(date, index);
        },
    });

    const playVisibleVideo = (date, index = 0) => {
        const currentStory = groupedByDate[date][index];
        if (currentStory.storyType === "video") {
            const videoElement = document.querySelector(
                `#video-${currentStory.id}`
            );
            if (videoElement) {
                videoElement.play();
            }
        }
    };

    return (
        <div className="story-view-container">
            <Slider {...settings} ref={mainSliderRef}>
                {sortedDates.map((date) => (
                    <div key={date} className="story-user-slider">
                        <div className="story-slider-container">
                            <div className="story-user-info">
                                <img
                                    src={getProfileImageUrl(
                                        profileInfo.profileImage
                                    )}
                                    alt="프로필 이미지"
                                    className="story-profile-image"
                                />
                                <span className="story-username">
                                    {profileInfo.email}
                                </span>
                                <span className="story-uploadtime">
                                    {getDisplayTime(date)}
                                </span>
                            </div>
                            <div className="story-progress-bar-container">
                            {groupedByDate[date].map((_, index) => (
                                <div
                                    key={index}
                                    className={`story-progress-bar ${
                                        index <= (currentSlide[date] || 0) ? "active" : ""
                                    }`}
                                    style={{
                                        width: `${100 / groupedByDate[date].length}%`,
                                    }}
                                />
                            ))}
                        </div>

                            <div className="story-slider">
                                <Slider
                                    {...innerSettings(date)}
                                    ref={(slider) =>
                                        (innerSliderRefs.current[date] = slider)
                                    }
                                >
                                    {groupedByDate[date].map((story) => (
                                        <div
                                            key={story.id}
                                            className="story-slide"
                                        >
                                            <div className="story-media-container">
                                                {story.storyType === "video" ? (
                                                    <video
                                                        id={`video-${story.id}`}
                                                        src={getVideoUrl(
                                                            story.videoList[0]
                                                        )}
                                                        className="story-media"
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
            <div className="story-view-close-button" onClick={handleClose}>
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

export default MyStoryView;
