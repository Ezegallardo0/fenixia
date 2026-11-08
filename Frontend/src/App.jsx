import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import OrdersView from './components/OrdersView';
import CartDrawer from './components/CartDrawer';
import ProductDetailModal from './components/ProductDetailModal';
import ProductFormModal from './components/ProductFormModal';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import { getProductos, checkBackendHealth, seedProductosEnBackend } from './services/api';
import './App.css';

function MainApp() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('catalogo');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendLive, setIsBackendLive] = useState(false);
  const [viewOnlyFavorites, setViewOnlyFavorites] = useState(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formProduct, setFormProduct] = useState(null); // null means create, object means edit
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadBackendStatus = useCallback(async () => {
    const isLive = await checkBackendHealth();
    setIsBackendLive(isLive);
    return isLive;
  }, []);

  const loadProductos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductos();
      setProductos(res.data || []);
      setIsBackendLive(res.isLive);
    } catch (err) {
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendStatus();
    loadProductos();
  }, [loadBackendStatus, loadProductos]);

  const handleOpenNewProduct = () => {
    setFormProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (prod) => {
    setFormProduct(prod);
    setIsFormOpen(true);
  };

  const handleSaveSuccess = (prod, action) => {
    loadProductos();
    if (action === 'delete') {
      showToast('Mueble eliminado', `"${prod.nombre}" ha sido quitado del catálogo`, 'info');
    } else if (action === 'edit') {
      showToast('Mueble actualizado', `Los cambios en "${prod.nombre}" fueron guardados en el backend`, 'success');
    } else {
      showToast('¡Nuevo mueble creado!', `"${prod.nombre}" ya está publicado en el catálogo`, 'success');
    }
  };

  const handleOrderSuccess = (pedido) => {
    showToast('Pedido confirmado', `Orden #${pedido.id} para ${pedido.nombreCliente}`, 'success');
    loadProductos(); // update stock counts
  };

  const handleSeedDatabase = async () => {
    setLoading(true);
    showToast('Poblando catálogo...', 'Cargando muebles de muestra en el backend', 'info');
    try {
      await seedProductosEnBackend();
      await loadProductos();
      showToast('Catálogo listo', 'Se cargaron los muebles de muestra exitosamente', 'success');
    } catch (err) {
      showToast('Error', 'No se pudieron cargar los datos de muestra', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWishlist = () => {
    setActiveTab('catalogo');
    setViewOnlyFavorites(true);
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'catalogo') setViewOnlyFavorites(false);
        }}
        onOpenNewProduct={handleOpenNewProduct}
        isBackendLive={isBackendLive}
        onCheckBackend={async () => {
          const live = await loadBackendStatus();
          await loadProductos();
          if (live) {
            showToast('Backend Conectado', 'Conexión exitosa con Spring Boot en localhost:8080', 'success');
          } else {
            showToast('Modo Simulación', 'Spring Boot fuera de línea. Operando en almacenamiento local.', 'info');
          }
        }}
        onOpenWishlist={handleOpenWishlist}
      />

      <main className="main-content">
        {activeTab === 'catalogo' && (
          <>
            <Hero onExploreClick={() => {
              setViewOnlyFavorites(false);
              const el = document.getElementById('catalogo');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }} />

            <ProductCatalog
              productos={productos}
              loading={loading}
              onSelectProduct={setSelectedProduct}
              onEditProduct={handleEditProduct}
              onOpenNewProduct={handleOpenNewProduct}
              onSeedDatabase={handleSeedDatabase}
              isBackendLive={isBackendLive}
              viewOnlyFavorites={viewOnlyFavorites}
              onClearFavoritesView={() => setViewOnlyFavorites(false)}
            />
          </>
        )}

        {activeTab === 'pedidos' && (
          <OrdersView onRefreshNeeded={loadProductos} />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        onOrderSuccess={handleOrderSuccess}
        onGoToCatalog={() => {
          setActiveTab('catalogo');
          setViewOnlyFavorites(false);
        }}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          producto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Product Form Modal (Admin Create / Edit) */}
      {isFormOpen && (
        <ProductFormModal
          producto={formProduct}
          onClose={() => setIsFormOpen(false)}
          onSaveSuccess={handleSaveSuccess}
        />
      )}

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <Footer
        onOpenCatalog={() => {
          setActiveTab('catalogo');
          setViewOnlyFavorites(false);
        }}
        onOpenOrders={() => setActiveTab('pedidos')}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
