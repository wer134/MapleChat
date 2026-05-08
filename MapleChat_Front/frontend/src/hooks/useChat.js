import { useCallback, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from 'stompjs/lib/stomp';
import { getApiBase } from '../api/apiBase';

export function useChat(characterName, characterImage) {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!characterName) {
      setConnected(false);
      return;
    }

    const apiBase = getApiBase();
    const sockJsUrl = apiBase ? `${apiBase}/ws` : '/ws';
    const socket = new SockJS(sockJsUrl);
    const client = Stomp.over(socket);
    client.debug = () => {};

    client.connect(
      {},
      () => {
        stompClientRef.current = client;
        setConnected(true);

        client.subscribe('/topic/public', (message) => {
          try {
            const payload = JSON.parse(message.body);
            setMessages((prev) => [...prev, payload]);
          } catch {
            // Ignore malformed message body.
          }
        });

        client.send(
          '/app/chat/addUser',
          {},
          JSON.stringify({
            type: 'ENTER',
            sender: characterName,
            characterImage: characterImage || null,
          })
        );
      },
      () => {
        setConnected(false);
      }
    );

    return () => {
      const activeClient = stompClientRef.current;
      if (activeClient?.connected) {
        activeClient.send(
          '/app/chat/sendMessage',
          {},
          JSON.stringify({
            type: 'LEAVE',
            sender: characterName,
            characterImage: characterImage || null,
          })
        );
        activeClient.disconnect(() => {});
      }
      stompClientRef.current = null;
      setConnected(false);
    };
  }, [characterImage, characterName]);

  const sendMessage = useCallback(
    (content) => {
      const client = stompClientRef.current;
      const messageContent = (content || '').trim();
      if (!client?.connected || !messageContent || !characterName) return;

      client.send(
        '/app/chat/sendMessage',
        {},
        JSON.stringify({
          type: 'TALK',
          sender: characterName,
          content: messageContent,
          characterImage: characterImage || null,
        })
      );
    },
    [characterImage, characterName]
  );

  return { messages, sendMessage, connected };
}
