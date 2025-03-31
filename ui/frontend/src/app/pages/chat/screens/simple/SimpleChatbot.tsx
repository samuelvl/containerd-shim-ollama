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
import { useChatAPI } from '~/app/hooks/useChatAPI';
import { GenerateRequest } from '~/app/concepts/chat/types';

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
  const { api, apiAvailable } = useChatAPI();

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

    // Add user message to chat
    newMessages.push({
      id: generateId(),
      role: 'user',
      content: message,
      name: 'User',
      avatar: userAvatar,
      timestamp: date.toLocaleString(),
      avatarProps: { isBordered: true },
    });

    // Add loading message from bot
    const botMessageId = generateId();
    newMessages.push({
      id: botMessageId,
      role: 'bot',
      content: 'Thinking...',
      name: modelVersion,
      isLoading: true,
      avatar: chatAvatar,
      timestamp: date.toLocaleString(),
    });

    setMessages(newMessages);
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);

    // Prepare the API request
    const request: GenerateRequest = {
      model: model?.name || 'qwen2:latest', // Use model name or default
      prompt: message,
      stream: false,
    };

    // Check if API is available before making the call
    if (apiAvailable) {
      api
        .generate({}, request)
        .then((response) => {
          // Update messages with API response
          const updatedMessages = [...newMessages];
          // Remove the loading message
          updatedMessages.pop();

          // Add the real response
          updatedMessages.push({
            id: botMessageId,
            role: 'bot',
            content: response.response,
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
              copy: { onClick: () => navigator.clipboard.writeText(response.response) },
              // eslint-disable-next-line no-console
              share: { onClick: () => console.log('Share') },
              // eslint-disable-next-line no-console
              listen: { onClick: () => console.log('Listen') },
            },
          });

          setMessages(updatedMessages);
          setAnnouncement(
            `Message from Bot: ${response.response.substring(0, 50)}${response.response.length > 50 ? '...' : ''}`,
          );
          setIsSendButtonDisabled(false);
        })
        .catch((error) => {
          // Handle error case
          const updatedMessages = [...newMessages];
          // Remove the loading message
          updatedMessages.pop();

          // Add error message
          updatedMessages.push({
            id: botMessageId,
            role: 'bot',
            content: `Sorry, I encountered an error: ${error.message || 'Unknown error'}`,
            name: modelVersion,
            isLoading: false,
            avatar: chatAvatar,
            timestamp: date.toLocaleString(),
          });

          setMessages(updatedMessages);
          setAnnouncement(`Message from Bot: Error occurred`);
          setIsSendButtonDisabled(false);
          console.error('Error generating response:', error);
        });
    } else {
      // Fallback for when API is not available
      setTimeout(() => {
        const updatedMessages = [...newMessages];
        // Remove the loading message
        updatedMessages.pop();

        // Add fallback message
        updatedMessages.push({
          id: botMessageId,
          role: 'bot',
          content: 'API is not available at the moment. Please try again later.',
          name: modelVersion,
          isLoading: false,
          avatar: chatAvatar,
          timestamp: date.toLocaleString(),
        });

        setMessages(updatedMessages);
        setAnnouncement(`Message from Bot: API is not available`);
        setIsSendButtonDisabled(false);
      }, 1000);
    }
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
