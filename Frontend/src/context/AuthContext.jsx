import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_ACCOUNTS = {
  admin: {
    id: 1,
    nombre: "Admin Fenixia",
    email: "admin@fenixia.com",
    rol: "admin",
    telefono: "11 9999-0000",
    direccion: "Showroom Central Fenixia"
  },
  cliente: {
    id: 2,
    nombre: "Camila Rodríguez",
    email: "camila@fenixia.com",
    rol: "cliente",
    telefono: "11 4455-6677",
    direccion: "Av. Santa Fe 3200, CABA"
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fenixia_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionCallback, setAuthActionCallback] = useState(null);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('fenixia_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('fenixia_auth_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const login = (email, password) => {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === 'admin@fenixia.com') {
      const loggedUser = DEMO_ACCOUNTS.admin;
      setUser(loggedUser);
      setIsAuthModalOpen(false);
      if (authActionCallback) {
        authActionCallback(loggedUser);
        setAuthActionCallback(null);
      }
      return { success: true, user: loggedUser };
    }

    // Default regular client login
    const clientUser = {
      id: Date.now(),
      nombre: cleanEmail.split('@')[0].replace('.', ' '),
      email: cleanEmail,
      rol: 'cliente',
      telefono: '11 2345-6789',
      direccion: 'Ciudad Autónoma de Buenos Aires'
    };
    setUser(clientUser);
    setIsAuthModalOpen(false);
    if (authActionCallback) {
      authActionCallback(clientUser);
      setAuthActionCallback(null);
    }
    return { success: true, user: clientUser };
  };

  const register = (datos) => {
    const newUser = {
      id: Date.now(),
      nombre: datos.nombre,
      email: datos.email.toLowerCase().trim(),
      rol: 'cliente',
      telefono: datos.telefono || '',
      direccion: datos.direccion || ''
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    if (authActionCallback) {
      authActionCallback(newUser);
      setAuthActionCallback(null);
    }
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setAuthActionCallback(null);
  };

  const loginAs = (role) => {
    if (role === 'admin') {
      setUser(DEMO_ACCOUNTS.admin);
    } else {
      setUser(DEMO_ACCOUNTS.cliente);
    }
    setIsAuthModalOpen(false);
  };

  const requireAuth = (callback) => {
    if (user) {
      callback(user);
    } else {
      setAuthActionCallback(() => callback);
      setIsAuthModalOpen(true);
    }
  };

  const openAuthModal = (callback = null) => {
    if (callback) {
      setAuthActionCallback(() => callback);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthActionCallback(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        isAdmin: user?.rol === 'admin',
        login,
        register,
        logout,
        loginAs,
        requireAuth,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

