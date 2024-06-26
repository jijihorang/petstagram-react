import React, { createContext, useContext, useState, useEffect } from "react";

const NavContext = createContext();

export const NavProvider = ({ children }) => {
    const [navState, setNavState] = useState({
        home: true,
        search: false,
        explore: false,
        messages: false,
        notification: false,
        profile: false,
        more: false,
    });
    const [previousNavState, setPreviousNavState] = useState({});
    const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 1100);

    useEffect(() => {
        const handleResize = () => {
            setIsCollapsed(window.innerWidth <= 1100);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleNavClick = (menu) => {
        setNavState((prevState) => {
            const newState = { ...prevState };

            if (menu === "more") {
                newState[menu] = !prevState[menu];
            } else if (menu === "search" || menu === "notification") {
                if (prevState[menu]) {
                    // 검색이나 알림이 이미 활성화되어 있을 경우 이전 상태로 돌아감
                    return { ...previousNavState, [menu]: false };
                } else {
                    // 검색이나 알림이 활성화되지 않은 경우 현재 상태를 저장하고 새로운 상태로 전환
                    setPreviousNavState({ ...prevState });
                    Object.keys(newState).forEach((key) => {
                        if (key !== "more") {
                            newState[key] = false;
                        }
                    });
                    newState[menu] = true;
                    return newState;
                }
            } else {
                setPreviousNavState({ ...prevState });
                Object.keys(newState).forEach((key) => {
                    if (key !== "more") {
                        newState[key] = false;
                    }
                });
                newState[menu] = true;
            }

            return newState;
        });
    };

    const handleMenuClick = (menu, path, navigate) => {
        handleNavClick(menu);
        navigate(path);
        if (menu === "messages" || window.innerWidth <= 1100) {
            setIsCollapsed(true);
        } else {
            setIsCollapsed(false);
        }
    };

    return (
        <NavContext.Provider
            value={{
                navState,
                setNavState,
                handleNavClick,
                handleMenuClick,
                isCollapsed,
                setIsCollapsed,
            }}
        >
            {children}
        </NavContext.Provider>
    );
};

export { NavContext };
