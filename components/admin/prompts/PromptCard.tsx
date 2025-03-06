'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface PromptProps {
  id: string;
  title: string;
  content: string;
  // Add other properties as needed
}

interface Props {
  prompt: PromptProps;
}

export default function PromptCard({ prompt }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium">{prompt.title}</h3>
      
      <p className={`mt-2 ${isExpanded ? '' : 'line-clamp-3'}`}>
        {prompt.content}
      </p>
      
      <div className="mt-4 flex justify-between items-center">
        <Button 
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
        
        <div className="space-x-2">
          <Button variant="outline">Edit</Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </div>
    </div>
  );
} 