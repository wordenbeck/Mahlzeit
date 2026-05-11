import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import './ErrorBoundary.css';

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Im Prototyp: nur Console. Später: an Sentry / Vercel Logs senden.
    console.error('[ErrorBoundary] caught:', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="errboundary">
        <div className="errboundary__card">
          <AlertTriangle size={48} strokeWidth={1.5} className="errboundary__icon" />
          <h1>Da ist was schiefgelaufen</h1>
          <p>Die App ist auf einen Fehler gestoßen. Lade neu oder geh zur Startseite zurück.</p>
          {this.state.error?.message && (
            <pre className="errboundary__detail">{this.state.error.message}</pre>
          )}
          <div className="errboundary__actions">
            <button className="errboundary__primary" onClick={() => window.location.reload()}>
              <RefreshCw size={14} strokeWidth={2} /> Neu laden
            </button>
            <button className="errboundary__secondary" onClick={() => { this.reset(); window.location.href = '/'; }}>
              <Home size={14} strokeWidth={2} /> Zur Startseite
            </button>
          </div>
        </div>
      </div>
    );
  }
}
