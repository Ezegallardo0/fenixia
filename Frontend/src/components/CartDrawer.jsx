import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createPedido } from '../services/api';
import { getProductImage } from '../services/mockData';
import { formatPrice } from './ProductCard';
import {
  IconX,
  IconTrash,
  IconPlus,
  IconMinus,
  IconShoppingBag,
  IconCheck,
  IconTruck,
  IconUser,
  IconShieldCheck
} from './Icons';

export default function CartDrawer({ onOrderSuccess, onGoToCatalog }) {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount
  } = useCart();

  const { user, isLoggedIn, openAuthModal } = useAuth();

  const [clienteNombre, setClienteNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill client details when logged in
  useEffect(() => {
    if (user) {
      setClienteNombre(user.nombre || '');
      setTelefono(user.telefono || '');
      setDireccion(user.direccion || '');
    }
  }, [user]);

  if (!isCartOpen) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    if (!clienteNombre.trim()) {
      setErrorMessage('Por favor confirma tu nombre completo.');
      return;
    }

    if (cartItems.length === 0) {
      setErrorMessage('Tu bolsa está vacía.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      nombreCliente: clienteNombre.trim(),
      items: cartItems.map(item => ({
        productoId: item.producto.id,
        cantidad: item.cantidad
      }))
    };

    try {
      const res = await createPedido(payload);
      setOrderCreated(res.data);
      clearCart();
      if (onOrderSuccess) {
        onOrderSuccess(res.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error al procesar el pedido. Verifica el stock disponible.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetDrawer = () => {
    setOrderCreated(null);
    setErrorMessage('');
    closeCart();
  };

  // Progress for free shipping bonus (e.g. at $100.000)
  const freeShippingThreshold = 100000;
  const progressPercent = Math.min(100, (totalAmount / freeShippingThreshold) * 100);
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - totalAmount);

  return (
    <div className="drawer-overlay animate-fade-in" onClick={resetDrawer}>
      <aside className="drawer-container animate-slide-in" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <IconShoppingBag size={20} />
            <h3 className="drawer-title">Bolsa de Compras</h3>
            {totalItems > 0 && <span className="drawer-badge">{totalItems} u.</span>}
          </div>
          <button className="drawer-close-btn" onClick={resetDrawer} aria-label="Cerrar bolsa">
            <IconX size={20} />
          </button>
        </div>

        {/* Free Shipping Dynamic Progress */}
        {cartItems.length > 0 && !orderCreated && (
          <div className="shipping-progress-box">
            <div className="shipping-progress-text">
              <IconTruck size={15} />
              {missingForFreeShipping === 0 ? (
                <span>¡Genial! Tienes <strong>Envío Especializado Bonificado</strong></span>
              ) : (
                <span>Agrega <strong>{formatPrice(missingForFreeShipping)}</strong> más para envío gratuito</span>
              )}
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Success Screen after Order Creation */}
        {orderCreated ? (
          <div className="order-success-screen">
            <div className="success-icon-wrap">
              <IconCheck size={36} />
            </div>
            <h3>¡Pedido confirmado con éxito!</h3>
            <p className="success-p">
              Gracias, <strong>{orderCreated.nombreCliente}</strong>. Tu compra ha quedado registrada en el sistema de Fenixia Visual Integral.
            </p>

            <div className="success-card">
              <div className="success-row">
                <span>Número de Pedido:</span>
                <strong>#{orderCreated.id}</strong>
              </div>
              <div className="success-row">
                <span>Estado actual:</span>
                <span className="badge-status pendiente">{orderCreated.estado || 'PENDIENTE'}</span>
              </div>
              <div className="success-row">
                <span>Total de la orden:</span>
                <strong className="success-total">{formatPrice(orderCreated.total)}</strong>
              </div>
            </div>

            <p className="success-info-note">
              Hemos reservado las piezas en nuestro inventario. Nuestro equipo de coordinación se contactará para acordar fecha y franja horaria de entrega.
            </p>

            <button
              className="btn-primary-pastel full-width"
              onClick={() => {
                resetDrawer();
                if (onGoToCatalog) onGoToCatalog();
              }}
            >
              Seguir explorando muebles
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <div className="drawer-empty">
            <div className="empty-cart-icon">
              <IconShoppingBag size={48} />
            </div>
            <h4>Tu bolsa está vacía</h4>
            <p>Descubre nuestras piezas de diseño cálido y añádelas a tu hogar.</p>
            <button
              className="btn-primary-pastel"
              onClick={() => {
                closeCart();
                if (onGoToCatalog) onGoToCatalog();
              }}
            >
              Ver Catálogo
            </button>
          </div>
        ) : (
          /* Cart Content */
          <>
            <div className="drawer-body">
              {/* Items List */}
              <div className="cart-items-list">
                {cartItems.map(({ producto, cantidad }) => {
                  const img = getProductImage(producto);
                  const isMax = cantidad >= producto.stock;

                  return (
                    <div key={producto.id} className="cart-item">
                      <img src={img} alt={producto.nombre} className="cart-item-img" />
                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <h4 className="cart-item-title">{producto.nombre}</h4>
                          <button
                            type="button"
                            className="cart-item-remove"
                            onClick={() => removeFromCart(producto.id)}
                            title="Eliminar de la bolsa"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>

                        <span className="cart-item-price">
                          {formatPrice(producto.precio)} c/u
                        </span>

                        <div className="cart-item-bottom">
                          {/* Quantity adjustments */}
                          <div className="quantity-selector-sm">
                            <button
                              type="button"
                              onClick={() => updateQuantity(producto.id, -1)}
                              disabled={cantidad <= 1}
                              aria-label="Disminuir"
                            >
                              <IconMinus size={12} />
                            </button>
                            <span>{cantidad}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(producto.id, 1)}
                              disabled={isMax}
                              aria-label="Aumentar"
                            >
                              <IconPlus size={12} />
                            </button>
                          </div>

                          <span className="cart-item-subtotal">
                            {formatPrice(producto.precio * cantidad)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Authentication Gate or Checkout Form */}
              {!isLoggedIn ? (
                <div className="login-required-box animate-fade-in">
                  <div className="login-req-icon">
                    <IconUser size={26} />
                  </div>
                  <h4>Inicia sesión para finalizar tu compra</h4>
                  <p>
                    Para confirmar el pedido y coordinar la entrega de tus muebles, necesitas identificarte en tu cuenta.
                  </p>
                  <button
                    type="button"
                    className="btn-primary-pastel full-width"
                    onClick={() => openAuthModal()}
                  >
                    Iniciar Sesión / Registrarme
                  </button>
                </div>
              ) : (
                <form id="checkout-form" onSubmit={handleCheckout} className="checkout-section animate-fade-in">
                  <div className="checkout-user-badge">
                    <div className="user-dot"></div>
                    <span>Comprando como <strong>{user.nombre}</strong> ({user.email})</span>
                  </div>

                  <h4 className="checkout-title">Datos para la entrega</h4>

                  {errorMessage && (
                    <div className="checkout-error">
                      {errorMessage}
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="clienteNombre">Nombre y Apellido *</label>
                    <input
                      id="clienteNombre"
                      type="text"
                      required
                      placeholder="Ej. Ana Clara Méndez"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      className="input-pastel"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="telefono">Teléfono / WhatsApp</label>
                      <input
                        id="telefono"
                        type="tel"
                        placeholder="Ej. 11 4567-8901"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="input-pastel"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="direccion">Dirección / Localidad</label>
                      <input
                        id="direccion"
                        type="text"
                        placeholder="Ej. Av. Alvear 1450"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        className="input-pastel"
                      />
                    </div>
                  </div>

                  <div className="shipping-notice">
                    <IconTruck size={16} />
                    <span>Embalaje reforzado y entrega coordinada a medida</span>
                  </div>
                </form>
              )}
            </div>

            {/* Footer Summary & Submit */}
            <div className="drawer-footer">
              <div className="summary-row">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'mueble' : 'muebles'}):</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span className="text-free">
                  {missingForFreeShipping === 0 ? 'GRATIS' : 'A coordinar'}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span className="total-amount">{formatPrice(totalAmount)}</span>
              </div>

              {isLoggedIn ? (
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="btn-primary-pastel full-width checkout-btn"
                >
                  {submitting ? 'Registrando pedido en sistema...' : `Confirmar Pedido • ${formatPrice(totalAmount)}`}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="btn-primary-pastel full-width checkout-btn"
                >
                  Iniciar Sesión para Comprar
                </button>
              )}
            </div>
          </>
        )}

      </aside>
    </div>
  );
}
