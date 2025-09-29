import React, { Component, ReactNode } from 'react';

interface SuppressErrorBoundaryProps {
    children: ReactNode;
}

interface SuppressErrorBoundaryState {
    hasError: boolean;
}

class SuppressErrorBoundary extends Component<SuppressErrorBoundaryProps, SuppressErrorBoundaryState> {
    constructor(props: SuppressErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): SuppressErrorBoundaryState {
        // Update state to show fallback UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        // Silently catch the error without logging
        // You can also log the error to an external service here
        // console.error('Error caught in Error Boundary:', error, info);
    }

    render() {
        // Continue rendering children even if there's an error
        return this.props.children;
    }
}

export default SuppressErrorBoundary;
