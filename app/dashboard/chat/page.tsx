"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Text } from "@/components/ui/typography"
import { Send, Bot, User, Loader2, X } from "lucide-react"
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

  // Fetch chats on component mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch user chats from the backend
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/chats`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const chats = await response.json();
        // Convert backend chat data to frontend ChatHistory format
        const formattedChats: ChatHistory[] = chats.map((chat: any) => {
          try {
            // Attempt to parse the chat_output JSON
            const chatData = JSON.parse(chat.chat_output);
            
            // Process messages to ensure timestamps are Date objects
            const messages = chatData.messages?.map((msg: any) => ({
              ...msg,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
            })) || [];
            
            return {
              id: chat.chat_id.toString(),
              title: chatData.title || `Chat ${chat.chat_id}`,
              messages: messages,
              lastUpdated: new Date(chat.created_at)
            };
          } catch (e) {
            // Fallback if parsing fails
            return {
              id: chat.chat_id.toString(),
              title: `Chat ${chat.chat_id}`,
              messages: [],
              lastUpdated: new Date(chat.created_at)
            };
          }
        });
        setChatHistories(formattedChats);
      } else {
        console.error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  // Save chat to the backend
  const saveChat = async (chatHistory: ChatHistory) => {
    try {
      const token = localStorage.getItem("access_token");
      const chatOutput = JSON.stringify({
        title: chatHistory.title,
        messages: chatHistory.messages
      });
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/chats?chat_output=${encodeURIComponent(chatOutput)}`, 
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const newChat = await response.json();
        // Update the local chat with the backend ID
        return {
          ...chatHistory,
          id: newChat.chat_id.toString()
        };
      } else {
        console.error("Failed to save chat");
        return chatHistory;
      }
    } catch (error) {
      console.error("Error saving chat:", error);
      return chatHistory;
    }
  };

  // Delete chat from the backend
  const deleteChat = async (chatId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove chat from local state
        setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
        if (currentChatId === chatId) {
          startNewChat();
        }
        return true;
      } else {
        console.error("Failed to delete chat");
        return false;
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      return false;
    }
  };

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/chat?message=${encodeURIComponent(input.trim())}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
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
        const updatedHistories = chatHistories.map(chat => 
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage, assistantMessage],
                lastUpdated: new Date()
              }
            : chat
        );
        
        setChatHistories(updatedHistories);
        
        // Save updated chat to backend
        const chatToUpdate = updatedHistories.find(chat => chat.id === currentChatId);
        if (chatToUpdate) {
          await saveChat(chatToUpdate);
        }
      } else {
        // Create new chat
        const newChat: ChatHistory = {
          id: Date.now().toString(), // Temporary ID
          title: input.trim().slice(0, 30) + (input.trim().length > 30 ? "..." : ""),
          messages: [userMessage, assistantMessage],
          lastUpdated: new Date()
        }
        
        // Save to backend and get updated chat with backend ID
        const savedChat = await saveChat(newChat);
        
        setChatHistories(prev => [...prev, savedChat]);
        setCurrentChatId(savedChat.id);
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
      // Ensure all messages have proper Date objects for timestamps
      const processedMessages = chat.messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
      }));
      
      setMessages(processedMessages)
      setCurrentChatId(chatId)
    }
  }

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId);
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
                <div key={chat.id} className="flex items-center group">
                  <Button
                    variant={currentChatId === chat.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => loadChat(chat.id)}
                  >
                    <Text size="sm" className="truncate">
                      {chat.title}
                    </Text>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteChat(chat.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            {currentChatId ? "Chat" : "New Chat"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden p-0 px-4 pb-4">
          <ScrollArea className="flex-1 h-full w-full pr-4">
            <div className="space-y-4 pb-2">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="flex-shrink-0">
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
                    <Text className="whitespace-pre-wrap break-words overflow-hidden">{message.content}</Text>
                    <Text size="xs" className="mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="flex-shrink-0">
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
                  <Avatar className="flex-shrink-0">
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