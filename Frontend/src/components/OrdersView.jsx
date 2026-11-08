import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPedidos, getDetallesPedido, updateEstadoPedido, cancelarPedido } from '../services/api';
import { formatPrice } from './ProductCard';
import { IconPackage, IconRefresh, IconCheck, IconX, IconTruck, IconSearch, IconEye, IconUser, IconShieldCheck } from './Icons';

export default function OrdersView({ onRefreshNeeded }) {
  const { user, isLoggedIn, isAdmin, openAuthModal } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loadingDetalles, setLoadingDetalles] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getPedidos();
      setPedidos(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSelectPedido = async (pedido) => {
    setSelectedPedido(pedido);
    setLoadingDetalles(true);
    try {
      const res = await getDetallesPedido(pedido.id);
      setDetalles(res.data || []);
    } catch (err) {
      console.error(err);
      setDetalles([]);
    } finally {
      setLoadingDetalles(false);
    }
  };

  const handleUpdateStatus = async (pedidoId, nuevoEstado) => {
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await updateEstadoPedido(pedidoId, nuevoEstado);
      setMessage({ type: 'success', text: `Pedido #${pedidoId} actualizado a ${nuevoEstado}` });
      await fetchOrders();
      if (selectedPedido && selectedPedido.id === pedidoId) {
        setSelectedPedido(res.data);
      }
      if (onRefreshNeeded) onRefreshNeeded();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error al actualizar el estado' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelPedido = async (pedidoId) => {
    if (!window.confirm(`¿Estás seguro de cancelar el pedido #${pedidoId}? Esta acción reintegrará el stock de los productos.`)) {
      return;
    }
    setActionLoading(true);
    setMessage(null);
    try {
      const res = await cancelarPedido(pedidoId);
      setMessage({ type: 'success', text: `Pedido #${pedidoId} cancelado. Stock reintegrado.` });
      await fetchOrders();
      if (selectedPedido && selectedPedido.id === pedidoId) {
        setSelectedPedido(res.data);
      }
      if (onRefreshNeeded) onRefreshNeeded();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error al cancelar el pedido' });
    } finally {
      setActionLoading(false);
    }
  };

  // If user is regular client, show orders belonging to them, or all orders if demo
  const userFilteredPedidos = pedidos.filter(p => {
    if (isAdmin) return true;
    if (!user) return true;
    const clientName = (user.nombre || '').toLowerCase();
    const orderClient = (p.nombreCliente || '').toLowerCase();
    // Matches client name or partial
    return orderClient.includes(clientName) || clientName.includes(orderClient);
  });

  const finalFilteredPedidos = (userFilteredPedidos.length > 0 ? userFilteredPedidos : pedidos).filter(p => {
    const term = searchTerm.toLowerCase();
    const matchName = (p.nombreCliente || '').toLowerCase().includes(term);
    const matchId = String(p.id).includes(term);
    const matchStatus = statusFilter === 'TODOS' || (p.estado || '').toUpperCase() === statusFilter;
    return (matchName || matchId) && matchStatus;
  });

  return (
    <section className="orders-section">
      <div className="orders-header">
        <div>
          <span className="section-subtitle">
            {isAdmin ? 'Panel de Control • Visual Integral' : 'Mis Compras & Seguimiento'}
          </span>
          <h2 className="section-title">
            {isAdmin ? 'Gestión Central de Pedidos' : 'Tus Pedidos en Fenixia'}
          </h2>
        </div>
        <button
          className="btn-secondary-pastel refresh-btn"
          onClick={fetchOrders}
          disabled={loading}
        >
          <IconRefresh size={16} />
          <span>Actualizar</span>
        </button>
      </div>

      {!isLoggedIn && (
        <div className="guest-orders-banner animate-fade-in">
          <IconUser size={18} />
          <span>Inicia sesión para asociar y ver tus pedidos de forma personalizada.</span>
          <button className="guest-login-btn" onClick={() => openAuthModal()}>
            Identificarme
          </button>
        </div>
      )}

      {message && (
        <div className={`notification-banner ${message.type}`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)}>×</button>
        </div>
      )}

      {/* Filter and search bar */}
      <div className="orders-controls">
        <div className="search-bar">
          <IconSearch size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por cliente o número de orden (#ID)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="status-chips">
          {['TODOS', 'PENDIENTE', 'CONFIRMADO', 'COMPLETADO', 'CANCELADO'].map(st => (
            <button
              key={st}
              className={`status-chip ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="catalog-loading">
          <div className="spinner"></div>
          <p>Cargando órdenes del sistema...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="catalog-empty">
          <div className="empty-icon-wrap">
            <IconPackage size={36} />
          </div>
          <h3>Aún no hay compras registradas</h3>
          <p>Tus compras confirmadas en el carrito se sincronizan automáticamente con el backend.</p>
        </div>
      ) : (
        <div className="orders-grid-layout">
          
          {/* Orders List Column */}
          <div className="orders-list">
            {finalFilteredPedidos.length === 0 ? (
              <p className="no-matches">No hay pedidos que coincidan con la búsqueda.</p>
            ) : (
              finalFilteredPedidos.map(pedido => {
                const isSelected = selectedPedido?.id === pedido.id;
                const estado = (pedido.estado || 'PENDIENTE').toUpperCase();

                return (
                  <article
                    key={pedido.id}
                    className={`order-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectPedido(pedido)}
                  >
                    <div className="order-card-header">
                      <div>
                        <span className="order-number">Orden #{pedido.id}</span>
                        <h4 className="order-client">{pedido.nombreCliente}</h4>
                      </div>
                      <span className={`badge-status ${estado.toLowerCase()}`}>
                        {estado}
                      </span>
                    </div>

                    <div className="order-card-footer">
                      <span className="order-date">
                        {pedido.fecha ? new Date(pedido.fecha).toLocaleString('es-AR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Fecha reciente'}
                      </span>
                      <strong className="order-total">{formatPrice(pedido.total)}</strong>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Order Details Column */}
          <div className="order-detail-panel">
            {selectedPedido ? (
              <div className="panel-card animate-fade-in">
                <div className="panel-header">
                  <div>
                    <span className="panel-subtitle">Comprobante de Orden</span>
                    <h3>#{selectedPedido.id} — {selectedPedido.nombreCliente}</h3>
                  </div>
                  <span className={`badge-status ${(selectedPedido.estado || 'PENDIENTE').toLowerCase()}`}>
                    {selectedPedido.estado}
                  </span>
                </div>

                <div className="panel-meta-grid">
                  <div className="meta-box">
                    <span className="meta-label">Fecha de Compra</span>
                    <span className="meta-value">
                      {selectedPedido.fecha ? new Date(selectedPedido.fecha).toLocaleString('es-AR') : '—'}
                    </span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-label">Total Facturado</span>
                    <span className="meta-value highlight">{formatPrice(selectedPedido.total)}</span>
                  </div>
                </div>

                {/* Actions Bar (Admin has status controls, Client can cancel if pending) */}
                <div className="order-actions-bar">
                  <span className="actions-label">
                    {isAdmin ? 'Acciones de Administrador:' : 'Opciones del Pedido:'}
                  </span>

                  <div className="action-buttons-group">
                    {/* Admin transitions */}
                    {isAdmin && selectedPedido.estado === 'PENDIENTE' && (
                      <button
                        type="button"
                        className="btn-action confirm"
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedPedido.id, 'CONFIRMADO')}
                      >
                        <IconCheck size={15} />
                        <span>Confirmar Pedido</span>
                      </button>
                    )}

                    {isAdmin && selectedPedido.estado === 'CONFIRMADO' && (
                      <button
                        type="button"
                        className="btn-action complete"
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedPedido.id, 'COMPLETADO')}
                      >
                        <IconCheck size={15} />
                        <span>Completar y Entregar</span>
                      </button>
                    )}

                    {/* Both Admin and Client can cancel pending orders */}
                    {(selectedPedido.estado === 'PENDIENTE' || (isAdmin && selectedPedido.estado === 'CONFIRMADO')) && (
                      <button
                        type="button"
                        className="btn-action cancel"
                        disabled={actionLoading}
                        onClick={() => handleCancelPedido(selectedPedido.id)}
                      >
                        <IconX size={15} />
                        <span>Cancelar Pedido</span>
                      </button>
                    )}

                    {selectedPedido.estado === 'COMPLETADO' && (
                      <span className="status-finished-note">
                        ✓ Pedido completado y entregado al cliente
                      </span>
                    )}

                    {selectedPedido.estado === 'CANCELADO' && (
                      <span className="status-finished-note canceled">
                        ✕ Pedido cancelado (Stock reintegrado)
                      </span>
                    )}
                  </div>
                </div>

                {/* Items in the order */}
                <div className="panel-items-section">
                  <h4>Muebles adquiridos</h4>

                  {loadingDetalles ? (
                    <p className="text-muted">Cargando desglose...</p>
                  ) : detalles.length === 0 ? (
                    <p className="text-muted">No se encontraron artículos en esta orden.</p>
                  ) : (
                    <div className="order-items-table">
                      {detalles.map(d => (
                        <div key={d.id} className="order-item-row">
                          <div className="order-item-name">
                            <strong>{d.nombreProducto}</strong>
                            <span className="order-item-qty">{d.cantidad} {d.cantidad === 1 ? 'unidad' : 'unidades'} × {formatPrice(d.precioUnitario)}</span>
                          </div>
                          <span className="order-item-subtotal">
                            {formatPrice(d.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="panel-placeholder">
                <IconEye size={36} />
                <h4>Selecciona un pedido</h4>
                <p>Haz clic en cualquier orden para ver los muebles adquiridos y su estado de entrega.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </section>
  );
}
