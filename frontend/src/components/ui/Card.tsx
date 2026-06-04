import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function Card({ title, description, children }: Props) {
  return (
    <section className="settings-card">
      <header className="settings-card-head">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </header>
      {children}
    </section>
  );
}
