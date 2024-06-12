import React from "react";
import styled from "styled-components";
import useModal from "../hook/useModal";
import UploadGetGallery from "../common/UploadGetGallery";
import UploadTakeCamera from "../common/UploadTakeCamera";

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`;

const ModalContainer = styled.div`
    background: white;
    width: 500px;
    min-height: 150px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const ModalButton = styled.button`
    background-color: white;
    color: black;
    border: none;
    border-top: 1px solid #ccc;
    padding: 20px 0;
    font-weight: bold;
    cursor: pointer;
    text-align: center;
    font-size: 22px;
    &:hover {
        opacity: 0.85;
    }

    &:first-child {
        border-top: none;
    }

    border-radius: 0;
`;

const SelectUpload = ({ onClose }) => {
    const { openModal, isModalOpen } = useModal();

    return (
        <>
            <ModalBackdrop>
                <ModalContainer>
                    <ModalButton onClick={() => openModal("gallery")}>
                        사진첩에서 가져오기
                    </ModalButton>
                    <ModalButton onClick={() => openModal("camera")}>
                        촬영
                    </ModalButton>
                </ModalContainer>
            </ModalBackdrop>
            {isModalOpen("gallery") && <UploadGetGallery onClose={onClose} />}
            {isModalOpen("camera") && <UploadTakeCamera onClose={onClose} />}
        </>
    );
};

export default SelectUpload;
