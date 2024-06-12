import { useContext } from "react";
import { ModalContext } from "../../contexts/ModalContext";

const useModal = () => useContext(ModalContext);

export default useModal;