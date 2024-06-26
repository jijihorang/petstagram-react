import React from "react";
import "./ExploreFeed.css";
import usePost from "../hook/usePost";

const ExploreFeed = () => {
    const { postList = [] } = usePost();

    const getImageUrl = (image) => {
        return `http://localhost:8088/uploads/${image.imageUrl}`;
    };

    const images = postList.flatMap((post) =>
        post && post.imageList ? post.imageList : []
    );

    return (
        <div className="explore">
            <div className="explore-frame">
                <div></div>
                <div className="grid-container">
                    {images.map((image, index) => (
                        <div key={index} className="grid-item">
                            <img
                                src={getImageUrl(image)}
                                alt={`grid-${index}`}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExploreFeed;
