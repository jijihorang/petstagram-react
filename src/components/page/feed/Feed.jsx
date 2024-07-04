import "./Feed.css";
import { useState } from "react";
import FeedStoryList from "./FeedStoryList";
import FeedItem from "./FeedItem";

import useUser from "../../hook/useUser";
import usePost from "../../hook/usePost";
import useComment from "../../hook/useComment";
import useModal from "../../hook/useModal";

import PostViewModal from "../../ui/PostViewUI/PostViewModal";

const Feed = () => {
    const { profileInfo } = useUser();
    const { postList = [], deletePost } = usePost();
    const { commentList, submitComment } = useComment();
    const { openModal, closeModal, isModalOpen } = useModal();

    const [selectedPost, setSelectedPost] = useState(postList);
    const [modalType, setModalType] = useState("feed");

    const handlePostViewClick = (post) => {
        setSelectedPost(post);
        setModalType(profileInfo.email === post.email ? "myfeed" : "feed");
        openModal("postview");
    };

    return (
        <div className="feed-container">
            <div className="story-container">
                <FeedStoryList />
            </div>
            {postList.map((post) => {
                const postComments =
                    commentList.find((c) => c.postId === post?.id)?.comments ||
                    [];
                return (
                    post &&
                    post.id && (
                        <FeedItem
                            key={post.id}
                            post={post}
                            comments={postComments}
                            submitComment={submitComment}
                            handlePostViewClick={handlePostViewClick}
                            deletePost={deletePost}
                            profileInfo={profileInfo}
                        />
                    )
                );
            })}
            {isModalOpen("postview") && selectedPost && (
                <PostViewModal
                    post={selectedPost}
                    deletePost={deletePost}
                    onClose={() => closeModal("postview")}
                    modalType={modalType}
                />
            )}
        </div>
    );
};

export default Feed;
