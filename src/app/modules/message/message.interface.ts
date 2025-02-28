export interface TMessage {
  chatId: string; // Reference to the Chat
  senderId: string; // User who sent the message
  content: string; // Text or media URL
  messageType: 'text' | 'image' | 'video' | 'audio' | 'document' | 'location';
  timestamp: Date;
}
