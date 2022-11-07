import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { ConversationPanel } from "../../components/conversation/ConversationPanel";
import { ConversationSidebar } from "../../components/conversation/ConversationSidebar";
import { AppDispatch } from "../../store";
import { fetchGroupsThunk } from "../../store/groupSlice";
import { updateType } from "../../store/selectedSlice";
import { SocketContext } from "../../utils/context/SocketContent";
import { Page } from "../../utils/styles";
import { GroupMessageEventPayload } from "../../utils/types";

export const GroupPage = () => {
	const { id } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const socket = useContext(SocketContext);

	useEffect(() => {
		dispatch(updateType('group'));
		dispatch(fetchGroupsThunk());
	}, []);

	useEffect(() => {
		socket.on('onGroupMessage', (payload: GroupMessageEventPayload) => {
			console.log('Group Message Received');
			const { group, message } = payload;
			console.log(group, message);
			dispatch(addGroupMessage(payload));
		});

		return () => {
			socket.off('onGroupMessage');
		}
	}, [id]);

	return (
		<Page>
			<ConversationSidebar />
				{!id && <ConversationPanel />}
			<Outlet />
		</Page>
	);
};