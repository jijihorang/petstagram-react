import React from 'react';
import './FeedStoryList.css';

const FeedStoryList = ({ stories }) => {
    return (
        <div className="feed-story-list">
            {stories.map((story, index) => (
                <div key={index} className="feed-story-item">
                    <img src={story.profileImage} alt="스토리" className="feed-story-image" />
                    <span className="feed-story-username">{story.username}</span>
                </div>
            ))}
        </div>
    );
};

export default FeedStoryList;
