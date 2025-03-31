import React from 'react';
import {
  Chatbot,
  ChatbotContent,
  ChatbotDisplayMode,
  ChatbotFooter,
  ChatbotHeader,
  ChatbotHeaderActions,
  ChatbotHeaderMain,
  ChatbotHeaderSelectorDropdown,
  ChatbotHeaderTitle,
  ChatbotWelcomePrompt,
  Message,
  MessageBar,
  MessageBox,
  MessageProps,
} from '@patternfly/chatbot';
import { Brand, DropdownItem, DropdownList } from '@patternfly/react-core';
import userAvatar from '~/shared/images/user_avatar.svg';
import { CatalogModel } from '~/app/concepts/modelCatalog/types';

interface SimpleChatProps {
  isVisible: boolean;
  model: CatalogModel | null;
}

const SimpleChat: React.FC<SimpleChatProps> = ({ isVisible, model }) => {
  const [messages, setMessages] = React.useState<MessageProps[]>([]);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState<string>();
  const scrollToBottomRef = React.useRef<HTMLDivElement>(null);
  const chatAvatar = model?.logo || userAvatar;
  const modelVersion = model?.name || 'Unknown Model';
  const displayMode = ChatbotDisplayMode.default;

  // you will likely want to come up with your own unique id function; this is for demo purposes only
  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  const handleSend = (message: string) => {
    setIsSendButtonDisabled(true);
    const newMessages: MessageProps[] = [];
    // We can't use structuredClone since messages contains functions, but we can't mutate
    // items that are going into state or the UI won't update correctly
    messages.forEach((chatMessage) => newMessages.push(chatMessage));
    // It's important to set a timestamp prop since the Message components re-render.
    // The timestamps re-render with them.
    const date = new Date();
    newMessages.push({
      id: generateId(),
      role: 'user',
      content: message,
      name: 'User',
      avatar: userAvatar,
      timestamp: date.toLocaleString(),
      avatarProps: { isBordered: true },
    });
    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: modelVersion,
      isLoading: true,
      avatar: chatAvatar,
      timestamp: date.toLocaleString(),
    });
    setMessages(newMessages);
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);

    // this is for demo purposes only; in a real situation, there would be an API response we would wait for
    setTimeout(() => {
      const loadedMessages: MessageProps[] = [];
      // We can't use structuredClone since messages contains functions, but we can't mutate
      // items that are going into state or the UI won't update correctly
      newMessages.forEach((chatMessage) => loadedMessages.push(chatMessage));
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: 'API response goes here',
        name: modelVersion,
        isLoading: false,
        avatar: chatAvatar,
        timestamp: date.toLocaleString(),
        actions: {
          // eslint-disable-next-line no-console
          positive: { onClick: () => console.log('Good response') },
          // eslint-disable-next-line no-console
          negative: { onClick: () => console.log('Bad response') },
          // eslint-disable-next-line no-console
          copy: { onClick: () => console.log('Copy') },
          // eslint-disable-next-line no-console
          share: { onClick: () => console.log('Share') },
          // eslint-disable-next-line no-console
          listen: { onClick: () => console.log('Listen') },
        },
      });
      setMessages(loadedMessages);
      // make announcement to assistive devices that new message has loaded
      setAnnouncement(`Message from Bot: API response goes here`);
      setIsSendButtonDisabled(false);
    }, 5000);
  };

  const iconLogo = (
    <>
      <Brand className="show-light" src={chatAvatar} alt="PatternFly" />
      <Brand className="show-dark" src={chatAvatar} alt="PatternFly" />
    </>
  );

  return (
    <Chatbot displayMode={displayMode} isVisible={isVisible}>
      <ChatbotHeader>
        <ChatbotHeaderMain>
          <ChatbotHeaderTitle displayMode={displayMode} showOnDefault={iconLogo} />
        </ChatbotHeaderMain>
        <ChatbotHeaderActions>
          <ChatbotHeaderSelectorDropdown value={modelVersion}>
            <DropdownList>
              <DropdownItem value={modelVersion} key={modelVersion}>
                {modelVersion}
              </DropdownItem>
            </DropdownList>
          </ChatbotHeaderSelectorDropdown>
        </ChatbotHeaderActions>
      </ChatbotHeader>
      <ChatbotContent>
        {/* Update the announcement prop on MessageBox whenever a new message is sent
        so that users of assistive devices receive sufficient context  */}
        <MessageBox announcement={announcement} position="top">
          {messages.length === 0 && (
            <ChatbotWelcomePrompt
              title="Hello, Chatbot User"
              description="How may I help you today?"
            />
          )}
          {/* This code block enables scrolling to the top of the last message.
          You can instead choose to move the div with scrollToBottomRef on it below 
          the map of messages, so that users are forced to scroll to the bottom.
          If you are using streaming, you will want to take a different approach; 
          see: https://github.com/patternfly/chatbot/issues/201#issuecomment-2400725173 */}
          {messages.map((message, index) => {
            if (index === messages.length - 1) {
              return (
                <>
                  <div ref={scrollToBottomRef} />
                  <Message key={message.id} {...message} />
                </>
              );
            }
            return <Message key={message.id} {...message} />;
          })}
        </MessageBox>
      </ChatbotContent>
      <ChatbotFooter>
        <MessageBar
          onSendMessage={handleSend}
          hasMicrophoneButton={false}
          isSendButtonDisabled={isSendButtonDisabled}
        />
      </ChatbotFooter>
    </Chatbot>
  );
};

export default SimpleChat;
