import { CvProvider } from '@/context/CvContext';
import { InputPanel } from '@/components/InputPanel';
import { CvList } from '@/components/CvList';
import { CvPreview } from '@/components/CvPreview';

const Index = () => {
  return (
    <CvProvider>
      <div className="flex h-screen bg-background">
        {/* Left sidebar */}
        <aside className="w-80 flex-shrink-0 border-r bg-card flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h1 className="text-lg font-bold text-foreground tracking-tight">CV Generator</h1>
            <p className="text-xs text-muted-foreground">Genera 5 CVs profesionales al instante</p>
          </div>
          <div className="flex-1 overflow-auto p-4 min-h-0">
            <InputPanel />
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
