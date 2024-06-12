import React from "react";
import styled from "styled-components";

const DeleteConfirmModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
`;

const DeleteConfirmContent = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 300px;
`;

const DeleteConfirmTitle = styled.p`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const DeleteConfirmMessage = styled.p`
    font-size: 14px;
    margin-bottom: 20px;
`;

const DeleteConfirmActions = styled.div`
    display: flex;
    justify-content: space-around;
`;

const DeleteConfirmButton = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &.delete {
        background-color: #e74c3c;
        color: #fff;
    }
    &.cancel {
        background-color: #95a5a6;
        color: #fff;
    }
`;

const DeleteConfirm = ({ closeModal, onClose }) => (
    <DeleteConfirmModal>
        <DeleteConfirmContent>
            <DeleteConfirmTitle>게시물을 삭제하시겠어요?</DeleteConfirmTitle>
            <DeleteConfirmMessage>
                지금 나가면 수정 내용이 저장되지 않습니다.
            </DeleteConfirmMessage>
            <DeleteConfirmActions>
                <DeleteConfirmButton
                    className="delete"
                    onClick={() => {
                        closeModal("deleteConfirm");
                        onClose();
                    }}
                >
                    삭제
                </DeleteConfirmButton>

                <DeleteConfirmButton className="cancel" onClick={closeModal}>
                    취소
                </DeleteConfirmButton>
            </DeleteConfirmActions>
        </DeleteConfirmContent>
    </DeleteConfirmModal>
);

export default DeleteConfirm;
