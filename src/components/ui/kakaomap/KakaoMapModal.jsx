import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import KakaoMapListItem from "./KakaoMapListItem";
import KakaoMapKeyword from "./KakaoMapKeyword";
import KakaoMapSearch from "./KakaoMapSearch";

const KakaoMapModal = ({ onClose, setSelectedAddress }) => {
    const [map, setMap] = useState(null);
    const [state, setState] = useState({
        center: { lat: 37.566535, lng: 126.9779692 },
        errMsg: null,
        isLoading: true,
        keyword: "",
        places: [],
        pagination: null,
        currentPage: 1,
    });

    const [markers, setMarkers] = useState([]);
    const [infowindow, setInfowindow] = useState(new window.kakao.maps.InfoWindow({ zIndex: 1 }));

    // 현재 위치 설정
    useEffect(() => {
        if (map) {
            setState(prev => ({ ...prev, isLoading: false }));

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setState(prev => ({
                        ...prev,
                        center: { lat, lng }
                    }));
                    map.setCenter(new window.kakao.maps.LatLng(lat, lng));
                });
            } else {
                alert("Geolocation을 사용할 수 없습니다.");
            }
        }
    }, [map]);

    // 키워드 및 주소로 장소 검색
    const searchPlaces = (keyword) => {
        if (!keyword.trim()) {
            alert("키워드를 입력해주세요!");
            return;
        }

        const ps = new window.kakao.maps.services.Places();
        const geocoder = new window.kakao.maps.services.Geocoder();

        let keywordResults = [];
        let addressResults = [];

        // 키워드 검색 콜백 함수
        const keywordSearchCB = (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
                keywordResults = data;
                mergeResults(pagination);
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                mergeResults();
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert("키워드 검색 중 오류가 발생했습니다.");
            }
        };

        // 주소 검색 콜백 함수
        const addressSearchCB = (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                addressResults = data.map((place) => ({
                    ...place,
                    place_name: place.address_name,
                    road_address_name: place.road_address_name,
                    y: place.y,
                    x: place.x,
                }));
                mergeResults();
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                mergeResults();
            } else if (status === window.kakao.maps.services.Status.ERROR) {
                alert("주소 검색 중 오류가 발생했습니다.");
            }
        };

        // 검색 결과 병합 함수
        const mergeResults = (pagination) => {
            const allResults = [...keywordResults, ...addressResults];
            setState(prev => ({
                ...prev,
                places: allResults,
                pagination: keywordResults.length ? pagination : null,
            }));
            displayPlaces(allResults, 1);
        };

        // 키워드 및 주소 검색 실행
        ps.keywordSearch(keyword, keywordSearchCB, {
            location: new window.kakao.maps.LatLng(state.center.lat, state.center.lng)
        });

        geocoder.addressSearch(keyword, addressSearchCB);

        setState(prev => ({ ...prev, keyword }));
    };

    // 장소 표시 함수
    const displayPlaces = (places, page) => {
        const bounds = new window.kakao.maps.LatLngBounds();
        const newMarkers = [];
        const pageSize = 3; // 페이지당 표시할 결과 수
        const startIdx = (page - 1) * pageSize;
        const endIdx = Math.min(startIdx + pageSize, places.length);

        for (let i = startIdx; i < endIdx; i++) {
            const place = places[i];
            const placePosition = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = new window.kakao.maps.Marker({
                position: placePosition,
                map,
            });

            // 마커에 이벤트 리스너 추가 (마우스 올릴 시 장소 이름 생성)
            window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                displayInfowindow(marker, place.place_name);
            });

            // 마커에 이벤트 리스너 추가 (마우스 아웃 시 장소 이름 사라짐)
            window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                infowindow.close();
            });

            // 마커에 이벤트 리스너 추가 (마커 클릭 시 장소 선택)
            window.kakao.maps.event.addListener(marker, 'click', () => {
                setSelectedAddress(place.road_address_name);
                onClose();
            });

            newMarkers.push(marker);
            bounds.extend(placePosition);
        }

        // 이전 마커 제거 후 새 마커 추가
        setMarkers(prevMarkers => {
            prevMarkers.forEach(marker => marker.setMap(null));
            return newMarkers;
        });

        map.setBounds(bounds);
        setState(prev => ({ ...prev, currentPage: page }));
    };

    // 마커 정보 창 표시 함수
    const displayInfowindow = (marker, title) => {
        const content = `<div style="padding:5px; z-index:1; width:190px">${title}</div>`;
        infowindow.setContent(content);
        infowindow.open(map, marker);
    };

    // 페이징 표시 함수 
    const displayPagination = () => {
        const { currentPage } = state;
        const fragment = document.createDocumentFragment();
        const totalPages = Math.ceil(state.places.length / 3);

        for (let i = 1; i <= totalPages; i++) {
            const el = document.createElement('a');
            el.href = "#";
            el.innerHTML = i;

            if (i === currentPage) {
                el.className = 'on';
            } else {
                el.onclick = (function (i) {
                    return function () {
                        displayPlaces(state.places, i);
                    };
                })(i);
            }

            fragment.appendChild(el);
        }

        const paginationEl = document.getElementById('pagination');
        while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild(paginationEl.lastChild);
        }
        paginationEl.appendChild(fragment);
    };

    // 페이징 변경할 때마다 호출
    useEffect(() => {
        if (state.places.length) {
            displayPagination();
        }
    }, [state.places, state.currentPage]);

    // 키워드 클릭 시 검색
    const handleKeywordClick = (keyword) => {
        if (state.keyword === keyword) {
            // 같은 키워드를 클릭했을 때 검색 결과 초기화
            setState(prev => ({ ...prev, places: [], keyword: "" }));
        } else {
            setState(prev => ({ ...prev, keyword }));
            searchPlaces(keyword);
        }
    };

    return (
        <>
            <ModalOverlay>
                <ModalContent>
                    <Header>
                        <Title>Location</Title>
                        <CloseButton onClick={onClose}>x</CloseButton>
                    </Header>

                    <KakaoMapKeyword handleKeywordClick={handleKeywordClick} />

                    <KakaoMapSearch 
                        keyword={state.keyword} 
                        setKeyword={(keyword) => setState({ ...state, keyword })}
                        searchPlaces={searchPlaces}
                    />

                    <Map
                        center={state.center}
                        style={{ width: "100%", height: "370px", marginTop: "20px" }}
                        level={3}
                        onCreate={setMap} >
                        {markers.map((marker, index) => (
                            <MapMarker key={index} position={marker.getPosition()} />
                        ))}
                    </Map>

                    <PlacesList>
                        {state.places.slice((state.currentPage - 1) * 3, state.currentPage * 3).map((place, index) => (
                            <KakaoMapListItem key={index} place={place} index={index} setSelectedAddress={setSelectedAddress} onClose={onClose} />
                        ))}
                    </PlacesList>
                    <Pagination id="pagination"></Pagination>
                </ModalContent>
            </ModalOverlay>
        </>
    );
};

export default KakaoMapModal;

// 스타일드 컴포넌트들
const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 87%;
    max-width: 1300px;
    position: relative;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
`;

const Title = styled.h2`
    font-size: 28px;
    font-weight: bold;
    flex-grow: 1;
    text-align: center;
`;

const CloseButton = styled.div`
    color: black;
    font-size: 28px;
    cursor: pointer;
`;

const PlacesList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 20px 0 0 0;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;

    a {
        margin: 0 5px;
        padding: 5px 10px;
        border: 1px solid #ddd;
        color: #333;
        text-decoration: none;
        cursor: pointer;
    }

    .on {
        background-color: #808080;
        color: white;
        border: 1px solid #808080;
    }
`;