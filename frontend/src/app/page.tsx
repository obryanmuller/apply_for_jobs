"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/app/styles/page.module.css";

import { TokenCreatedModal } from "@/components/password/TokenCreatedModal";
import { ActionErrorModal } from "@/components/ui/ActionErrorModal";
import { HowItWorksModal } from "@/components/ui/HowItWorksModal";

import { useSecretForm } from "@/components/hooks/useSecretForm";
import { CreateFace } from "@/components/ui/CreateFace";
import { ViewFace } from "@/components/ui/ViewFace";
import { OverlaySwitch } from "@/components/ui/OverlaySwitch";

function MainContent() {
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"create" | "view">("create");
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const isVisualizing = mode === "view";

  useEffect(() => {
    if (searchParams.get("mode") === "view") setMode("view");
  }, [searchParams]);

  const toggleMode = () => setMode((p) => (p === "create" ? "view" : "create"));

  const form = useSecretForm();

  return (
    <main className={styles.main}>
      <div className={`${styles.card} ${isVisualizing ? styles.isVisualizing : ""}`}>
        <div className={`${styles.sideFace} ${styles.createFace}`}>
          <CreateFace
            styles={styles}
            isSubmitting={form.isSubmitting}
            configError={form.configError}
            hasTypedPassword={form.hasTypedPassword}
            password={form.password}
            onPasswordChange={form.onPasswordChange}
            onPasswordClear={form.onPasswordClear}
            onGeneratePreview={form.handleGeneratePreview}
            charsetOptions={form.charsetOptions}
            length={form.length}
            onLengthChange={form.onLengthChange}
            expiresValue={form.expiresValue}
            expiresUnit={form.expiresUnit}
            unitOptions={form.unitOptions}
            onExpiresUnitChange={form.onExpiresUnitChange}
            onExpiresValueChange={form.onExpiresValueChange}
            viewLimit={form.viewLimit}
            onViewLimitChange={form.onViewLimitChange}
            onViewLimitDec={form.onViewLimitDec}
            onViewLimitInc={form.onViewLimitInc}
            onSave={form.handleSave}
            onToggleMode={toggleMode}
            onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          />
        </div>

        <div className={`${styles.sideFace} ${styles.viewFace}`}>
          <ViewFace
            styles={styles}
            tokenInput={form.tokenInput}
            tokenError={form.tokenError}
            onTokenChange={form.onTokenChange}
            onGoToToken={form.handleGoToToken}
            onToggleMode={toggleMode}
          />
        </div>

        <OverlaySwitch styles={styles} isVisualizing={isVisualizing} onToggleMode={toggleMode} />
      </div>

      <TokenCreatedModal
        open={!!form.created}
        url={form.created?.url ?? ""}
        expiresLabel={form.expiresLabel}
        viewLimit={form.viewLimitNumber}
        onClose={form.closeCreated}
        onCopy={form.copyCreatedUrl}
        onViewNow={form.viewNow}
      />

      <ActionErrorModal open={!!form.errorMessage} message={form.errorMessage ?? ""} onClose={form.closeError} />

      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <MainContent />
    </Suspense>
  );
}