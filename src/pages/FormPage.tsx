import { useEffect, useState } from 'react';
import { StructuredInputPanel } from '@/components/StructuredInputPanel';
import { CvPreview } from '@/components/CvPreview';
import { useCv } from '@/context/CvContext';

const SESSION_DURATION_MS = 30 * 60 * 1000;

const FormPage = () => {
  const { startSession, sessionExpiresAt } = useCv();
  const [remainingMs, setRemainingMs] = useState(SESSION_DURATION_MS);

  useEffect(() => {
    startSession();
  }, [startSession]);

  useEffect(() => {
    if (!sessionExpiresAt) {
      setRemainingMs(SESSION_DURATION_MS);
      return;
    }

    const update = () => {
      setRemainingMs(Math.max(0, sessionExpiresAt - Date.now()));
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [sessionExpiresAt]);

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const isWarning = remainingMs <= 5 * 60 * 1000;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-[1680px] px-3 py-3 md:px-5 md:py-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-lg font-bold text-foreground tracking-tight">CV Generator</h1>
              <p className="text-xs text-muted-foreground">Completa el formulario para crear tu CV</p>
            </div>
          </div>
          <div className={`mt-2 inline-flex items-center rounded-md border px-2 py-1 text-xs ${
            isWarning
              ? 'border-destructive/40 bg-destructive/10 text-destructive'
              : 'bg-muted/40'
          }`}>
            Sesion activa: <span className="ml-1 font-mono font-semibold">{minutes}:{seconds}</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <main className="min-w-0 rounded-lg border bg-card p-4">
            <StructuredInputPanel />
          </main>
          <aside className="min-w-0 rounded-lg border bg-card p-2">
            <CvPreview />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
