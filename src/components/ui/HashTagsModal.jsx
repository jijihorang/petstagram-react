import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useHashTag from "../hook/useHashTag";
import icons from "../../assets/ImageList";

const Overlay = styled.div`
    position: fixed;
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
    min-width: 400px;
    height: auto;
    min-height: 570px;
    position: fixed;
    display: flex;
    flex-direction: column; 
    justify-content: space-between; 
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
    font-size: 20px;
    position: relative;
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

const SuggestionList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin-top: 10px;
    flex-grow: 1; 
    overflow-y: auto;
`;
const PopularHashTagsWrapper = styled.div`
    font-size: 20px;
    padding: 10px 0px;
`;
const SuggestionItem = styled.li`
    display: flex;
    align-items: center;
    padding: 5px 10px; 
    cursor: pointer;
    background-color: ${(props) =>
        props.selected ? "white" : "transparent"};
    &:hover {
        background-color: #f0f0f0;
    }
`;

const HashTagIcon = styled.img`
    width: 45px;
    height: 45px;
    margin-right: 15px;
`;

const HashTagName = styled.div`
    flex-grow: 1;
    font-size: 16px;
`;

const HashTagCount = styled.div`
    font-size: 14px;
    color: #6c757d;
`;

const CompleteButton = styled.button`
    background: #0d6efd;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    font-size: 16px;
`;

const HashTagsModal = ({ onClose, onAddHashtag }) => {
    const { allHashTags, hashTagCounts, popularHashTags } = useHashTag();

    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);

    useEffect(() => {
        if (!searchTerm || searchTerm === "#") {
            // 검색어가 없을 때 인기 해시태그 표시
            setSuggestions(popularHashTags.slice(0, 5));
        } else {
            // 검색어에 맞는 해시태그 필터링
            const filteredTags = allHashTags.filter((tag) =>
                tag.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSuggestions(filteredTags);
        }
    }, [allHashTags, popularHashTags, searchTerm]);

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

    const handleSuggestionClick = (index) => {
        setSearchTerm(suggestions[index].name);
        setSelectedSuggestion(0);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            setSelectedSuggestion((prev) =>
                prev === 0 ? suggestions.length - 1 : prev - 1
            );
        } else if (e.key === "ArrowDown") {
            setSelectedSuggestion((prev) =>
                prev === suggestions.length - 1 ? 0 : prev + 1
            );
        } else if (e.key === "Enter") {
            setSearchTerm(suggestions[selectedSuggestion].name);
            setSelectedSuggestion(0); // 선택된 제안을 초기화
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
                        onKeyDown={handleKeyDown}
                    />
                </SearchContainer>
                <SuggestionList>
                    {(!searchTerm || searchTerm === "#") && (
                        <PopularHashTagsWrapper>인기 해시태그 #</PopularHashTagsWrapper>
                    )}
                    {suggestions.map((tag, index) => (
                        <SuggestionItem
                            key={tag.id || index}
                            selected={index === selectedSuggestion}
                            onClick={() => handleSuggestionClick(index)}
                        >
                            <HashTagIcon
                                src={icons.hashTagsIcon}
                                alt="hashtag"
                            />
                            <div>
                                <HashTagName>{tag.name}</HashTagName>
                                <HashTagCount>
                                    게시물 {hashTagCounts[tag.name] || 0}
                                </HashTagCount>
                            </div>
                        </SuggestionItem>
                    ))}
                </SuggestionList>
                <CompleteButton onClick={handleAddHashtag}>완료</CompleteButton>
            </Container>
        </Overlay>
    );
};

export default HashTagsModal;
