import { useEffect, useState } from 'react';
import { StructuredInputPanel } from '@/components/StructuredInputPanel';
import { CvPreview } from '@/components/CvPreview';
import { useCv } from '@/context/CvContext';
import { FileText, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-[#f5f7f8] text-slate-900">
      <header className="sticky top-0 z-50 h-16 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-full w-full max-w-[1920px] items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#0056b2] p-1.5 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                CV<span className="font-black text-[#0056b2]">Craft</span>
              </h1>
              <p className="text-[11px] text-slate-500">Generador profesional de CV</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs ${
              isWarning
                ? 'border-red-300 bg-red-50 text-red-700'
                : 'border-slate-200 bg-slate-50 text-slate-700'
            }`}>
              Sesión activa: <span className="ml-1 font-mono font-semibold">{minutes}:{seconds}</span>
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid h-[calc(100vh-4rem)] w-full max-w-[1920px] grid-cols-1 md:grid-cols-2">
        <section className="custom-scrollbar overflow-y-auto border-r border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-3xl px-6 py-8">
            <div className="mb-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Crea tu CV profesional</h2>
                  <p className="mt-1 text-sm text-slate-500">Completa las secciones para actualizar la vista previa en tiempo real.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 border-[#0056b2]/40 bg-[#0056b2]/5 text-[#0056b2] hover:bg-[#0056b2]/10"
                  onClick={() => window.dispatchEvent(new Event('cv-import-model'))}
                >
                  Importar modelo
                </Button>
              </div>
            </div>
            <StructuredInputPanel />
          </div>
        </section>
        <section className="overflow-hidden bg-gradient-to-b from-[#f4f7fb] to-[#eef3f7]">
          <div className="h-full p-4 md:p-6">
            <CvPreview />
          </div>
        </section>
      </main>
   </div>
  );
};

export default FormPage;
