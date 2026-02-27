import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Image, Type, Loader2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import api from '../utils/api';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hi! I'm your AI content assistant. I can help you create engaging posts for Twitter, LinkedIn, and Instagram. What would you like to create today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contentType, setContentType] = useState('text');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentPrompt = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/generate', {
        prompt: currentPrompt,
        type: contentType,
        platform: 'general'
      });

      if (response.data.success) {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.data.content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      
      let errorMessage = 'Failed to generate content. ';
      
      if (error.response?.data?.message?.includes('API key')) {
        errorMessage += 'AI service is not configured. Please add your API keys in the backend .env file.';
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      toast.error(errorMessage);
      
      const errorResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: `I apologize, but I encountered an error: ${errorMessage}\n\nYou can still create posts manually or add API keys to enable AI generation.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar 
        title="AI Content Creator" 
        subtitle="Generate engaging content with AI"
      />

      <div className="flex-1 flex flex-col p-6 lg:p-8 overflow-hidden">
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
          {/* Content Type Selector */}
          <div className="flex gap-3 mb-6">
            <Button
              data-testid="content-type-text"
              variant={contentType === 'text' ? 'default' : 'outline'}
              className={`rounded-full ${contentType === 'text' ? 'btn-primary' : ''}`}
              onClick={() => setContentType('text')}
            >
              <Type className="h-4 w-4 mr-2" />
              Text Content (GPT)
            </Button>
            <Button
              data-testid="content-type-image"
              variant={contentType === 'image' ? 'default' : 'outline'}
              className={`rounded-full ${contentType === 'image' ? 'btn-secondary' : ''}`}
              onClick={() => setContentType('image')}
            >
              <Image className="h-4 w-4 mr-2" />
              Image Prompt (Gemini)
            </Button>
          </div>

          {/* Messages Area */}
          <Card className="flex-1 p-6 glass-card border-none overflow-y-auto mb-4">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  data-testid={`message-${message.type}`}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-3xl p-4 ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div data-testid="loading-indicator" className="flex justify-start">
                  <div className="bg-muted rounded-3xl p-4">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm">Generating content...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </Card>

          {/* Input Area */}
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                data-testid="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  contentType === 'text'
                    ? 'Describe the post you want to create... (e.g., "Write a motivational post about productivity")'
                    : 'Describe the image you want to generate... (e.g., "Create an abstract tech background")'
                }
                className="min-h-[80px] rounded-3xl resize-none pr-12"
                disabled={isLoading}
              />
            </div>
            <Button
              data-testid="send-message-button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="h-12 w-12 rounded-full btn-primary"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Usage Tip */}
          <p className="text-xs text-muted-foreground text-center mt-4">
            Tip: Be specific about your target audience, tone, and platform for better results
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
