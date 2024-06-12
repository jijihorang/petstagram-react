import { useEffect, useState } from "react";
import NotificationService from "../service/NotificationService";

const useNotifications = (userId) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await NotificationService.getNotificationList(
                    userId
                );
                setNotifications(data);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();

        const eventSource = NotificationService.connectEventSource(
            userId,
            (newNotification) => {
                setNotifications((prevNotifications) => [
                    newNotification,
                    ...prevNotifications,
                ]);
            }
        );

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [userId]);

    return notifications;
};

export default useNotifications;
