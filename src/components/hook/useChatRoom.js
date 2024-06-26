import { useContext } from "react";
import { ChatRoomContext } from "../../contexts/ChatRoomContext";

const useChatRoom = () => useContext(ChatRoomContext);

export default useChatRoom;