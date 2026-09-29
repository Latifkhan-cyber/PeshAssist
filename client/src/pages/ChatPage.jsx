import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Send,
  Sparkles,
  Trash2,
  Bot,
  User,
} from 'lucide-react'
import { useChat } from '../context/ChatContext'
import { ChatPlaceCard } from '../components/ChatPlaceCard'

export const ChatPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { messages, loading, suggestions, sendMessage, clearChat } = useChat()
  const [inputText, setInputText] = useState('')
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  const initialQueryHandled = useRef(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q && !initialQueryHandled.current) {
      initialQueryHandled.current = true
      sendMessage(q)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, sendMessage, setSearchParams])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputText.trim() && !loading) {
      sendMessage(inputText.trim())
      setInputText('')
    }
  }

  const handleSuggestionClick = (text) => {
    if (!loading) {
      sendMessage(text)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
      {/* Top Header & Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 dark:text-white flex items-center space-x-1.5">
              <span>PeshAssist Conversational AI</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Peshawar Engine
              </span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Supports English, Urdu & Roman Urdu • Anti-Hallucination Grounded
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-rose-500 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          title="Clear Conversation History"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Query Chips */}
      <div className="py-2.5 flex items-center space-x-2 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Suggested:</span>
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(item.text)}
            className="shrink-0 px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {item.text}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 font-bold shadow-sm ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble Content */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Structured Place Cards Embedded Inside AI Message */}
                {msg.places && msg.places.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Verified Matching Places ({msg.places.length}):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {msg.places.map((place) => (
                        <ChatPlaceCard key={place.id} place={place} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Loading / Typing Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-xs shrink-0 shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 ml-2">PeshAssist is querying Peshawar database...</span>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <div className="pt-2 shrink-0">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-1.5 flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            placeholder='Ask in English or Roman Urdu ("Saddar mein laptop repair kahan se hoga?")...'
            className="w-full pl-3 pr-2 py-2.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all disabled:opacity-40 disabled:hover:bg-emerald-600 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 mt-2">
          PeshAssist provides verified facts from local databases. Emergency numbers: KTH (091-9216201), HMC (091-9217140), Rescue 1122.
        </p>
      </div>
    </div>
  )
}
