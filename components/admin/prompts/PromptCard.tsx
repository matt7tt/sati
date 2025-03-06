'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Text } from "@/components/ui/typography"

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
    <Card>
      <CardHeader>
        <CardTitle>{prompt.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text className={`mt-2 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {prompt.content}
        </Text>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          onClick={() => setIsExpanded(!isExpanded)}
          variant="ghost"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
        <Button variant="outline">Edit</Button>
        <Button variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
} 