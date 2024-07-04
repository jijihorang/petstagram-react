import React from "react";
import styled from "styled-components";
import Swal from "sweetalert2";
import useReporting from "../hook/useReporting";
import { reportOptions } from "../../utils/ReportingOptions";

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
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background-color: white;
    border-radius: 10px;
    width: 100%;
    height: auto;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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


const BanReportModal = ({ onClose, reportedUserId, bannedUser }) => {
    const { handleReportBanned } = useReporting();

    const handleOptionClick = (option) => {
        Swal.fire({
            title: `${bannedUser}님을 신고하시겠습니까?`,
            text: "신고 후, 해당 사용자의 게시글을 더 이상 볼 수 없습니다.",
            icon: "question",
            iconColor: "red",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#aaaaaa",
            confirmButtonText: "확인",
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                handleReportBanned(reportedUserId, option.label);
                Swal.fire("신고 완료", "신고가 성공적으로 접수되었습니다.", "success");
                onClose();
            }
        });
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
