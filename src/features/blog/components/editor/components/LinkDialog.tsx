'use client';

import React, { useState } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (url: string, text?: string) => void;
  initialUrl?: string;
  initialText?: string;
}

export function LinkDialog({ 
  open, 
  onOpenChange, 
  onInsert, 
  initialUrl = '', 
  initialText = '' 
}: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;
    
    let finalUrl = url.trim();
    if (!finalUrl.match(/^https?:\/\//)) {
      finalUrl = `https://${finalUrl}`;
    }
    
    onInsert(finalUrl, text.trim() || undefined);
    onOpenChange(false);
    
    setUrl('');
    setText('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    setUrl('');
    setText('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Insert Link
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text">Link text (optional)</Label>
            <Input
              id="text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Text to display"
            />
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!url.trim()}>
              Insert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
