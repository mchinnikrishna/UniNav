import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Suppress error and log to console if needed
        console.error('Error caught in Error Boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Suppress error and continue rendering
            return null;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
