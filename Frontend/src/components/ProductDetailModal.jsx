import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { getProductImage } from '../services/mockData';
import { getMovimientosStock } from '../services/api';
import { formatPrice } from './ProductCard';
import { IconX, IconShoppingBag, IconPlus, IconMinus, IconCheck, IconTruck, IconShieldCheck, IconPackage } from './Icons';

export default function ProductDetailModal({ producto, onClose }) {
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [movimientos, setMovimientos] = useState([]);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info' | 'movimientos'

  const cartItem = cartItems.find(item => item.producto.id === producto?.id);
  const currentInCart = cartItem ? cartItem.cantidad : 0;
  const maxAvailable = producto ? Math.max(0, producto.stock - currentInCart) : 0;

  useEffect(() => {
    if (!producto) return;
    setQuantity(1);
    setLoadingMovimientos(true);
    getMovimientosStock(producto.id)
      .then(res => {
        setMovimientos(res.data || []);
      })
      .finally(() => {
        setLoadingMovimientos(false);
      });
  }, [producto]);

  if (!producto) return null;

  const imageSrc = getProductImage(producto);
  const isOutOfStock = producto.stock <= 0;

  const handleAddToCart = () => {
    if (quantity <= 0 || isOutOfStock) return;
    addToCart(producto, quantity);
    onClose();
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-card modal-product-detail" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar modal">
          <IconX size={20} />
        </button>

        <div className="detail-layout">
          {/* Visual Column */}
          <div className="detail-visual">
            <img
              src={imageSrc}
              alt={producto.nombre}
              className="detail-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="detail-visual-badge">
              {isOutOfStock ? (
                <span className="badge-stock out">Agotado temporalmente</span>
              ) : (
                <span className="badge-stock in">Stock disponible: {producto.stock} unidades</span>
              )}
            </div>
          </div>

          {/* Details Column */}
          <div className="detail-info">
            <div className="detail-header">
              <span className="detail-category">{producto.categoria || 'Mobiliario Fenixia'}</span>
              <h2 className="detail-title">{producto.nombre}</h2>
              <span className="detail-sku">Código: FNK-{String(producto.id).padStart(4, '0')}</span>
            </div>

            <div className="detail-price-box">
              <span className="detail-price">{formatPrice(producto.precio)}</span>
              <span className="detail-installments">Hasta 3 cuotas sin interés con bancos seleccionados</span>
            </div>

            {/* Tabs for Info vs Stock Movements */}
            <div className="detail-tabs">
              <button
                className={`detail-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                Descripción & Detalles
              </button>
              <button
                className={`detail-tab-btn ${activeTab === 'movimientos' ? 'active' : ''}`}
                onClick={() => setActiveTab('movimientos')}
              >
                Historial de Stock ({movimientos.length})
              </button>
            </div>

            {activeTab === 'info' ? (
              <div className="detail-tab-content">
                <p className="detail-description">
                  {producto.descripcion ||
                    `Diseñado meticulosamente para aportar equilibrio y serenidad. Fabricado con estructuras robustas y acabados tenues que respetan las texturas orgánicas.`}
                </p>

                <div className="detail-perks">
                  <div className="perk-item">
                    <IconTruck size={17} />
                    <span>Envío con logística especializada en muebles</span>
                  </div>
                  <div className="perk-item">
                    <IconShieldCheck size={17} />
                    <span>Garantía de calidad estructural por 2 años</span>
                  </div>
                  <div className="perk-item">
                    <IconPackage size={17} />
                    <span>Listo para usar o fácil ensamble intuitivo</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="detail-tab-content movements-list">
                {loadingMovimientos ? (
                  <p className="text-muted">Cargando movimientos del backend...</p>
                ) : movimientos.length === 0 ? (
                  <p className="text-muted">No se registran movimientos de stock recientes para este mueble.</p>
                ) : (
                  <div className="movements-table-wrap">
                    <table className="movements-table">
                      <thead>
                        <tr>
                          <th>Tipo</th>
                          <th>Cantidad</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movimientos.map((m, idx) => (
                          <tr key={m.id || idx}>
                            <td>
                              <span className={`movement-pill ${m.tipo === 'ENTRADA' ? 'in' : 'out'}`}>
                                {m.tipo}
                              </span>
                            </td>
                            <td>{m.cantidad} u.</td>
                            <td>{m.fecha ? new Date(m.fecha).toLocaleDateString('es-AR') : 'Reciente'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="detail-action-bar">
              {!isOutOfStock && (
                <div className="quantity-selector">
                  <button
                    type="button"
                    className="qty-btn"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    <IconMinus size={14} />
                  </button>
                  <span className="qty-number">{quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    disabled={quantity >= maxAvailable}
                    onClick={() => setQuantity(q => Math.min(maxAvailable, q + 1))}
                  >
                    <IconPlus size={14} />
                  </button>
                </div>
              )}

              <button
                type="button"
                className={`btn-primary-pastel detail-submit-btn ${isOutOfStock ? 'disabled' : ''}`}
                disabled={isOutOfStock || maxAvailable <= 0}
                onClick={handleAddToCart}
              >
                <IconShoppingBag size={18} />
                <span>
                  {isOutOfStock
                    ? 'Sin existencias'
                    : maxAvailable <= 0
                    ? 'Todo el stock está en tu carrito'
                    : `Agregar ${quantity > 1 ? `(${quantity})` : ''} al Carrito`}
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

