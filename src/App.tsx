import { useState } from "react";
import { FitDiagnosticModal } from "./components/FitDiagnosticModal";
import { SignalGridPage } from "./components/SignalGridPage";

export default function App() {
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [diagnosticInitialService, setDiagnosticInitialService] = useState<string | undefined>();

  const handleOpenDiagnostic = (serviceId?: string) => {
    setDiagnosticInitialService(serviceId);
    setIsDiagnosticOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <main className="flex-1 overflow-x-hidden">
        <SignalGridPage onOpenDiagnostic={handleOpenDiagnostic} />
      </main>

      {/* Global AI Fit Diagnostic Modal */}
      <FitDiagnosticModal
        key={
          isDiagnosticOpen
            ? `open-${diagnosticInitialService || "default"}`
            : "closed"
        }
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        initialServiceId={diagnosticInitialService}
      />
    </div>
  );
}
