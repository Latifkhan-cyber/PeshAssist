import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { chatService } from '../services/api'

const ChatContext = createContext(null)

const INITIAL_MESSAGE = {
  id: 'msg-welcome',
  sender: 'assistant',
  content: 'Salam! I am PeshAssist, your AI guide for Peshawar. Ask me anything in English, Urdu, or Roman Urdu about restaurants, hospitals, hotels, historical places, or local services!',
  places: [],
  timestamp: new Date().toISOString(),
}

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('peshass_chat_history')
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE]
  })
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    sessionStorage.setItem('peshass_chat_history', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const res = await chatService.getSuggestions()
        if (res.data.success) {
          setSuggestions(res.data.data)
        }
      } catch (err) {
        console.warn('Could not load suggestions:', err.message)
      }
    }
    loadSuggestions()
  }, [])

  const sendMessage = useCallback(async (userText) => {
    if (!userText || !userText.trim()) return

    const userMessageObj = {
      id: `msg-user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: 'user',
      content: userText.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessageObj])
    setLoading(true)

    try {
      // Send last 6 messages maximum to prevent huge payloads
      const recentMessages = messages.slice(-6)
      const historyPayload = recentMessages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }))

      const res = await chatService.sendMessage(userText.trim(), historyPayload)

      if (res.data && res.data.success) {
        const { reply, places } = res.data.data
        const aiMessageObj = {
          id: `msg-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          sender: 'assistant',
          content: reply,
          places: places || [],
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, aiMessageObj])
      }
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessageObj = {
        id: `msg-err-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sender: 'assistant',
        content: 'Bakhshana ghuwaram! (Sorry), I encountered an issue reaching the local Peshawar server. Please verify your connection or try again.',
        places: [],
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessageObj])
    } finally {
      setLoading(false)
    }
  }, [messages])

  const clearChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE])
    sessionStorage.removeItem('peshass_chat_history')
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        suggestions,
        sendMessage,
        clearChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
