import { ReactNode, RefObject } from "react";

type Props = {
  fileInputRef: RefObject<HTMLInputElement>;
  uploadDisabled: boolean;
  addDisabled: boolean;
  exportDisabled: boolean;
  ethicsConfirmed: boolean;
  isUploading: boolean;
  isExporting: boolean;
  onUploadFile: (file: File) => void;
  onToggleManualForm: () => void;
  onExport: () => void;
};

function DisabledActionHint({ children, disabled }: { children: ReactNode; disabled: boolean }) {
  return (
    <div className="action-wrapper">
      {children}
      {disabled ? <span className="disabled-tooltip">Please complete the Ethics Declaration before using learner data.</span> : null}
    </div>
  );
}

export default function ExportSection({
  fileInputRef,
  uploadDisabled,
  addDisabled,
  exportDisabled,
  ethicsConfirmed,
  isUploading,
  isExporting,
  onUploadFile,
  onToggleManualForm,
  onExport
}: Props) {
  return (
    <section className="action-cluster" id="export-actions" aria-label="Dataset actions">
      <input
        ref={fileInputRef}
        className="visually-hidden"
        id="csvFile"
        type="file"
        accept=".csv"
        disabled={uploadDisabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onUploadFile(file);
          event.currentTarget.value = "";
        }}
      />
      <DisabledActionHint disabled={!ethicsConfirmed}>
        <button className="btn btn-action" type="button" disabled={uploadDisabled} onClick={() => fileInputRef.current?.click()}>
          ☁ {isUploading ? "Uploading..." : "Upload CSV"}
        </button>
      </DisabledActionHint>
      <DisabledActionHint disabled={!ethicsConfirmed}>
        <button className="btn btn-action" type="button" disabled={addDisabled} onClick={onToggleManualForm}>
          ♧ Add Learner
        </button>
      </DisabledActionHint>
      <DisabledActionHint disabled={!ethicsConfirmed}>
        <button className="btn btn-action" type="button" disabled={exportDisabled} onClick={onExport}>
          ⇩ {isExporting ? "Exporting..." : "Export Report"}
        </button>
      </DisabledActionHint>
    </section>
  );
}
