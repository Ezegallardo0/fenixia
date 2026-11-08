import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { IconSearch, IconFilter, IconSofa, IconSparkles, IconPlus, IconShieldCheck, IconHeart } from './Icons';

const CATEGORIES = ['Todos', 'Salón', 'Comedor', 'Dormitorio', 'Almacenaje'];

export default function ProductCatalog({
  productos,
  loading,
  onSelectProduct,
  onEditProduct,
  onOpenNewProduct,
  onSeedDatabase,
  isBackendLive,
  viewOnlyFavorites = false,
  onClearFavoritesView
}) {
  const { isAdmin } = useAuth();
  const { favorites } = useWishlist();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('destacados');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const filteredProductos = useMemo(() => {
    return productos.filter(p => {
      const matchFavorites = viewOnlyFavorites ? favorites.includes(p.id) : true;
      const matchSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat =
        selectedCategory === 'Todos' ||
        (p.categoria && p.categoria.toLowerCase() === selectedCategory.toLowerCase()) ||
        (!p.categoria && selectedCategory === 'Todos');
      const matchStock = onlyInStock ? p.stock > 0 : true;
      return matchFavorites && matchSearch && matchCat && matchStock;
    }).sort((a, b) => {
      if (sortBy === 'precio-asc') return a.precio - b.precio;
      if (sortBy === 'precio-desc') return b.precio - a.precio;
      if (sortBy === 'nombre') return a.nombre.localeCompare(b.nombre);
      return 0; // 'destacados' default order
    });
  }, [productos, searchTerm, selectedCategory, sortBy, onlyInStock, viewOnlyFavorites, favorites]);

  // Admin stats
  const totalStockUnits = useMemo(() => productos.reduce((acc, p) => acc + (p.stock || 0), 0), [productos]);
  const lowStockCount = useMemo(() => productos.filter(p => p.stock > 0 && p.stock <= 4).length, [productos]);
  const outOfStockCount = useMemo(() => productos.filter(p => p.stock <= 0).length, [productos]);

  return (
    <section className="catalog-section" id="catalogo">
      
      {/* Admin Quick Control Toolbar (Only visible to Admin) */}
      {isAdmin && (
        <div className="admin-toolbar animate-fade-in">
          <div className="admin-toolbar-left">
            <div className="admin-badge">
              <IconShieldCheck size={16} />
              <span>Modo Administrador</span>
            </div>
            <div className="admin-stats-chips">
              <span className="admin-stat-chip">
                <strong>{productos.length}</strong> modelos
              </span>
              <span className="admin-stat-chip">
                <strong>{totalStockUnits}</strong> u. totales
              </span>
              {lowStockCount > 0 && (
                <span className="admin-stat-chip warning">
                  ⚠️ {lowStockCount} con stock bajo
                </span>
              )}
              {outOfStockCount > 0 && (
                <span className="admin-stat-chip danger">
                  ✕ {outOfStockCount} sin stock
                </span>
              )}
            </div>
          </div>

          <div className="admin-toolbar-right">
            <button
              type="button"
              className="btn-admin-action"
              onClick={onOpenNewProduct}
            >
              <IconPlus size={15} />
              <span>Añadir Mueble</span>
            </button>
            {productos.length === 0 && onSeedDatabase && (
              <button
                type="button"
                className="btn-admin-action secondary"
                onClick={onSeedDatabase}
              >
                <IconSparkles size={14} />
                <span>Cargar Muestras</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Favorites Banner if filtered */}
      {viewOnlyFavorites && (
        <div className="favorites-banner animate-fade-in">
          <div className="fav-banner-text">
            <IconHeart size={18} filled className="text-rose" />
            <span>Mostrando únicamente tus muebles guardados en <strong>Favoritos</strong> ({filteredProductos.length})</span>
          </div>
          <button className="fav-banner-close" onClick={onClearFavoritesView}>
            Ver catálogo completo
          </button>
        </div>
      )}

      <div className="catalog-header">
        <div>
          <span className="section-subtitle">Visual Integral • Mobiliario</span>
          <h2 className="section-title">
            {viewOnlyFavorites ? 'Mis Muebles Favoritos' : 'Catálogo de Diseños'}
          </h2>
        </div>
        <div className="catalog-stats">
          <span className="stats-pill">
            {filteredProductos.length} {filteredProductos.length === 1 ? 'mueble encontrado' : 'muebles disponibles'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="catalog-controls">
        
        {/* Search input */}
        <div className="search-bar">
          <IconSearch size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por nombre (ej. Sillón, Mesa, Cama, Modular)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>

        {/* Sorting & Filter controls */}
        <div className="controls-right">
          <div className="filter-item">
            <label htmlFor="sort-select" className="filter-label">Ordenar:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="select-pastel"
            >
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
              <option value="nombre">Nombre A - Z</option>
            </select>
          </div>

          <label className="checkbox-stock-label">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="checkbox-custom"
            />
            <span>Solo en stock</span>
          </label>
        </div>

      </div>

      {/* Category Pills */}
      {!viewOnlyFavorites && (
        <div className="category-pills">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid or Status States */}
      {loading ? (
        <div className="catalog-loading">
          <div className="spinner"></div>
          <p>Cargando catálogo de muebles Fenixia...</p>
        </div>
      ) : filteredProductos.length === 0 ? (
        <div className="catalog-empty">
          <div className="empty-icon-wrap">
            <IconSofa size={36} />
          </div>
          <h3>No encontramos muebles que coincidan</h3>
          <p>Intenta ajustar la búsqueda o seleccionar otra categoría.</p>
          <div className="empty-actions">
            <button
              className="btn-secondary-pastel"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todos');
                setOnlyInStock(false);
                if (viewOnlyFavorites && onClearFavoritesView) onClearFavoritesView();
              }}
            >
              Restablecer filtros
            </button>

            {productos.length === 0 && onSeedDatabase && (
              <button className="btn-primary-pastel" onClick={onSeedDatabase}>
                <IconSparkles size={16} />
                <span>Cargar muebles de muestra</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProductos.map(prod => (
            <ProductCard
              key={prod.id}
              producto={prod}
              onSelect={onSelectProduct}
              onEdit={onEditProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}
