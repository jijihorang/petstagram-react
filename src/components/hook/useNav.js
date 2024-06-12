import { useContext } from "react";
import { NavContext } from "../../contexts/NavContext";

const useNav = () => useContext(NavContext);

export default useNav;