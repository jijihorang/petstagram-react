import React from "react";
import styled from "styled-components";

const KeywordListWrapper = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
`;

const KeywordItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
`;

const KeywordImage = styled.img`
    width: 55px;
    height: 55px;
    margin-bottom: 10px;
`;


const KEYWORD_LIST = [
    { id: 1, value: "애견 카페", image: "../src/assets/kakao/pet-coffee.png" },
    { id: 2, value: "동물 병원", image: "../src/assets/kakao/pet-hospital.png" },
    { id: 3, value: "애견 호텔", image: "../src/assets/kakao/pet-hotel.png" },
    { id: 4, value: "애견 용품", image: "../src/assets/kakao/pet-food.png" },
];

const KakaoMapKeyword = ({ handleKeywordClick }) => (
    <KeywordListWrapper>
        {KEYWORD_LIST.map((keyword) => (
            <KeywordItem key={keyword.id} onClick={() => handleKeywordClick(keyword.value)}>
                <KeywordImage src={keyword.image} alt={keyword.value} />
                <span>{keyword.value}</span>
            </KeywordItem>
        ))}
    </KeywordListWrapper>
);

export default KakaoMapKeyword;

