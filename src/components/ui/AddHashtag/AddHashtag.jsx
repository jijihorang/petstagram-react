import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
`;

const Container = styled.div`
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 20%;
    height : 25%;
    position: relative;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
`;

const Title = styled.div`
    flex-grow: 1;
    text-align: center;
    font-size : 20px;
`;

const CloseIcon = styled.img`
    width: 30px;
    height: 30px;
    cursor: pointer;
`;

const SearchContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 8px;
    border: none;
    outline: none;
`;

const CompleteButton = styled.button`
    background: #0d6efd;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    font-size: 16px;
    margin-top : 30px;
`;

const AddHashtag = ({ onClose, onAddHashtag }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleAddHashtag = () => {
        if (searchTerm.trim()) {
            onAddHashtag(searchTerm.trim());
            setSearchTerm("");
            onClose();
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchFocus = () => {
        if (!searchTerm.startsWith("#")) {
            setSearchTerm("#");
        }
    };

    return (
        <Overlay>
            <Container>
                <Header>
                    <Title>해시태그 추가</Title>
                    <CloseIcon
                        src="../src/assets/followmodal/follow-close.png"
                        alt="cancle"
                        onClick={onClose}
                    />
                </Header>
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="해시태그를 입력하시오"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                    />
                </SearchContainer>
                <CompleteButton onClick={handleAddHashtag}>완료</CompleteButton>
            </Container>
        </Overlay>
    );
};

export default AddHashtag;
