import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
    display: flex;
    margin-bottom: 20px;

    input {
        flex-grow: 1;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px 0 0 5px;
    }

    button {
        width: 80px;
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        background-color: #808080;
        color: white;
        cursor: pointer;
        border-radius: 0 5px 5px 0;
    }
`;

const KakaoMapSearch = ({ keyword, setKeyword, searchPlaces }) => {
    return (
        <Wrapper>
            <input
                type="text"
                id="keyword"
                placeholder="검색어를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <button onClick={() => searchPlaces(keyword)}>검색</button>
        </Wrapper>
    );
};

export default KakaoMapSearch;

