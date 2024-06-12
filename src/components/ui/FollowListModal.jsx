import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FollowCancelModal from "./FollowCancelModal";

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
    width: 500px;
    min-height: 500px;
    max-height: 80%;
    overflow-y: auto;
    position: relative;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 20px;
    font-size: 1.2em;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #ccc;
`;

const Title = styled.div`
    flex-grow: 1;
    text-align: center;
`;

const CloseIcon = styled.img`
    width: 24px;
    height: 24px;
    cursor: pointer;
`;

const SearchContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 10px; 
`;

const SearchInput = styled.input`
    width: 100%;
    max-width: 480px;
    padding: 8px;
    border: 1px solid #ccc;
    outline: none;
    box-shadow: none;
    border-radius: 5px;
`;

const List = styled.div`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const Item = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
`;

const Avatar = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
`;

const Info = styled.div`
    display: flex;
    align-items: center;
`;

const UserDetails = styled.div`
    padding-left: 5px;
    display: flex;
    flex-direction: column;
`;

const Username = styled.div`
    font-weight: bold;
    display: block;
    color: black;
    font-size: 14px;
`;

const Name = styled.div`
    color: #888;
    font-size: 12px;
`;

const Button = styled.button`
    background: #e7e6e6;
    width: 60px;
    color: black;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9em;
    white-space: nowrap;
    font-size: 12px;
`;

const FollowListModal = ({
    title,
    followList,
    onClose,
    onButtonClick,
    fetchFollowCounts,
    fetchFollowList,
    buttonLabel,
}) => {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const [isCancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const getFilteredFollowList = () => {
        if (searchText === "") {
            return followList;
        }
        return followList.filter(
            (user) =>
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                (user.name &&
                    user.name.toLowerCase().includes(searchText.toLowerCase()))
        );
    };

    const filteredFollowList = getFilteredFollowList();

    const handleButtonClick = (user) => {
        setSelectedUser(user);
        setCancelModalOpen(true);
    };

    return (
        <Overlay>
            <Container>
                <Header>
                    <Title>{title}</Title>
                    <CloseIcon
                        src="../src/assets/followmodal/follow-close.png"
                        alt="cancle"
                        onClick={onClose}
                    />
                </Header>
                <SearchContainer>
                    <SearchInput
                        type="text"
                        placeholder="검색"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                </SearchContainer>
                <List>
                    {filteredFollowList.map((user) => (
                        <Item key={user.id}>
                            <Info
                                onClick={() => {
                                    navigate(`/friendfeed/${user.email}`);
                                }}
                            >
                                <Avatar
                                    src={user.profileImageUrl}
                                    alt="프로필 이미지"
                                />
                                <UserDetails>
                                    <Username>{user.email}</Username>
                                    <Name>{user.name}</Name>
                                </UserDetails>
                            </Info>
                            <Button onClick={() => handleButtonClick(user)}>
                                {buttonLabel}
                            </Button>
                        </Item>
                    ))}
                </List>
            </Container>
            {isCancelModalOpen && (
                <FollowCancelModal
                    title={title}
                    onClose={() => setCancelModalOpen(false)}
                    user={selectedUser}
                    onButtonClick={onButtonClick}
                    fetchFollowCounts={fetchFollowCounts}
                    fetchFollowList={fetchFollowList}
                />
            )}
        </Overlay>
    );
};

export default FollowListModal;
