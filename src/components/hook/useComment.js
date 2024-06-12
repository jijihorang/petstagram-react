import { useContext } from "react";
import { CommentContext } from "../../contexts/CommentContext";

const useComment = () => useContext(CommentContext);

export default useComment;