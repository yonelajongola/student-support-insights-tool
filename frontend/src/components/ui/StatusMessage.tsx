type Props = {
  tone: "ok" | "warn" | "error";
  message: string;
};

export default function StatusMessage({ tone, message }: Props) {
  return <p className={`status-message status-${tone}`}>{message}</p>;
}
