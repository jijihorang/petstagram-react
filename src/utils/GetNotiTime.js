import moment from "moment";
import "moment/locale/ko";

moment.updateLocale("ko", {
    relativeTime: {
        past: "%s",
        s: "%d초",
        ss: "%d초",
        m: "1분",
        mm: "%d분",
        h: "1시간",
        hh: "%d시간",
        d: "1일",
        dd: (number) =>
            number < 7 ? number + "일" : Math.floor(number / 7) + "주",
    },
});

const categorizeNotifications = (notifications) => {
    const today = [];
    const yesterday = [];
    const thisWeek = [];
    const thisMonth = [];
    const pastActivities = [];

    const now = moment().startOf("day");

    notifications.forEach((notification) => {
        const notificationTime = moment(notification.regTime).startOf("day");
        const diffDays = now.diff(notificationTime, "days");
        const diffWeeks = Math.floor(diffDays / 7);

        if (diffDays === 0) {
            today.push(notification);
        } else if (diffDays === 1) {
            yesterday.push(notification);
        } else if (diffDays < 7) {
            thisWeek.push(notification);
        } else if (diffWeeks < 5) {
            thisMonth.push(notification);
        } else {
            pastActivities.push(notification);
        }
    });

    return { today, yesterday, thisWeek, thisMonth, pastActivities };
};

const getDisplayTime = (date) => {
    const notificationTime = moment(date);
    return notificationTime.fromNow();
};

export { categorizeNotifications, getDisplayTime };
