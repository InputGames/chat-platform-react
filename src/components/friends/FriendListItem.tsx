import { FC, useContext } from "react";
import { FriendListItemContainer } from "../../utils/styles/friends"
import { ContextMenuEvent, Friend } from "../../utils/types";
import { AuthContext } from "../../utils/context/AuthContext";
import { UserAvatar } from "../users/UserAvatar";

type Props = {
	friend: Friend;
	online: boolean;
	onContextMenu: (e: ContextMenuEvent, friend: Friend) => void;
};

export const FriendListItem: FC<Props> = ({ 
	friend, 
	online, 
	onContextMenu, 
}) => {
	const { user } = useContext(AuthContext);
	
	const friendUserInstance = 
		user?.id === friend.sender.id ? friend.receiver : friend.sender;

	return (
		<FriendListItemContainer onContextMenu={(e) => onContextMenu(e, friend)}>
			<UserAvatar user={friendUserInstance} />
			<div>{friendUserInstance.username}</div>
		</FriendListItemContainer>
	);
};
