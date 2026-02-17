import { useEffect, useState } from 'react';
import { StructuredInputPanel } from '@/components/StructuredInputPanel';
import { CvPreview } from '@/components/CvPreview';
import { NavLink } from '@/components/NavLink';
import { TemplateSelect } from '@/components/TemplateSelect';
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
    <div className="flex h-screen flex-col bg-background md:flex-row">
      <aside className="w-full border-r bg-card flex flex-col overflow-hidden md:w-1/2">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-foreground tracking-tight">CV Generator</h1>
          <p className="text-xs text-muted-foreground">Completa el formulario para crear tu CV</p>
          <div className={`mt-2 inline-flex items-center rounded-md border px-2 py-1 text-xs ${
            isWarning
              ? 'border-destructive/40 bg-destructive/10 text-destructive'
              : 'bg-muted/40'
          }`}>
            Sesion activa: <span className="ml-1 font-mono font-semibold">{minutes}:{seconds}</span>
          </div>
        </div>
        <div className="px-4 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md border border-primary bg-primary/5 px-2 py-1.5 text-center text-xs font-medium text-foreground">
              Formulario
            </div>
            <NavLink
              to="/"
              className="rounded-md border px-2 py-1.5 text-center text-xs font-medium text-foreground hover:bg-muted"
            >
              Texto libre
            </NavLink>
          </div>
          <div className="mt-2 md:w-1/2">
            <TemplateSelect />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 min-h-0 mt-0">
          <StructuredInputPanel />
        </div>
      </aside>

      <main className="flex-1 overflow-hidden md:w-1/2">
        <CvPreview />
      </main>
    </div>
  );
};

export default FormPage;
