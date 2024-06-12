import React from "react";
import styled from "styled-components";

const EmojiPickerModal = styled.div`
    position: relative;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    padding: 10px;
    width: auto;
`;

const EmojiButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    margin: 5px;
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 1.5;
`;

const EmojiTitle = styled.div`
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    text-align: center;
`;

const EmojiList = styled.div`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;

    @media (max-width: 1080px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const EmojiPicker = ({ onEmojiClick }) => (
    <EmojiPickerModal>
        <EmojiTitle>최고 인기 이모티콘</EmojiTitle>
        <EmojiList>
            {[
                "🐶",
                "🐱",
                "🐭",
                "🐹",
                "🐰",
                "🐵",
                "🐣",
                "🐥",
                "🦋",
                "🐷",
                "🐧",
                "🐦",
                "🐤",
                "🔥",
            ].map((emoji) => (
                <EmojiButton key={emoji} onClick={() => onEmojiClick(emoji)}>
                    {emoji}
                </EmojiButton>
            ))}
        </EmojiList>
    </EmojiPickerModal>
);

export default EmojiPicker;
