import axios from "axios";

const BASE_URL = "http://localhost:8088"; // 백엔드 서버 URL

class NotificationService {
    // 알림 목록 가져오기
    static async getNotificationList(userId) {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `${BASE_URL}/notifications/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    }

    // SSE 연결 및 실시간 알림 등록
    static connectEventSource(userId, onNewNotification) {
        const token = localStorage.getItem("token");
        const eventSource = new EventSource(
            `${BASE_URL}/subscribe?userId=${userId}&token=${token}`
        );

        eventSource.addEventListener("like", (event) => {
            const newNotification = JSON.parse(event.data);
            newNotification.regTime = new Date(newNotification.regTime);
            onNewNotification(newNotification);
        });

        eventSource.addEventListener("following", (event) => {
            const newNotification = JSON.parse(event.data);
            newNotification.regTime = new Date(newNotification.regTime);
            onNewNotification(newNotification);
        });

        eventSource.addEventListener("comment", (event) => {
            const newNotification = JSON.parse(event.data);
            newNotification.regTime = new Date(newNotification.regTime);
            onNewNotification(newNotification);
        });

        eventSource.addEventListener("INIT", () => {
            console.log("SSE connection established");
        });

        eventSource.onerror = (error) => {
            console.error("SSE error:", error);
            eventSource.close();

            // 재연결 시도
            setTimeout(() => {
                console.log("Reconnecting to SSE...");
                NotificationService.connectEventSource(
                    userId,
                    onNewNotification
                );
            }, 5000);
        };

        return eventSource;
    }
}

export default NotificationService;
