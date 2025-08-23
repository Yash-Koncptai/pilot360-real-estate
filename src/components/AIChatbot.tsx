import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { properties } from '@/data/properties';
import { useNavigate } from 'react-router-dom';

type ChatMessage = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
  properties?: typeof properties;
};

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m your AI property assistant. I can help you find properties in Ahmedabad. Try asking me something like "Show me 2BHK apartments under ₹30,000" or "Find commercial spaces near SG Highway".',
      suggestions: [
        'Show me 2BHK under ₹30,000',
        'Find homes near ISRO',
        'Properties for investment',
        'Office spaces in IT corridor'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const processAIQuery = (query: string): ChatMessage => {
    const lowerQuery = query.toLowerCase();
    
    // Simple AI logic to parse natural language queries
    let filteredProperties = [...properties];
    let aiResponse = '';
    
    // Budget filtering
    const budgetMatch = lowerQuery.match(/(\d+)[k|lakh|lac|cr|crore]/g);
    if (budgetMatch) {
      const budget = budgetMatch[0];
      let amount = 0;
      
      if (budget.includes('k')) {
        amount = parseInt(budget.replace('k', '')) * 1000;
      } else if (budget.includes('lakh') || budget.includes('lac')) {
        amount = parseInt(budget.replace(/lakh|lac/, '')) * 100000;
      } else if (budget.includes('cr') || budget.includes('crore')) {
        amount = parseInt(budget.replace(/cr|crore/, '')) * 10000000;
      }
      
      if (lowerQuery.includes('under') || lowerQuery.includes('below')) {
        filteredProperties = filteredProperties.filter(p => p.price <= amount);
        aiResponse += `Found properties under ₹${budget}. `;
      }
    }
    
    // BHK filtering
    const bhkMatch = lowerQuery.match(/(\d+)\s*bhk/);
    if (bhkMatch) {
      const bedrooms = parseInt(bhkMatch[1]);
      filteredProperties = filteredProperties.filter(p => p.bedrooms === bedrooms);
      aiResponse += `Filtered for ${bedrooms}BHK properties. `;
    }
    
    // Location filtering
    const locations = ['satellite', 'bopal', 'maninagar', 'sg highway', 'prahlad nagar', 'isro'];
    const mentionedLocation = locations.find(loc => lowerQuery.includes(loc));
    if (mentionedLocation) {
      filteredProperties = filteredProperties.filter(p => 
        p.location.toLowerCase().includes(mentionedLocation)
      );
      aiResponse += `Showing properties in ${mentionedLocation}. `;
    }
    
    // Property type filtering
    if (lowerQuery.includes('office') || lowerQuery.includes('commercial')) {
      filteredProperties = filteredProperties.filter(p => p.type === 'Office');
      aiResponse += 'Filtered for office/commercial spaces. ';
    } else if (lowerQuery.includes('villa')) {
      filteredProperties = filteredProperties.filter(p => p.type === 'Villa');
      aiResponse += 'Filtered for villas. ';
    } else if (lowerQuery.includes('apartment') || lowerQuery.includes('flat')) {
      filteredProperties = filteredProperties.filter(p => p.type === 'Apartment');
      aiResponse += 'Filtered for apartments. ';
    }
    
    // Buy/Rent filtering
    if (lowerQuery.includes('rent')) {
      filteredProperties = filteredProperties.filter(p => p.for === 'rent');
      aiResponse += 'Showing rental properties. ';
    } else if (lowerQuery.includes('buy') || lowerQuery.includes('purchase') || lowerQuery.includes('investment')) {
      filteredProperties = filteredProperties.filter(p => p.for === 'buy');
      aiResponse += 'Showing properties for sale. ';
    }
    
    // Generate response
    if (filteredProperties.length === 0) {
      aiResponse = 'I couldn\'t find any properties matching your criteria. Try adjusting your requirements or ask me for different options.';
    } else {
      aiResponse += `I found ${filteredProperties.length} properties matching your criteria:`;
    }
    
    const suggestions = [
      'Show on map',
      'Refine search',
      'Show investment potential',
      'Find similar properties'
    ];
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: aiResponse,
      suggestions,
      properties: filteredProperties.length > 0 ? filteredProperties : undefined
    };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };
    
    const aiResponse = processAIQuery(inputValue);
    
    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: string, message: ChatMessage) => {
    if (suggestion === 'Show on map' && message.properties) {
      // Navigate to map with properties highlighted
      navigate('/map');
      setIsOpen(false);
    } else {
      setInputValue(suggestion);
    }
  };

  const formatPrice = (value: number, forType: 'buy' | 'rent') => {
    const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
    return forType === 'rent' ? `${inr}/mo` : inr;
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Property Assistant
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          ×
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div className={`max-w-[80%] space-y-2 ${message.type === 'user' ? 'order-first' : ''}`}>
                <div className={`p-3 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-muted'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                
                {/* Property Results */}
                {message.properties && (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {message.properties.slice(0, 3).map((property) => (
                      <div key={property.id} className="p-3 bg-card border rounded-lg text-xs">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm">{property.title}</h4>
                          {property.aiInsights?.bestMatch && (
                            <Badge variant="secondary" className="text-xs">
                              ⭐ Best Match
                            </Badge>
                          )}
                        </div>
                        <p className="text-primary font-medium">{formatPrice(property.price, property.for)}</p>
                        <p className="text-muted-foreground">{property.location}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs">{property.type}</Badge>
                          {property.bedrooms > 0 && (
                            <Badge variant="outline" className="text-xs">{property.bedrooms}BHK</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {message.properties.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{message.properties.length - 3} more properties
                      </p>
                    )}
                  </div>
                )}
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleSuggestionClick(suggestion, message)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me about properties..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="text-sm"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}