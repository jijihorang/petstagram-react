import { useContext } from "react";
import { FollowContext } from "../../contexts/FollowContext";

const useFollow = () => useContext(FollowContext);

export default useFollow;