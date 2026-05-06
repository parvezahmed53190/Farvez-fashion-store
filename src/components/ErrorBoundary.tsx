import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
          <div className="luxury-card p-8 border-red-500/20 max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              We encountered an unexpected error while rendering this sanctuary section. 
              Our craftsmen have been notified.
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="flex items-center justify-center space-x-2 w-full px-6 py-3 gold-gradient text-luxury-black text-xs font-bold uppercase tracking-widest rounded-sm"
            >
              <RotateCcw size={14} />
              <span>Retry Rendering</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
