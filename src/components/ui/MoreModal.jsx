import React, { useEffect } from "react";
import styled from "styled-components";

const MoreModalContainer = styled.div`
    width: 300px;
    background-color: white;
    padding: 5px;
    border-radius: 10px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
    z-index: 1000;
    text-align: center;
`;

const MoreOption = styled.div`
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background-color: #f0f0f0;
    }
    &.moreoption-remove {
        color: red;
    }
    &.moreoption-report,
    &.moreoption-unfollow,
    &.friend-more-unbanned,
    &.friend-more-banned {
        color: red;
    }
    &.moreoption-follow {
        color: #00a3ff;
    }
`;

const MoreModal = ({ options }) => {
    useEffect(() => {
        // 모달이 열렸을 때 부모 컴포넌트의 스크롤을 막음
        const parentDiv = document.querySelector(".app .div");
        const originalStyle = parentDiv.style.overflowY;
        parentDiv.style.overflowY = "hidden";

        return () => {
            parentDiv.style.overflowY = originalStyle;
        };
    }, []);

    if (!Array.isArray(options)) {
        options = [];
    }

    return (
        <MoreModalContainer onClick={(e) => e.stopPropagation()}>
            {options.map((option, index) => (
                <MoreOption
                    key={index}
                    className={option.className}
                    onClick={option.onClick}
                >
                    {option.label}
                </MoreOption>
            ))}
        </MoreModalContainer>
    );
};

export default MoreModal;
