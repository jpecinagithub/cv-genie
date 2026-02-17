import { InputPanel } from '@/components/InputPanel';
import { CvPreview } from '@/components/CvPreview';
import { NavLink } from '@/components/NavLink';
import { TemplateSelect } from '@/components/TemplateSelect';

const Index = () => {
  return (
    <div className="flex h-screen bg-background">
      <aside className="w-96 flex-shrink-0 border-r bg-card flex flex-col overflow-hidden">
        <div className="p-4 border-b">
          <h1 className="text-lg font-bold text-foreground tracking-tight">CV Generator</h1>
          <p className="text-xs text-muted-foreground">Genera 5 CVs profesionales al instante</p>
        </div>
        <div className="px-4 pt-3">
          <div className="grid grid-cols-2 gap-2">
            <NavLink
              to="/form"
              className="rounded-md border px-2 py-1.5 text-center text-xs font-medium text-foreground hover:bg-muted"
            >
              Formulario
            </NavLink>
            <div className="rounded-md border border-primary bg-primary/5 px-2 py-1.5 text-center text-xs font-medium text-foreground">
              Texto libre
            </div>
          </div>
          <div className="mt-2 md:w-1/2">
            <TemplateSelect />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 min-h-0 mt-0">
          <InputPanel />
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        <CvPreview />
      </main>
    </div>
  );
};

export default Index;
