import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import {
  IconShoppingBag,
  IconPlus,
  IconPackage,
  IconSofa,
  IconRefresh,
  IconUser,
  IconHeart,
  IconShieldCheck,
  IconLogOut,
  IconInstagram
} from './Icons';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenNewProduct,
  isBackendLive,
  onCheckBackend,
  onOpenWishlist
}) {
  const { user, isLoggedIn, isAdmin, logout, openAuthModal, loginAs } = useAuth();
  const { totalItems, openCart } = useCart();
  const { totalFavorites } = useWishlist();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      {/* Dynamic Announcement & Instagram Bar */}
      <div className="top-announcement-bar">
        <div className="announcement-content">
          <div className="announcement-left">
            <span className="sparkle-bullet">✦</span>
            <span>Colección <strong>Visual Integral</strong> — Muebles a medida y diseño de espacios</span>
          </div>

          <div className="announcement-right">
            <span className="promo-text">3 y 6 cuotas sin interés en todo el catálogo</span>
            <span className="bar-separator">•</span>
            <a
              href="https://www.instagram.com/fenixiaa.visual.integral/?__pwa=1"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-link"
              title="Visitar Instagram @fenixiaa.visual.integral"
            >
              <IconInstagram size={14} />
              <span>@fenixiaa.visual.integral</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <div className="navbar">
        <div className="navbar-container">
          
          {/* Brand / Logo */}
          <div className="navbar-brand" onClick={() => setActiveTab('catalogo')}>
            <div className="brand-icon">
              <IconSofa size={22} />
            </div>
            <div className="brand-texts">
              <span className="brand-title">FENIXIA</span>
              <span className="brand-subtitle">VISUAL INTEGRAL</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="navbar-nav">
            <button
              className={`nav-link ${activeTab === 'catalogo' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalogo')}
            >
              <IconSofa size={17} />
              <span>Catálogo</span>
            </button>

            <button
              className={`nav-link ${activeTab === 'pedidos' ? 'active' : ''}`}
              onClick={() => setActiveTab('pedidos')}
            >
              <IconPackage size={17} />
              <span>{isAdmin ? 'Gestión de Pedidos' : 'Mis Pedidos'}</span>
            </button>

            {/* Wishlist Button */}
            <button
              className={`nav-link ${activeTab === 'favoritos' ? 'active' : ''}`}
              onClick={onOpenWishlist}
              title="Muebles favoritos"
            >
              <IconHeart size={16} filled={totalFavorites > 0} className={totalFavorites > 0 ? 'text-rose' : ''} />
              <span>Favoritos</span>
              {totalFavorites > 0 && <span className="wishlist-pill">{totalFavorites}</span>}
            </button>

            {/* Admin-only Action */}
            {isAdmin && (
              <button
                className="nav-btn-admin-create animate-fade-in"
                onClick={onOpenNewProduct}
              >
                <IconPlus size={15} />
                <span>Crear Mueble</span>
              </button>
            )}
          </nav>

          {/* User Account & Cart Actions */}
          <div className="navbar-actions">
            
            {/* Backend status pill */}
            <div
              className={`backend-pill ${isBackendLive ? 'live' : 'offline'}`}
              title={isBackendLive ? 'Backend Spring Boot conectado' : 'Backend desconectado. Operando en memoria.'}
              onClick={onCheckBackend}
            >
              <span className="status-dot"></span>
              <span className="status-label">{isBackendLive ? 'Online' : 'Simulación'}</span>
              <IconRefresh size={12} className="refresh-icon" />
            </div>

            {/* User Profile / Login */}
            {isLoggedIn ? (
              <div className="user-menu-wrapper">
                <button
                  type="button"
                  className={`user-btn ${isAdmin ? 'admin-user' : ''}`}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar">
                    {isAdmin ? <IconShieldCheck size={16} /> : <IconUser size={16} />}
                  </div>
                  <div className="user-info-text">
                    <span className="user-name">{user.nombre?.split(' ')[0]}</span>
                    <span className="user-role-badge">{isAdmin ? 'Admin' : 'Cliente'}</span>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown-menu animate-fade-in">
                    <div className="dropdown-header">
                      <strong>{user.nombre}</strong>
                      <span className="dropdown-email">{user.email}</span>
                      <span className={`dropdown-badge ${user.rol}`}>
                        {isAdmin ? 'Cuenta Administrador' : 'Cuenta Cliente'}
                      </span>
                    </div>

                    <div className="dropdown-divider"></div>

                    {isAdmin ? (
                      <div className="dropdown-admin-info">
                        <span>🛠️ Tienes permisos completos para agregar, editar y eliminar muebles del catálogo, así como administrar pedidos.</span>
                      </div>
                    ) : (
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setActiveTab('pedidos');
                          setUserMenuOpen(false);
                        }}
                      >
                        <IconPackage size={16} />
                        <span>Ver mis compras</span>
                      </button>
                    )}

                    <div className="dropdown-divider"></div>

                    {/* Quick switch between roles for testing */}
                    <div className="role-switch-section">
                      <span className="role-switch-title">Cambiar de rol para prueba:</span>
                      <button
                        className="role-switch-btn"
                        onClick={() => {
                          loginAs(isAdmin ? 'cliente' : 'admin');
                          setUserMenuOpen(false);
                        }}
                      >
                        Cambiar a modo {isAdmin ? 'Cliente' : 'Administrador'}
                      </button>
                    </div>

                    <div className="dropdown-divider"></div>

                    <button
                      className="dropdown-item logout-item"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                    >
                      <IconLogOut size={16} />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="btn-login-pastel"
                onClick={() => openAuthModal()}
              >
                <IconUser size={16} />
                <span>Iniciar Sesión</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button className="cart-button" onClick={openCart} aria-label="Abrir carrito de compras">
              <div className="cart-icon-wrap">
                <IconShoppingBag size={19} />
                {totalItems > 0 && (
                  <span className="cart-badge animate-fade-in">{totalItems}</span>
                )}
              </div>
              <span className="cart-label">Bolsa</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
