"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null); // helps enable users to scroll down when new messages arrives

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`); // send messages are marked as seen automatically by the sender
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId); //the channel is the conversation ID
    bottomRef?.current?.scrollIntoView(); // scroll down to the latest message

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`); // alert everyone that the message has been seen!

      setMessages((current) => {
        // no new message return the original message and avoid duplicates
        if (find(current, { id: message.id })) {
          return current;
        }

        // update the array with the new message
        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    //Unbind and unsubscribe everytime component unmounts
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox key={message.id} isLast={i === messages.length - 1} data={message} />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
