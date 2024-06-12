import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modals, setModals] = useState({});

    const openModal = (modalName) => {
        setModals((prevState) => ({
            ...prevState,
            [modalName]: true,
        }));
    };

    const closeModal = (modalName) => {
        setModals((prevState) => ({
            ...prevState,
            [modalName]: false,
        }));
    };

    const toggleModal = (modalName) => {
        setModals((prevModals) => ({
            ...prevModals,
            [modalName]: !prevModals[modalName],
        }));
    };

    const resetModals = () => {
        setModals({});
    };

    const isModalOpen = (modalName) => !!modals[modalName];

    return (
        <ModalContext.Provider value={{ openModal, closeModal, isModalOpen, toggleModal, resetModals }}>
            {children}
        </ModalContext.Provider>
    );
};

export { ModalContext };
