import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Tentar recuperar o usuário do localStorage ao carregar a página
        const storagedUser = localStorage.getItem('@SaborSenac:user');

        if (storagedUser) {
            setUser(JSON.parse(storagedUser));
        }
        setLoading(false);
    }, []);

    async function login(email, senha) {
        return {
            success: false,
            message: 'Serviço de autenticação indisponível.'
        };
    }

    function logout() {
        localStorage.removeItem('@SaborSenac:user');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    return context;
}