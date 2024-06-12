import { useContext } from "react";
import { AllUserContext } from "../../contexts/AllUserContext";

const useAllUser = () => useContext(AllUserContext);

export default useAllUser;