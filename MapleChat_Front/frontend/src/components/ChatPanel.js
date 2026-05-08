import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';

export default function ChatPanel({ characterName, characterImage }) {
  const [input, setInput] = useState('');
  const listRef = useRef(null);
  const { messages, sendMessage, connected } = useChat(characterName, characterImage);

  const canChat = Boolean(characterName);

  const renderedMessages = useMemo(
    () =>
      messages.map((message, index) => {
        const isNotice = message.type === 'ENTER' || message.type === 'LEAVE';
        const isMine = message.sender && message.sender === characterName;
        return {
          ...message,
          key: `${message.sender || 'system'}-${message.type || 'TALK'}-${index}`,
          isNotice,
          isMine,
        };
      }),
    [characterName, messages]
  );

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [renderedMessages]);

  const handleSend = () => {
    const content = input.trim();
    if (!content) return;
    sendMessage(content);
    setInput('');
  };

  return (
    <div className="chat-panel">
      <div className="chat-panel__header">
        <span>전체 채팅</span>
        <span className={`chat-panel__status ${connected ? 'is-online' : 'is-offline'}`}>
          {connected ? '연결됨' : '연결 중'}
        </span>
      </div>

      {!canChat ? (
        <div className="chat-panel__empty">캐릭터를 먼저 검색하세요</div>
      ) : (
        <>
          <div ref={listRef} className="chat-panel__messages">
            {renderedMessages.map((message) => {
              if (message.isNotice) {
                return (
                  <div key={message.key} className="chat-message chat-message--notice">
                    {message.type === 'ENTER'
                      ? `${message.sender}님이 입장했습니다.`
                      : `${message.sender}님이 퇴장했습니다.`}
                  </div>
                );
              }

              return (
                <div
                  key={message.key}
                  className={`chat-message ${message.isMine ? 'chat-message--mine' : 'chat-message--other'}`}
                >
                  {!message.isMine && (
                    <img
                      src={message.characterImage || ''}
                      alt={message.sender || 'user'}
                      className="chat-message__avatar"
                    />
                  )}
                  <div className="chat-message__bubble">
                    <div className="chat-message__sender">{message.sender}</div>
                    <div className="chat-message__content">{message.content}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="chat-panel__input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="메시지를 입력하세요"
            />
            <button type="button" onClick={handleSend} disabled={!connected}>
              전송
            </button>
          </div>
        </>
      )}
    </div>
  );
}
