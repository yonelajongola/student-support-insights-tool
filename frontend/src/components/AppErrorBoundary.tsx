import { Component, ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      message: ""
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || "Unexpected UI error."
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-shell" role="alert" aria-live="assertive">
          <section className="fatal-card">
            <h1>Something went wrong</h1>
            <p>The interface hit an unexpected error and could not continue safely.</p>
            <p className="fatal-detail">{this.state.message}</p>
            <button className="btn" type="button" onClick={() => window.location.reload()}>
              Reload Application
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;