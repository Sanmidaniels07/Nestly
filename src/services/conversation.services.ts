import { api } from "../lib/axios";
import { ApiResponse, Paginated } from "../types/api";
import {
  Conversation,
  ConversationListParams,
  Message,
  MessageListParams,
  MessageMedia,
} from "../types/conversation";

export const createConversation = async (userId: string) => {
  const response = await api.post<ApiResponse<Conversation>>("/conversations", {
    userId,
  });
  return response.data;
};

export const getConversations = async (params: ConversationListParams) => {
  const response = await api.get<
    ApiResponse<Paginated<"conversations", Conversation>>
  >("/conversations", { params });
  return response.data;
};

export const getMessages = async (
  conversationId: string,
  params: MessageListParams
) => {
  const response = await api.get<ApiResponse<Paginated<"messages", Message>>>(
    `/conversations/${conversationId}/messages`,
    { params }
  );
  return response.data;
};

export const sendMessage = async (
  conversationId: string,
  payload: { content?: string; media?: MessageMedia[] }
) => {
  const response = await api.post<ApiResponse<Message>>(
    `/conversations/${conversationId}/messages`,
    payload
  );
  return response.data;
};

export const markConversationRead = async (conversationId: string) => {
  const response = await api.patch<ApiResponse<null>>(
    `/conversations/${conversationId}/read`
  );
  return response.data;
};
