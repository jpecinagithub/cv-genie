import { useState } from 'react';
import { CvProvider } from '@/context/CvContext';
import { InputPanel } from '@/components/InputPanel';
import { StructuredInputPanel } from '@/components/StructuredInputPanel';
import { CvList } from '@/components/CvList';
import { CvPreview } from '@/components/CvPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <CvProvider>
      <div className="flex h-screen bg-background">
        {/* Left sidebar */}
        <aside className="w-96 flex-shrink-0 border-r bg-card flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h1 className="text-lg font-bold text-foreground tracking-tight">CV Generator</h1>
            <p className="text-xs text-muted-foreground">Genera 5 CVs profesionales al instante</p>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <Tabs defaultValue="structured" className="flex-1 flex flex-col min-h-0">
              <TabsList className="mx-4 mt-3 grid w-auto grid-cols-2">
                <TabsTrigger value="structured" className="text-xs">Formulario</TabsTrigger>
                <TabsTrigger value="raw" className="text-xs">Texto libre</TabsTrigger>
              </TabsList>
              <TabsContent value="structured" className="flex-1 overflow-auto p-4 min-h-0 mt-0">
                <StructuredInputPanel />
              </TabsContent>
              <TabsContent value="raw" className="flex-1 overflow-auto p-4 min-h-0 mt-0">
                <InputPanel />
              </TabsContent>
            </Tabs>
          </div>
          <div className="border-t p-3 overflow-auto max-h-[35vh]">
            <CvList />
          </div>
        </aside>

        {/* Main preview area */}
        <main className="flex-1 overflow-hidden">
          <CvPreview />
        </main>
      </div>
    </CvProvider>
  );
};

export default Index;
