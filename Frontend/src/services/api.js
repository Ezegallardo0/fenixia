import { MOCK_PRODUCTOS, MOCK_PEDIDOS, MOCK_DETALLES } from './mockData';

const BASE_URL = '/api';

// In-memory fallback store if backend is offline or unreachable
let localProductos = [...MOCK_PRODUCTOS];
let localPedidos = [...MOCK_PEDIDOS];
let localDetalles = { ...MOCK_DETALLES };

export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${BASE_URL}/productos`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (err) {
    return false;
  }
}

// ----------------- PRODUCTOS -----------------

export async function getProductos() {
  try {
    const res = await fetch(`${BASE_URL}/productos`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    console.warn('Backend no disponible, usando datos locales:', err.message);
    return { data: localProductos, isLive: false, error: err.message };
  }
}

export async function getProducto(id) {
  try {
    const res = await fetch(`${BASE_URL}/productos/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    const prod = localProductos.find(p => p.id === Number(id));
    return { data: prod, isLive: false };
  }
}

export async function createProducto(producto) {
  try {
    const res = await fetch(`${BASE_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: producto.nombre,
        precio: Number(producto.precio),
        stock: Number(producto.stock)
      })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Error ${res.status}`);
    }
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    console.warn('Creando producto en modo local:', err.message);
    const nuevo = {
      ...producto,
      id: Date.now(),
      precio: Number(producto.precio),
      stock: Number(producto.stock)
    };
    localProductos = [nuevo, ...localProductos];
    return { data: nuevo, isLive: false };
  }
}

export async function updateProducto(id, producto) {
  try {
    const res = await fetch(`${BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: producto.nombre,
        precio: Number(producto.precio),
        stock: Number(producto.stock)
      })
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    localProductos = localProductos.map(p =>
      p.id === Number(id) ? { ...p, ...producto, precio: Number(producto.precio), stock: Number(producto.stock) } : p
    );
    const updated = localProductos.find(p => p.id === Number(id));
    return { data: updated, isLive: false };
  }
}

export async function deleteProducto(id) {
  try {
    const res = await fetch(`${BASE_URL}/productos/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return { success: true, isLive: true };
  } catch (err) {
    localProductos = localProductos.filter(p => p.id !== Number(id));
    return { success: true, isLive: false };
  }
}

export async function updateStock(id, cantidad) {
  try {
    const res = await fetch(`${BASE_URL}/productos/${id}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: Number(cantidad) })
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    localProductos = localProductos.map(p => {
      if (p.id === Number(id)) {
        return { ...p, stock: p.stock + Number(cantidad) };
      }
      return p;
    });
    const updated = localProductos.find(p => p.id === Number(id));
    return { data: updated, isLive: false };
  }
}

export async function getMovimientosStock(id) {
  try {
    const res = await fetch(`${BASE_URL}/productos/${id}/movimientos`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    return { data: [], isLive: false };
  }
}

// ----------------- PEDIDOS -----------------

export async function getPedidos() {
  try {
    const res = await fetch(`${BASE_URL}/pedidos`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    return { data: localPedidos, isLive: false };
  }
}

export async function getPedido(id) {
  try {
    const res = await fetch(`${BASE_URL}/pedidos/${id}`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    const pedido = localPedidos.find(p => p.id === Number(id));
    return { data: pedido, isLive: false };
  }
}

export async function getDetallesPedido(id) {
  try {
    const res = await fetch(`${BASE_URL}/pedidos/${id}/detalles`);
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    const detalles = localDetalles[id] || [];
    return { data: detalles, isLive: false };
  }
}

export async function createPedido(request) {
  // request: { nombreCliente: string, items: [{ productoId: Long, cantidad: int }] }
  try {
    const res = await fetch(`${BASE_URL}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok) {
      const errText = await res.text();
      let errorMsg = `Error ${res.status}`;
      try {
        const jsonErr = JSON.parse(errText);
        errorMsg = jsonErr.message || jsonErr.error || errorMsg;
      } catch (e) {
        if (errText) errorMsg = errText;
      }
      throw new Error(errorMsg);
    }
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    if (err.message && !err.message.includes('fetch')) {
      // Backend returned business validation error
      throw err;
    }
    console.warn('Backend desconectado, creando pedido en modo simulación:', err.message);
    const newId = Date.now() % 10000;
    let total = 0;
    const detalles = request.items.map((item, idx) => {
      const prod = localProductos.find(p => p.id === Number(item.productoId)) || { nombre: 'Mueble Fenixia', precio: 50000 };
      const subtotal = prod.precio * item.cantidad;
      total += subtotal;
      // reduce local stock
      prod.stock = Math.max(0, prod.stock - item.cantidad);
      return {
        id: idx + 1,
        productoId: item.productoId,
        nombreProducto: prod.nombre,
        cantidad: item.cantidad,
        precioUnitario: prod.precio,
        subtotal
      };
    });

    const newPedido = {
      id: newId,
      nombreCliente: request.nombreCliente,
      fecha: new Date().toISOString(),
      estado: 'PENDIENTE',
      total
    };

    localPedidos = [newPedido, ...localPedidos];
    localDetalles[newId] = detalles;
    return { data: newPedido, isLive: false };
  }
}

export async function updateEstadoPedido(id, nuevoEstado) {
  try {
    const res = await fetch(`${BASE_URL}/pedidos/${id}/estado`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Error ${res.status}`);
    }
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    localPedidos = localPedidos.map(p =>
      p.id === Number(id) ? { ...p, estado: nuevoEstado } : p
    );
    const updated = localPedidos.find(p => p.id === Number(id));
    return { data: updated, isLive: false };
  }
}

export async function cancelarPedido(id) {
  try {
    const res = await fetch(`${BASE_URL}/pedidos/${id}/cancelar`, {
      method: 'DELETE'
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Error ${res.status}`);
    }
    const data = await res.json();
    return { data, isLive: true };
  } catch (err) {
    localPedidos = localPedidos.map(p =>
      p.id === Number(id) ? { ...p, estado: 'CANCELADO' } : p
    );
    const updated = localPedidos.find(p => p.id === Number(id));
    return { data: updated, isLive: false };
  }
}

// Poblar la base de datos de Spring Boot si está vacía
export async function seedProductosEnBackend() {
  const creados = [];
  for (const item of MOCK_PRODUCTOS) {
    try {
      const res = await fetch(`${BASE_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: item.nombre,
          precio: item.precio,
          stock: item.stock
        })
      });
      if (res.ok) {
        creados.push(await res.json());
      }
    } catch (e) {
      console.error('Error poblando item', item.nombre, e);
    }
  }
  return creados;
}

