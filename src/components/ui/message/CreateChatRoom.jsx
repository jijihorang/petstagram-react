import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import useAllUser from "../../hook/useAllUser";
import useChatRoom from "../../hook/useChatRoom";

import icons from "../../../assets/ImageList";

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 600;
`;

const Content = styled.div`
    background: white;
    padding: 0;
    border-radius: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    max-width: 580px;
    width: 90%;
    max-height: 100vh;
    height: 80%;
    display: flex;
    flex-direction: column;
`;

const Header = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    position: relative;
    margin-top: 30px;
`;

const Title = styled.h4`
    font-size: 17px;
    text-align: center;
    margin: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 30px;
`;

const CloseIcon = styled.img`
    width: 24px;
    height: 24px;
    cursor: pointer;
    position: absolute;
    right: 10px;
    margin-bottom: 30px;
`;

const Body = styled.div`
    flex-grow: 1;
    overflow-y: auto;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #ccc;
`;

const InputLabel = styled.label`
    white-space: nowrap;
    font-size: 20px;
    font-weight: 600;
    margin-right: 20px;
`;

const InputFieldWrapper = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: center;
    border: none;
    border-radius: 5px;
`;

const InputField = styled.input`
    flex-grow: 1;
    border: none;
    outline: none;
    font-size: 18px;
`;

const SelectedUser = styled.div`
    background: #e3f0fe;
    color: #4193ef;
    font-size: 20px;
    border-radius: 15px;
    padding: 0px 0px 0 10px;
    display: flex;
    align-items: center;
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    color: #4193ef;
    margin-left: 10px;
    cursor: pointer;
    font-size: 15px;
`;

const MessageText = styled.div`
    margin-top: 30px;
    color: grey;
    font-size: 14px;
    padding: 0px 15px;
`;

const SelectButton = styled.button`
    width: calc(100% - 40px);
    padding: 10px;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 20px auto;
    font-size: 16px;
    text-align: center;
    ${({ disabled }) =>
        disabled &&
        css`
            background-color: #c6defa;
            cursor: not-allowed;
        `}
`;

const SearchResultItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f9f9f9;
    }
`;

const ProfileImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
`;

const EmailText = styled.span`
    flex-grow: 1;
`;

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CustomCheckbox = styled.input.attrs({ type: "checkbox" })`
    appearance: none;
    border: 2px solid #ccc;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    outline: none;
    cursor: pointer;
    position: relative;
    transition: background 0.2s, border 0.2s;

    &:checked {
        background-color: #2196f3;
        border-color: #2196f3;
    }

    &:checked::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
    }
`;

const CreateChatRoom = ({ onClose }) => {
    const [searchText, setSearchText] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const { handleSelectedUser } = useChatRoom();
    const { allUserProfiles } = useAllUser();
    const navigate = useNavigate();

    const userProfilesArray = Array.isArray(allUserProfiles)
        ? allUserProfiles
        : [];

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user === selectedUser ? null : user);
    };

    const handleRemoveUser = () => {
        setSelectedUser(null);
    };

    const handleCreateChatRoom = async () => {
        if (selectedUser) {
            const createdChatRoomId = await handleSelectedUser(selectedUser);
            navigate(`/messages/${createdChatRoomId}`);
            onClose();
        } else {
            console.warn("선택된 사용자가 없습니다.");
        }
    };

    const getSearchUsers = () => {
        if (searchText === "") {
            return [];
        }
        return userProfilesArray.filter(
            (user) =>
                user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                (user.name &&
                    user.name.toLowerCase().includes(searchText.toLowerCase()))
        );
    };

    const searchResults = getSearchUsers();

    return (
        <Overlay>
            <Content>
                <Header>
                    <Title>새로운 메시지</Title>
                    <CloseIcon
                        src={icons.messageWriteClose}
                        alt="Close"
                        onClick={onClose}
                    />
                </Header>
                <Body>
                    <InputContainer>
                        <InputLabel>받는 사람 :</InputLabel>
                        <InputFieldWrapper>
                            {selectedUser ? (
                                <SelectedUser>
                                    {selectedUser.email}
                                    <RemoveButton onClick={handleRemoveUser}>
                                        ✕
                                    </RemoveButton>
                                </SelectedUser>
                            ) : (
                                <InputField
                                    type="text"
                                    placeholder="검색..."
                                    value={searchText}
                                    onChange={handleSearchChange}
                                />
                            )}
                        </InputFieldWrapper>
                    </InputContainer>
                    {!selectedUser && (
                        <MessageText>
                            {searchResults.length > 0
                                ? searchResults.map((result, index) => (
                                      <SearchResultItem key={index}>
                                          <ProfileImage
                                              src={result.profileImageUrl}
                                              alt={result.email}
                                          />
                                          <EmailText>{result.email}</EmailText>
                                          <CheckboxContainer>
                                              <CustomCheckbox
                                                  checked={
                                                      selectedUser === result
                                                  }
                                                  onChange={() =>
                                                      handleUserSelect(result)
                                                  }
                                              />
                                          </CheckboxContainer>
                                      </SearchResultItem>
                                  ))
                                : "계정을 찾을 수 없습니다."}
                        </MessageText>
                    )}
                </Body>
                <SelectButton
                    onClick={handleCreateChatRoom}
                    disabled={!selectedUser}
                >
                    채팅
                </SelectButton>
            </Content>
        </Overlay>
    );
};

export default CreateChatRoom;
