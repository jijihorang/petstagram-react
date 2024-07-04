import { useContext } from "react";
import { StoryContext } from "../../contexts/StoryContext";

const useStory = () => useContext(StoryContext);

export default useStory;