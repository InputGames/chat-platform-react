import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { 
   ConversationCallContainer, 
   VideoContainer, 
   VideoContainerActionButtons, 
   VideoContainerItem, 
} from "../../utils/styles";
import { 
   BiMicrophone, 
   BiMicrophoneOff,
   BiVideo,
   BiVideoOff,
} from "react-icons/bi";
import { ImPhoneHangUp } from 'react-icons/im';
import { resetState, setLocalStream } from "../../store/call/callSlice";
import { SocketContext } from "../../utils/context/SocketContext";

export const ConversationCall = () => {
   const localVideoRef = useRef<HTMLVideoElement>(null);
   const remoteVideoRef = useRef<HTMLVideoElement>(null);
   const socket = useContext(SocketContext);
   const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
   const { localStream, remoteStream, call , caller, receiver } = useSelector(
      (state: RootState) => state.call
   );
   const dispatch = useDispatch<AppDispatch>();

   useEffect(() => {
      console.log('local stream was updated...');
      if (localVideoRef.current && localStream) {
         console.log('updating local video ref');
         localVideoRef.current.srcObject = localStream;
         localVideoRef.current.muted = true;
      }
   }, [localStream]);
   useEffect(() => {
      console.log('remote stream was updated...');
      if (remoteVideoRef.current && remoteStream) {
         console.log('updating remote video ref');
         remoteVideoRef.current.srcObject = remoteStream;
      }
   }, [remoteStream]);

   const toggleMicrophone = () => 
   localStream && 
   setMicrophoneEnabled((prev) => {
      console.log('setting audio to ', prev);
      localStream.getTracks()[0].enabled = !prev;
      dispatch(setLocalStream(localStream));
      return !prev;
   });

   const closeCall = () => {
      socket.emit('videoCallHangUp', { caller, receiver });
      // if (call) {
      //    console.log('call exists....closing call');
      //    call.close();
      //    dispatch(resetState());
      // }
   };

   return (
      <ConversationCallContainer>
         <VideoContainer>
            {localStream && (
               <VideoContainerItem>
                  <video ref={localVideoRef} playsInline autoPlay />
               </VideoContainerItem>
            )}
            {remoteStream && (
               <VideoContainerItem>
                  <video ref={remoteVideoRef} playsInline autoPlay />
               </VideoContainerItem>
            )}
         </VideoContainer>
         <VideoContainerActionButtons>
            <div>
               <BiVideo />
            </div>
            <div>
               {microphoneEnabled ? (
                  <BiMicrophone onClick={toggleMicrophone} />
               ) : (
                  <BiMicrophoneOff onClick={toggleMicrophone} />
               )}
            </div>
            <div>
               <ImPhoneHangUp onClick={closeCall}/>
            </div>
         </VideoContainerActionButtons>
      </ConversationCallContainer>
   );
};
