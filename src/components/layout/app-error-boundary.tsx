import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log to an external service here if you want
    console.error('AppErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    // Optionally force a reload if needed:
    // window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-[60vh] flex items-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <span className="inline-block rounded-2xl px-3 py-1 text-sm bg-[#FF8A65]/10 text-[#FF8A65]">
            Something went wrong
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mt-4 mb-4">
            We hit a snag loading this page.
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Please try again. If the problem persists, go back to the homepage.
          </p>

          <div className="flex gap-3 justify-center">
            <Button onClick={this.handleReset} className="bg-[#6B4EFF] hover:bg-[#5A3FE7]">
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>

          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-8 max-w-3xl mx-auto text-left text-xs bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-auto">
              {this.state.error?.stack || this.state.error?.message}
            </pre>
          )}
        </div>
      </div>
    );
  }
}
