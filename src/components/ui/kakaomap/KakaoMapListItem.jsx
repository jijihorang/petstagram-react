import styled from "styled-components";

const ListItem = styled.li`
    display: flex;
    padding: 10px;
    align-items: center;
    border: 1px solid #eee;
    margin-bottom: 5px;
`;

const ListImage = styled.img`
    width: 50px;
    height: 50px;
    margin-right: 20px;
`;

const ListInfo = styled.div`
    flex-grow: 1;
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`;

const ListTitle = styled.h2`
    font-size: 18px;
    font-weight: bold;
    margin-right: 10px;
`;

const ListCategory = styled.h2`
    font-size: 16px;
    color: #696969;
`;

const ListAddress = styled.div`
    font-size : 15px;
    color: #808080;
`;

const ListHomePage = styled.a`
    color: #007BFF;
    text-decoration: none;
    margin-top: 5px;

    &:hover {
        text-decoration: underline;
    }
`;


// 장소 리스트 항목 생성 함수
const KakaoMapListItem = ({ place, index, setSelectedAddress, onClose }) => {
    const handlePlaceNameDoubleClick = (place) => {
        setSelectedAddress(place.place_name);
        onClose(); // 모달 닫기
    };

    return (
        <ListItem key={index}>
            <ListImage src="../src/assets/kakao/kakao-map.png" alt="Marker" />
            <ListInfo>
                <TitleRow>
                    <ListTitle onDoubleClick={() => handlePlaceNameDoubleClick(place)}>{place.place_name}</ListTitle>
                    <ListCategory>{place.category_name}</ListCategory>
                </TitleRow>
                <ListAddress>
                    <span>도로명 : {place.road_address_name || "정보 없음"}</span>
                </ListAddress>
                <ListAddress>
                    <span>지번 : {place.address_name}</span>
                </ListAddress>
                <ListHomePage href={place.place_url} target="_blank">홈페이지</ListHomePage>
            </ListInfo>
        </ListItem>
    );
};

export default KakaoMapListItem;
