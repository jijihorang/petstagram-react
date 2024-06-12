const GetRelativeTime = (date) => {
    const now = new Date();
    const diff = (now - new Date(date)) / 1000; // 차이를 초 단위로 계산

    if (diff < 1) {
        return "지금";
    } else if (diff < 60) {
        return `${Math.floor(diff)}초 전`;
    } else if (diff < 3600) {
        return `${Math.floor(diff / 60)}분 전`;
    } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)}시간 전`;
    } else {
        return `${Math.floor(diff / 86400)}일 전`;
    }
};

export default GetRelativeTime;
