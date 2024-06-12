import React from "react";
import styled from "styled-components";
import axios from "axios";
import { reportOptions } from "../../utils/ReportingOptions";
import useReporting from "../hook/useReporting";

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
`;

const ModalContainer = styled.div`
    background-color: white;
    border-radius: 10px;
    width: 100%;
    height: auto;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
    overflow: auto;
    @media (max-height: 1080px) {
        max-height: 80vh;
    }
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px 20px;
    border-bottom: 1px solid #e0e0e0;
    width: 100%;
    align-items: center;
    position: relative;
`;

const ModalTitle = styled.h2`
    font-size: 16px;
    margin: 0;
    flex: 1;
    text-align: center;
`;

const CloseButton = styled.button`
    border: none;
    font-size: 16px;
    cursor: pointer;
    background: white;
    position: absolute;
    width: auto;
    color: black;
    right: 10px;
`;

const ModalContent = styled.div`
    overflow-y: auto;
`;

const Option = styled.div`
    padding: 15px 20px;
    border-bottom: 1px solid #e0e0e0;
    &:hover {
        background-color: #f0f0f0;
    }
    &:last-child {
        border-bottom: none;
    }
`;

const BanReportModal = ({ onClose, reportedUserId }) => {
    const { handleReportBanned } = useReporting();

    const handleOptionClick = (option) => {
        handleReportBanned(reportedUserId, option.label);
        onClose();
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>신고</ModalTitle>
                    <CloseButton onClick={onClose}>✕</CloseButton>
                </ModalHeader>
                <ModalContent>
                    {reportOptions.map((option, index) => (
                        <Option
                            key={index}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </Option>
                    ))}
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

export default BanReportModal;
