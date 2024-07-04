import "./SearchNav.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useUser from "../hook/useUser";
import useAllUser from "../hook/useAllUser";
import useFollow from "../hook/useFollow";
import useHashTag from "../hook/useHashTag";

import icons from "../../assets/ImageList";

const SearchNav = () => {
    const { profileInfo } = useUser();
    const { allUserProfiles } = useAllUser();
    const { fetchFollowingList } = useFollow();
    const { allHashTags, hashTagCounts } = useHashTag();
    const [searchText, setSearchText] = useState("");
    const [recentSearches, setRecentSearches] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (profileInfo) {
            const storedSearches =
                JSON.parse(
                    localStorage.getItem(`recentSearches_${profileInfo.email}`)
                ) || [];
            setRecentSearches(storedSearches);
        }
    }, [profileInfo]);

    useEffect(() => {
        fetchFollowingList();
    }, [fetchFollowingList]);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const getSearchUsers = () => {
        if (searchText === "") {
            return [];
        }
        return allUserProfiles.filter(
            (user) =>
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                (user.name &&
                    user.name.toLowerCase().includes(searchText.toLowerCase()))
        );
    };

    const getSearchHashTags = () => {
        if (searchText === "") {
            return [];
        }
        return allHashTags.filter((tag) =>
            tag.name.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    // 최근 검색 항목에 추가
    const handleSelectSearch = (item) => {
        const updatedSearches = [
            item,
            ...recentSearches.filter(
                (u) => u.email !== item.email && u.id !== item.id
            ),
        ];
        setRecentSearches(updatedSearches);
        localStorage.setItem(
            `recentSearches_${profileInfo.email}`,
            JSON.stringify(updatedSearches)
        );
        if (item.email) {
            handleNavigate(item.email);
        } else {
            navigate(`/explore/${item.name.slice(1)}`);
        }
    };

    const handleNavigate = (userEmail) => {
        if (profileInfo && profileInfo.email === userEmail) {
            navigate("/profile");
        } else {
            navigate(`/friendfeed/${userEmail}`);
        }
    };

    // 검색 기록 전체 지우기
    const handleClearSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem(`recentSearches_${profileInfo.email}`);
    };

    // 검색 기록 선택 지우기
    const handleDeleteSearch = (item) => {
        const updatedSearches = recentSearches.filter(
            (searchItem) =>
                searchItem.email !== item.email && searchItem.id !== item.id
        );
        setRecentSearches(updatedSearches);
        localStorage.setItem(
            `recentSearches_${profileInfo.email}`,
            JSON.stringify(updatedSearches)
        );
    };

    const searchResults = [...getSearchUsers(), ...getSearchHashTags()];

    return (
        <div className="search-nav-container">
            <div className="search-nav-title">
                <h2>검색</h2>
                <input
                    type="text"
                    placeholder="검색"
                    value={searchText}
                    onChange={handleSearchChange}
                />
            </div>
            <div>
                {/* 실시간 검색 목록 */}
                <div className={`search-members ${searchText ? "" : "hidden"}`}>
                    {searchResults.map((item) => (
                        <div
                            key={item.email || item.id}
                            className="search-item"
                            onClick={() => handleSelectSearch(item)}
                        >
                            <div className="search-info">
                                <div className="search-icon-wrapper">
                                    {item.profileImageUrl ? (
                                        <img
                                            src={item.profileImageUrl}
                                            alt="profile_image"
                                            className="search-profile-image"
                                        />
                                    ) : (
                                        <img
                                            src={icons.hashTagsIcon}
                                            className="search-hashtags-image"
                                        />
                                    )}
                                </div>
                                <div className="search-user-info">
                                    {item.email ? (
                                        <>
                                            <div className="search-user-email">
                                                {item.email}
                                            </div>
                                            <div className="search-user-name search-user-bio">
                                                {item.name}
                                                {item.bio && ` · ${item.bio}`}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="search-hashtags">
                                            <div className="search-hashtags-name">{item.name}</div>{" "}
                                            <div className="search-hastags-count">
                                                게시물 {hashTagCounts[item.name]}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div
                className={`search-recent-members ${
                    searchText ? "hidden" : ""
                }`}
            >
                <div className="recent-searches">
                    <span>최근 검색 항목</span>
                    <span
                        onClick={handleClearSearches}
                        className="search-all-clear"
                    >
                        모두 지우기
                    </span>
                </div>
                {recentSearches.length === 0 ? (
                    <div className="no-recent-searches">
                        최근 검색 내역 없음
                    </div>
                ) : (
                    recentSearches.map((item) => (
                        <div
                            key={item.email || item.id}
                            className="search-recent-item"
                        >
                            <div
                                className="search-recent-info"
                                onClick={() => handleSelectSearch(item)}
                            >
                                <div className="search-recent-icon-wrapper">
                                    {item.profileImageUrl ? (
                                        <img
                                            src={item.profileImageUrl}
                                            alt="프로필"
                                            className="search-profile-image"
                                        />
                                    ) : (
                                        <img
                                            src={icons.hashTagsIcon}
                                            className="search-hashtags-image"
                                        />
                                    )}
                                </div>
                                <div className="search-recent-info-wrapper">
                                    <div className="search-recent-user-email search-recent-hashtags-name">
                                        {item.email || item.name}
                                    </div>
                                    <div className="search-recent-user-bio">
                                        {item.bio}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button
                                    className="search-delete-btn"
                                    onClick={() => handleDeleteSearch(item)}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SearchNav;
