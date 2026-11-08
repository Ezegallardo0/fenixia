import React from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getProductImage } from '../services/mockData';
import { IconShoppingBag, IconEye, IconEdit, IconCheck, IconHeart } from './Icons';

export function formatPrice(val) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(val || 0);
}

export default function ProductCard({ producto, onSelect, onEdit }) {
  const { addToCart, cartItems } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const { isAdmin } = useAuth();

  const imageSrc = getProductImage(producto);
  const cartItem = cartItems.find(item => item.producto.id === producto.id);
  const inCartQty = cartItem ? cartItem.cantidad : 0;
  const isOutOfStock = producto.stock <= 0;
  const isLowStock = producto.stock > 0 && producto.stock <= 4;
  const favorited = isFavorite(producto.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(producto, 1);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(producto.id);
  };

  return (
    <article className="product-card" onClick={() => onSelect(producto)}>
      {/* Image container */}
      <div className="product-image-wrap">
        <img
          src={imageSrc}
          alt={producto.nombre}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Floating Stock Badge */}
        <div className="product-badge-wrap">
          {isOutOfStock ? (
            <span className="badge-stock out">Agotado</span>
          ) : isLowStock ? (
            <span className="badge-stock low">Últimas {producto.stock} u.</span>
          ) : (
            <span className="badge-stock in">Stock: {producto.stock}</span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          className={`btn-favorite-heart ${favorited ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={favorited ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          aria-label="Favorito"
        >
          <IconHeart size={17} filled={favorited} />
        </button>

        {/* Quick Action Overlay */}
        <div className="product-overlay">
          <button
            type="button"
            className="btn-overlay-action"
            title="Vista rápida del mueble"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(producto);
            }}
          >
            <IconEye size={17} />
          </button>
          
          {/* Admin-only edit button */}
          {isAdmin && onEdit && (
            <button
              type="button"
              className="btn-overlay-action admin"
              title="Administrar / Editar mueble"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(producto);
              }}
            >
              <IconEdit size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Info Container */}
      <div className="product-info">
        <div className="product-meta">
          <span className="product-category">
            {producto.categoria || 'Visual Integral'}
          </span>
          <span className="product-sku">ID #{producto.id}</span>
        </div>

        <h3 className="product-title" title={producto.nombre}>
          {producto.nombre}
        </h3>

        <div className="product-bottom">
          <div className="product-price-block">
            <span className="price-tag">{formatPrice(producto.precio)}</span>
            <span className="price-installments">6 cuotas de {formatPrice(producto.precio / 6)}</span>
          </div>

          <button
            type="button"
            className={`btn-add-cart ${isOutOfStock ? 'disabled' : ''} ${inCartQty > 0 ? 'in-cart' : ''}`}
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            title={isOutOfStock ? 'Sin stock disponible' : 'Añadir a la bolsa'}
          >
            {inCartQty > 0 ? (
              <>
                <IconCheck size={15} />
                <span>En bolsa ({inCartQty})</span>
              </>
            ) : (
              <>
                <IconShoppingBag size={15} />
                <span>Comprar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
