import { ReactNode, RefObject } from "react";
import { Download, UploadCloud, UserPlus2 } from "lucide-react";
import Button from "./ui/Button";

type Props = {
  ethicsConfirmed: boolean;
  uploadDisabled: boolean;
  addDisabled: boolean;
  exportDisabled: boolean;
  isUploading: boolean;
  isExporting: boolean;
  fileInputRef: RefObject<HTMLInputElement>;
  onFileChange: (file: File) => void;
  onToggleManual: () => void;
  onExport: () => void;
};

function DisabledHint({ disabled, children }: { disabled: boolean; children: ReactNode }) {
  return (
    <div className="action-wrapper">
      {children}
      {disabled ? <span className="disabled-tooltip">Complete Ethics Declaration before using learner data.</span> : null}
    </div>
  );
}

export default function ActionCluster(props: Props) {
  const {
    ethicsConfirmed,
    uploadDisabled,
    addDisabled,
    exportDisabled,
    isUploading,
    isExporting,
    fileInputRef,
    onFileChange,
    onToggleManual,
    onExport
  } = props;

  return (
    <section className="action-cluster" aria-label="Dataset actions">
      <input
        ref={fileInputRef}
        className="visually-hidden"
        id="csvFile"
        type="file"
        accept=".csv"
        disabled={uploadDisabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileChange(file);
          event.currentTarget.value = "";
        }}
      />
      <DisabledHint disabled={!ethicsConfirmed}>
        <Button variant="action" type="button" disabled={uploadDisabled} onClick={() => fileInputRef.current?.click()}>
          <UploadCloud size={16} aria-hidden="true" /> {isUploading ? "Uploading..." : "Upload CSV"}
        </Button>
      </DisabledHint>
      <DisabledHint disabled={!ethicsConfirmed}>
        <Button variant="action" type="button" disabled={addDisabled} onClick={onToggleManual}><UserPlus2 size={16} aria-hidden="true" /> Add Learner</Button>
      </DisabledHint>
      <DisabledHint disabled={!ethicsConfirmed}>
        <Button variant="action" type="button" disabled={exportDisabled} onClick={onExport}>
          <Download size={16} aria-hidden="true" /> {isExporting ? "Exporting..." : "Export Report"}
        </Button>
      </DisabledHint>
    </section>
  );
}
