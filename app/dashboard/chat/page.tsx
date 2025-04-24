"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Text } from "@/components/ui/typography"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: input.trim() })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || "Failed to send message")
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: data.response,
        role: "assistant",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update chat history
      if (currentChatId) {
        setChatHistories(prev => 
          prev.map(chat => 
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: [...chat.messages, userMessage, assistantMessage],
                  lastUpdated: new Date()
                }
              : chat
          )
        )
      } else {
        const newChat: ChatHistory = {
          id: Date.now().toString(),
          title: input.trim().slice(0, 30) + (input.trim().length > 30 ? "..." : ""),
          messages: [userMessage, assistantMessage],
          lastUpdated: new Date()
        }
        setChatHistories(prev => [...prev, newChat])
        setCurrentChatId(newChat.id)
      }
    } catch (error) {
      console.error("Chat error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startNewChat = () => {
    setMessages([])
    setCurrentChatId(null)
    setInput("")
    inputRef.current?.focus()
  }

  const loadChat = (chatId: string) => {
    const chat = chatHistories.find(c => c.id === chatId)
    if (chat) {
      setMessages(chat.messages)
      setCurrentChatId(chatId)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Chat History Sidebar */}
      <Card className="w-64">
        <CardHeader>
          <CardTitle className="text-lg">Chat History</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="w-full mb-4"
            onClick={startNewChat}
          >
            New Chat
          </Button>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-2">
              {chatHistories.map(chat => (
                <Button
                  key={chat.id}
                  variant={currentChatId === chat.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => loadChat(chat.id)}
                >
                  <Text size="sm" className="truncate">
                    {chat.title}
                  </Text>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">
            {currentChatId ? "Chat" : "New Chat"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar>
                      <AvatarImage src="/bot-avatar.png" />
                      <AvatarFallback>
                        <Bot className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <Text>{message.content}</Text>
                    <Text size="xs" className="mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  </div>
                  {message.role === "user" && (
                    <Avatar>
                      <AvatarImage src="/user-avatar.png" />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="/bot-avatar.png" />
                    <AvatarFallback>
                      <Bot className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 