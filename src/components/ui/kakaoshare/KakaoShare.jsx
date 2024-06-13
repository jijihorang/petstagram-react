import React, { useEffect } from "react";
import icons from "../../../assets/ImageList";

const { Kakao } = window;

const KakaoShare = ({ post }) => {
    useEffect(() => {
        if (Kakao && !Kakao.isInitialized()) {
            Kakao.init("15b5204a244387757bf7ad066184295a");
        }
    }, []);


    const handleShareClick = () => {
            Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: post.postContent,
                    description: `작성자: ${post.email}`,
                    imageUrl: `https://mblogthumb-phinf.pstatic.net/MjAyMjAyMDdfMjEy/MDAxNjQ0MTk0Mzk2MzY3.WAeeVCu2V3vqEz_98aWMOjK2RUKI_yHYbuZxrokf-0Ug.sV3LNWlROCJTkeS14PMu2UBl5zTkwK70aKX8B1w2oKQg.JPEG.41minit/1643900851960.jpg?type=w800`,
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
