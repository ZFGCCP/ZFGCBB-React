import { Component, type ReactNode } from "react";

interface BBErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface BBErrorBoundaryState {
  error?: Error | null;
}

export default class BBErrorBoundary extends Component<
  BBErrorBoundaryProps,
  BBErrorBoundaryState
> {
  override state: BBErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BBErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error) {
    if (import.meta.env.DEV)
      console.error("BBErrorBoundary caught a render error:", error);
  }

  reset = () => {
    this.setState({ error: null });
  };

  override render() {
    const { error } = this.state;
    if (error)
      return this.props.fallback ? (
        this.props.fallback(error, this.reset)
      ) : (
        <BBError error={error} onRetry={this.reset} />
      );
    return this.props.children;
  }
}
