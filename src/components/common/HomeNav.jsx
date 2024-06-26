import "./HomeNav.css";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useUser from "../hook/useUser";
import useModal from "../hook/useModal";
import SelectUpload from "../ui/SelectUpload";
import icons from "../../assets/ImageList";
import useChatRoom from "../hook/useChatRoom";
import useNav from "../hook/useNav";

const HomeNav = () => {
    const { isLoggedIn, profileInfo } = useUser();
    const { openModal, closeModal, isModalOpen } = useModal();
    const { messageCount, unreadMessageCount } = useChatRoom();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        navState,
        setNavState,
        handleNavClick,
        handleMenuClick,
        isCollapsed,
        setIsCollapsed,
    } = useNav();

    const getCurrentNavState = (path) => ({
        home: path === "/",
        search: path === "/search",
        explore: path === "/explore",
        messages: path === "/messages",
        notification: path === "/notification",
        profile: path === "/profile",
        more: path === "/more",
    });

    useEffect(() => {
        if (isLoggedIn) {
            unreadMessageCount();
        }
    }, [unreadMessageCount, isLoggedIn]);

    useEffect(() => {
        setNavState(getCurrentNavState(location.pathname));
        if (location.pathname === "/messages") {
            setIsCollapsed(true);
        }
    }, [location.pathname, setNavState, setIsCollapsed]);

    return (
        <div className="home-nav-container">
            <Sidebar className="sidebar-wrapper" collapsed={isCollapsed}>
                <Menu iconShape="square" className="menu-wrapper">
                    <MenuItem
                        icon={
                            <img
                                src={
                                    navState.home
                                        ? icons.homeIconFilled
                                        : icons.homeIcon
                                }
                                alt="Home"
                                className="menu-icon"
                            />
                        }
                        className={`menu-item ${navState.home ? "active" : ""}`}
                        onClick={() => handleMenuClick("home", "/", navigate)}
                    >
                        홈
                    </MenuItem>
                    <MenuItem
                        icon={
                            <img
                                src={
                                    navState.search
                                        ? icons.searchIconFilled
                                        : icons.searchIcon
                                }
                                alt="Search"
                                className="menu-icon"
                            />
                        }
                        className={`menu-item ${
                            navState.search ? "active" : ""
                        }`}
                        onClick={() => handleNavClick("search")}
                    >
                        검색
                    </MenuItem>
                    <MenuItem
                        icon={
                            <img
                                src={
                                    navState.explore
                                        ? icons.exploreIconFilled
                                        : icons.exploreIcon
                                }
                                alt="Explore"
                                className="menu-icon"
                            />
                        }
                        className={`menu-item ${
                            navState.explore ? "active" : ""
                        }`}
                        onClick={() =>
                            handleMenuClick("explore", "/explore", navigate)
                        }
                    >
                        탐색
                    </MenuItem>
                    <MenuItem
                        icon={
                            <div className="message-icon-container">
                                <img
                                    src={
                                        navState.messages
                                            ? icons.messageIconFilled
                                            : icons.messageIcon
                                    }
                                    alt="Messages"
                                    className="menu-icon"
                                />
                                {messageCount > 0 && (
                                    <div className="message-count-badge">
                                        {messageCount}
                                    </div>
                                )}
                            </div>
                        }
                        className={`menu-item ${
                            navState.messages ? "active" : ""
                        }`}
                        onClick={() =>
                            handleMenuClick("messages", "/messages", navigate)
                        }
                    >
                        메시지
                    </MenuItem>
                    <MenuItem
                        icon={
                            <img
                                src={
                                    navState.notification
                                        ? icons.notiIconFilled
                                        : icons.notiIcon
                                }
                                alt="Notifications"
                                className="menu-icon"
                            />
                        }
                        className={`menu-item ${
                            navState.notification ? "active" : ""
                        }`}
                        onClick={() => handleNavClick("notification")}
                    >
                        알림
                    </MenuItem>
                    <MenuItem
                        icon={
                            <img
                                src={icons.createIcon}
                                alt="Create"
                                className="menu-icon"
                            />
                        }
                        onClick={() => {
                            handleNavClick("none");
                            openModal("upload");
                        }}
                        className="menu-item"
                    >
                        만들기
                    </MenuItem>
                    <MenuItem
                        icon={
                            <img
                                src={profileInfo.profileImageUrl}
                                alt="Profile"
                                className={`menu-item-profile-img ${
                                    navState.profile ? "active" : ""
                                }`}
                            />
                        }
                        className={`menu-item-profile ${
                            navState.profile ? "active" : ""
                        }`}
                        onClick={() =>
                            handleMenuClick("profile", "/profile", navigate)
                        }
                    >
                        프로필
                    </MenuItem>
                    {/* 더 보기 버튼 모달 추가하기 */}
                    <MenuItem
                        icon={
                            <img
                                src={
                                    navState.more
                                        ? icons.menuMoreIconFilled
                                        : icons.menuMoreIcon
                                }
                                alt="더 보기"
                                className="menu-icon"
                            />
                        }
                        className={`more-menu ${navState.more ? "active" : ""}`}
                        onClick={() => handleNavClick("more")}
                    >
                        더 보기
                    </MenuItem>
                </Menu>

                {isModalOpen("upload") && (
                    <SelectUpload onClose={() => closeModal("upload")} />
                )}
            </Sidebar>
        </div>
    );
};

export default HomeNav;
