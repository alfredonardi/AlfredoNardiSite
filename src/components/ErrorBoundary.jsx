// Arquivo: src/components/ErrorBoundary.jsx

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Atualiza o estado para exibir a UI de fallback
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // Você pode registrar o erro em um serviço de logging
        console.error('ErrorBoundary caught an error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            // Renderiza qualquer UI de fallback
            return <h2>Ocorreu um erro. Por favor, tente novamente mais tarde.</h2>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
