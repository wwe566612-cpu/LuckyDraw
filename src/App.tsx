/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LuckyWheel } from '@/src/components/LuckyWheel';
import { ParticipantManager } from '@/src/components/ParticipantManager';
import { Toaster } from '@/components/ui/sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinnerDialog, setShowWinnerDialog] = useState(false);

  const handleResult = (result: string) => {
    setWinner(result);
    setShowWinnerDialog(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col">
      {/* Header */}
      <header className="h-[60px] px-10 flex items-center justify-between border-bottom border-white/10 bg-black/20 backdrop-blur-md relative z-20">
        <div className="text-2xl font-black tracking-[2px] text-primary drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
          LUCKY DRAW PRO
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="opacity-60 text-xs tracking-widest uppercase">系統狀態：運作正常</span>
        </div>
      </header>

      <main className="flex-1 relative z-10 grid lg:grid-cols-[340px_1fr] gap-6 p-6 max-w-[1400px] mx-auto w-full">
        {/* Sidebar: Management */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <ParticipantManager 
            participants={participants} 
            setParticipants={setParticipants} 
          />
        </motion.aside>

        {/* Stage: Wheel */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center relative"
        >
          <LuckyWheel 
            participants={participants} 
            onResult={handleResult}
            isDrawing={isDrawing}
            setIsDrawing={setIsDrawing}
          />
          <div className="mt-6 opacity-40 text-xs uppercase tracking-[2px]">
            點擊按鈕開始隨機篩選幸運兒
          </div>
        </motion.section>
      </main>

      {/* Winner Dialog */}
      <AnimatePresence>
        {showWinnerDialog && (
          <Dialog open={showWinnerDialog} onOpenChange={setShowWinnerDialog}>
            <DialogContent className="sm:max-w-md text-center p-12 overflow-hidden bg-[#1A2233] border-white/10 text-white">
              <div className="absolute top-0 left-0 w-full h-2 bg-primary shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
              
              <DialogHeader className="space-y-4">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
                  <Trophy className="w-10 h-10 text-primary animate-bounce" />
                </div>
                <DialogTitle className="text-3xl font-black tracking-wider text-primary">恭喜中獎！</DialogTitle>
                <DialogDescription className="text-lg text-white/60">
                  本次抽獎的幸運兒是：
                </DialogDescription>
              </DialogHeader>

              <div className="my-8 p-8 bg-black/40 rounded-2xl border-2 border-primary/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-4xl md:text-6xl font-black text-primary break-all drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]">
                  {winner}
                </span>
              </div>

              <DialogFooter className="sm:justify-center">
                <Button 
                  type="button" 
                  size="lg"
                  className="w-full sm:w-auto px-12 rounded-full font-black tracking-widest bg-primary text-black hover:bg-primary/90"
                  onClick={() => setShowWinnerDialog(false)}
                >
                  太棒了！
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <Toaster position="top-center" richColors />
    </div>
  );
}
