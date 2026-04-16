import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Upload, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';

interface ParticipantManagerProps {
  participants: string[];
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ParticipantManager: React.FC<ParticipantManagerProps> = ({ 
  participants, 
  setParticipants 
}) => {
  const [inputValue, setInputValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addParticipants = (newNames: string[]) => {
    const cleanedNames = newNames
      .map(n => n.trim())
      .filter(n => n !== '');

    const duplicates: string[] = [];
    const uniqueNewNames: string[] = [];

    cleanedNames.forEach(name => {
      if (participants.includes(name) || uniqueNewNames.includes(name)) {
        duplicates.push(name);
      } else {
        uniqueNewNames.push(name);
      }
    });

    if (duplicates.length > 0) {
      toast.warning(`已自動移除重複名稱`, {
        description: `移除名單：${Array.from(new Set(duplicates)).join(', ')}`,
        duration: 5000,
      });
    }

    if (uniqueNewNames.length > 0) {
      setParticipants(prev => [...prev, ...uniqueNewNames]);
      toast.success(`成功新增 ${uniqueNewNames.length} 位參加者`);
    }
  };

  const handleManualAdd = () => {
    if (!inputValue.trim()) return;
    addParticipants([inputValue]);
    setInputValue('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const names = results.data
          .flat()
          .filter((val): val is string => typeof val === 'string' && val.trim() !== '');
        
        addParticipants(names);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const removeParticipant = (index: number) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (confirm('確定要清除所有參加者嗎？')) {
      setParticipants([]);
    }
  };

  const probability = participants.length > 0 
    ? ((1 / participants.length) * 100).toFixed(2) 
    : '0';

  return (
    <Card className="w-full max-w-md border border-white/10 shadow-2xl bg-card backdrop-blur-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-2xl font-black tracking-wider text-primary">
          參加者名單
          <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest">
            Total: {participants.length}
          </span>
        </CardTitle>
        
        {participants.length > 0 && (
          <div className="mt-4 p-4 bg-black/30 rounded-xl border-l-4 border-primary flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-[2px] text-white/50">目前中獎機率</label>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-primary drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">{probability}%</span>
              <span className="text-[10px] text-white/30">(1 / {participants.length} 參加者)</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Input Area */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[2px] text-white/50">手動新增名單</label>
          <div className="flex gap-2">
            <Input 
              placeholder="輸入姓名..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualAdd()}
              className="flex-1 bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
            />
            <Button onClick={handleManualAdd} size="icon" className="bg-primary text-black hover:bg-primary/90">
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* CSV Upload */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[2px] text-white/50">批次導入</label>
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <Button 
            variant="outline" 
            className="w-full flex gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            📂 上傳 CSV 檔案
          </Button>
        </div>

        {/* List Area */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-[2px] text-white/50">參加者列表 ({participants.length})</label>
          <ScrollArea className="h-64 rounded-xl border border-white/10 p-4 bg-black/20">
            {participants.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-30">
                <p className="text-sm">尚未加入任何參加者</p>
              </div>
            ) : (
              <div className="space-y-2">
                {participants.map((name, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                  >
                    <span className="text-sm font-medium text-white/90 truncate max-w-[200px]">
                      <span className="text-white/30 mr-2">{i + 1}.</span>
                      {name}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-destructive hover:bg-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeParticipant(i)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {participants.length > 0 && (
          <Button 
            variant="ghost" 
            className="w-full text-destructive/70 hover:text-destructive hover:bg-destructive/10 text-xs uppercase tracking-widest"
            onClick={clearAll}
          >
            清除所有參加者
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
