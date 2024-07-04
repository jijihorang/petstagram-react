import { useEffect, useState } from "react";
import HashTagService from "../service/HashTagService";

const useHashTag = () => {
    const [allHashTags, setAllHashTags] = useState([]);
    const [popularHashTags, setPopularHashTags] = useState([]);
    const [hashTagCounts, setHashTagCounts] = useState({});

    useEffect(() => {
        const fetchHashTags = async () => {
            try {
                const tags = await HashTagService.getHashTagList();
                setAllHashTags(tags);
            } catch (error) {
                console.error("Error fetching hash tags:", error);
            }
        };

        const fetchPopularHashTags = async () => {
            try {
                const popularTags = await HashTagService.getPopularHashTags();
                setPopularHashTags(popularTags);
            } catch (error) {
                console.error("Error fetching popular hash tags:", error);
            }
        };

        const fetchHashTagCounts = async () => {
            try {
                const counts = await HashTagService.getHashTagUsageCounts();
                const countsMap = counts.reduce((acc, [tag, count]) => {
                    acc[tag] = count;
                    return acc;
                }, {});
                setHashTagCounts(countsMap);
            } catch (error) {
                console.error("Error fetching hash tag counts:", error);
            }
        };

        fetchHashTags();
        fetchPopularHashTags();
        fetchHashTagCounts();
    }, []);

    return { allHashTags, popularHashTags, hashTagCounts };
};

export default useHashTag;
