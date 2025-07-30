import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";
import { ShieldAlert } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="mb-4 text-muted-foreground">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 