import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconX, IconCheck, IconShieldCheck, IconSofa } from './Icons';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, loginAs } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register fields
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regDireccion, setRegDireccion] = useState('');

  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }
    setError('');
    login(loginEmail, loginPassword);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regNombre.trim() || !regEmail.trim()) {
      setError('Por favor completa los campos obligatorios.');
      return;
    }
    setError('');
    register({
      nombre: regNombre.trim(),
      email: regEmail.trim(),
      password: regPassword,
      telefono: regTelefono.trim(),
      direccion: regDireccion.trim()
    });
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={closeAuthModal}>
      <div className="modal-card modal-auth" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={closeAuthModal} aria-label="Cerrar modal">
          <IconX size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-brand-badge">
            <IconSofa size={22} />
          </div>
          <h3 className="auth-title">Bienvenido a Fenixia</h3>
          <p className="auth-subtitle">
            Visual Integral • Muebles de autor, espacios cálidos y confort
          </p>
        </div>

        {/* Quick Demo Switcher Pills */}
        <div className="demo-accounts-box">
          <span className="demo-label">Acceso rápido para prueba:</span>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn client"
              onClick={() => loginAs('cliente')}
            >
              Entrar como Cliente
            </button>
            <button
              type="button"
              className="demo-btn admin"
              onClick={() => loginAs('admin')}
            >
              <IconShieldCheck size={14} />
              Entrar como Administrador
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); }}
          >
            Crear Cuenta Nueva
          </button>
        </div>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Correo Electrónico</label>
              <input
                id="login-email"
                type="email"
                required
                placeholder="ejemplo@correo.com o admin@fenixia.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="input-pastel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-pwd">Contraseña</label>
              <input
                id="login-pwd"
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="input-pastel"
              />
            </div>

            <div className="auth-note">
              <span>Para rol administrador usar: <strong>admin@fenixia.com</strong></span>
            </div>

            <button type="submit" className="btn-primary-pastel full-width auth-submit">
              Ingresar a Fenixia
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <label htmlFor="reg-nombre">Nombre y Apellido *</label>
              <input
                id="reg-nombre"
                type="text"
                required
                placeholder="Ej. Sofía Herrera"
                value={regNombre}
                onChange={(e) => setRegNombre(e.target.value)}
                className="input-pastel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Correo Electrónico *</label>
              <input
                id="reg-email"
                type="email"
                required
                placeholder="tuemail@ejemplo.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="input-pastel"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-tel">Teléfono</label>
                <input
                  id="reg-tel"
                  type="tel"
                  placeholder="11 5566-7788"
                  value={regTelefono}
                  onChange={(e) => setRegTelefono(e.target.value)}
                  className="input-pastel"
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-dir">Dirección de Entrega</label>
                <input
                  id="reg-dir"
                  type="text"
                  placeholder="Calle y altura"
                  value={regDireccion}
                  onChange={(e) => setRegDireccion(e.target.value)}
                  className="input-pastel"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-pwd">Contraseña *</label>
              <input
                id="reg-pwd"
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="input-pastel"
              />
            </div>

            <button type="submit" className="btn-primary-pastel full-width auth-submit">
              Crear mi Cuenta de Cliente
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

