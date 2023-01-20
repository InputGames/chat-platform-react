import { useContext, useEffect } from "react";
import { SocketContext } from "../../context/SocketContext";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { resetState } from "../../../store/call/callSlice";
import { WebsocketEvents } from "../../constants";

export function useVideoCallRejected() {
   const socket = useContext(SocketContext);
   const dispatch = useDispatch<AppDispatch>();
   useEffect(() => {
      socket.on(WebsocketEvents.VIDEO_CALL_REJECTED, (data) => {
         console.log('receiver rejected the call', data.receiver);
         dispatch(resetState());
      });

      return () => {
         socket.off('onVcideoCallRejected');
      };
   }, []);
}
