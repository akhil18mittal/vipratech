import { useState } from "react";
import { FitDiagnosticModal } from "./components/FitDiagnosticModal";
import { SignalGridPage } from "./components/SignalGridPage";

export default function App() {
  const [diagnosticWorkflow, setDiagnosticWorkflow] = useState<string | null>(null);

  const handleOpenDiagnostic = (workflow = "") => setDiagnosticWorkflow(workflow);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <main className="flex-1 overflow-x-hidden">
        <SignalGridPage onOpenDiagnostic={handleOpenDiagnostic} />
      </main>

      {/* Global AI Fit Diagnostic Modal */}
      <FitDiagnosticModal
        key={diagnosticWorkflow === null ? "closed" : `open-${diagnosticWorkflow}`}
        isOpen={diagnosticWorkflow !== null}
        onClose={() => setDiagnosticWorkflow(null)}
        initialWorkflow={diagnosticWorkflow || undefined}
      />
    </div>
  );
}
