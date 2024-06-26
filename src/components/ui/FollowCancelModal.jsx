import React from "react";
import "./FollowCancelModal.css";

const FollowCancelModal = ({
    title,
    onClose,
    user,
    onButtonClick,
    fetchFollowCounts,
    fetchFollowList,
}) => {
    const confirmMessage = title === "팔로워" ? "팔로워를 삭제하시겠어요?" : "";
    const contentsMessage =
        title === "팔로워"
            ? `${user.email}님은 회원님의 팔로워 리스트에서 삭제된 사실을 알 수 없습니다.`
            : `@${user.email}님의 팔로우를 취소하시겠어요?`;

    const handleAction = async () => {
        try {
            await onButtonClick(user.id);
            if (title === "팔로워") {
                await fetchFollowCounts();
            }
            await fetchFollowList();
        } catch (error) {
            console.error("An error occurred:", error);
        } finally {
            onClose();
        }
    };

    return (
        <div className="followcanclemodal-overlay">
            <div className="followcanclemodal_div">
                <div className="followcanclemodal_header">
                    <img
                        src={
                            user.profileImageUrl ||
                            "https://via.placeholder.com/150"
                        }
                        alt="프로필"
                    />
                </div>
                <div className="followcanclemodal_body">
                    {title === "팔로워" && <h1>{confirmMessage}</h1>}
                    <p>{contentsMessage}</p>
                </div>
                <div className="followcanclemodal_footer">
                    <button
                        className="followcanclemodal_cancel-btn"
                        onClick={handleAction}
                    >
                        {title === "팔로워" ? "삭제" : "팔로우 취소"}
                    </button>
                </div>
                <div className="followcanclemodal_footer">
                    <button
                        className="followcanclemodal_close-btn"
                        onClick={onClose}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FollowCancelModal;
