import React, { useEffect, useState } from "react";
import icons from "../../../assets/ImageList";

const { Kakao } = window;

const KakaoShare = ({ post }) => {

    useEffect(() => {
        if (Kakao && !Kakao.isInitialized()) {
            Kakao.init("55bff4ee406987253e7aa1352c8890b2");
        }
    }, []);

    const getImageUrl = (image) => {
        return `https://aa8d-118-47-60-28.ngrok-free.app/uploads/${image.imageUrl}`;
    };

    const handleShareClick = () => {
        const imageUrl = getImageUrl(post.imageList[0]);

        Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
                title: post.postContent,
                description: `작성자: ${post.email}`,
                imageUrl: imageUrl,
                link: {
                    webUrl: location.href,
                },
            },
            buttons: [
                {
                    title: "웹에서 보기",
                    link: {
                        webUrl: location.href,
                    },
                },
            ],
        });
    };

    return (
        <img
            className="share_img"
            alt="공유"
            src={icons.postShareIcon}
            onClick={handleShareClick}
        />
    );
};

export default KakaoShare;
