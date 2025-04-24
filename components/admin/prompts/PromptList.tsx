'use client';

import { useState, useEffect } from 'react';
import PromptCard from './PromptCard';

export default function PromptList() {
  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPrompts() {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prompts`);
        const data = await response.json();
        setPrompts(data);
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPrompts();
  }, []);
  
  if (isLoading) return <div>Loading prompts...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      {prompts.length === 0 && <p>No prompts found</p>}
      {prompts.map(prompt => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );
} 