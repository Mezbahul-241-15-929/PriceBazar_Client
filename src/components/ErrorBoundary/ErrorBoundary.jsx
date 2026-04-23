import React from 'react';

/**
 * ErrorBoundary Component
 * Catches errors in the component tree and displays a user-friendly error page
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Oops!</h1>
                        <p className="text-gray-600 mb-2">Something went wrong</p>
                        
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-4 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                                <p className="text-xs font-mono text-red-800 break-words">
                                    {this.state.error && this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <button
                                onClick={this.handleReset}
                                className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
                            >
                                Go Home
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
