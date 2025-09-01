// services/chat.service.ts
import { baseApi } from "./base-api"

export type ChatDto = {
  id: number
  room_name: string
  owner_id: number
  owner_email: string
  owner_username: string | null
}

const chatService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query<ChatDto[], void>({
      query: () => ({
        url: `/chats`,          // <- если у тебя префикс /api, то /api/chats/
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
  overrideExisting: false,
})

export const { useGetChatsQuery } = chatService