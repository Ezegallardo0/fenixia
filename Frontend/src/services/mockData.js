export const MOCK_PRODUCTOS = [
  {
    id: 1,
    nombre: "Sillón Nórdico Lino Beige",
    precio: 85000.0,
    stock: 8,
    categoria: "Salón",
    descripcion: "Elegante sillón tapizado en lino natural color arena con estructura de roble macizo y líneas redondeadas que transmiten paz y confort.",
    imagen: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    color: "#EFE8DE"
  },
  {
    id: 2,
    nombre: "Mesa de Centro Roble & Crema",
    precio: 45000.0,
    stock: 12,
    categoria: "Salón",
    descripcion: "Mesa ratona con sobre ovalado de madera clara tratada con ceras ecológicas y patas cilíndricas en tono crema suave.",
    imagen: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    color: "#F4EFEA"
  },
  {
    id: 3,
    nombre: "Silla Minimalista Salvia Suave",
    precio: 28000.0,
    stock: 24,
    categoria: "Comedor",
    descripcion: "Diseño ergonómico y liviano con respaldo curvado en tono verde salvia tenue y patas de fresno pulido.",
    imagen: "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80",
    color: "#E2ECE5"
  },
  {
    id: 4,
    nombre: "Sofá Modular Rosa Empolvado",
    precio: 165000.0,
    stock: 5,
    categoria: "Salón",
    descripcion: "Sofá de tres cuerpos modular tapizado en bouclé suave rosa pastel atenuado con relleno de alta densidad para máxima relajación.",
    imagen: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    color: "#F7E5E3"
  },
  {
    id: 5,
    nombre: "Mesa de Comedor Lenga Natural",
    precio: 115000.0,
    stock: 6,
    categoria: "Comedor",
    descripcion: "Mesa amplia para 6 personas fabricada artesanalmente con vetas naturales a la vista y terminación mate sedosa.",
    imagen: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80",
    color: "#F5EFEB"
  },
  {
    id: 6,
    nombre: "Aparador Escandinavo Marfil",
    precio: 92000.0,
    stock: 7,
    categoria: "Almacenaje",
    descripcion: "Mueble de guardado con 3 puertas ranuradas alistonadas y tiradores integrados, pintado en laca satinada color marfil.",
    imagen: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    color: "#ECE7DE"
  },
  {
    id: 7,
    nombre: "Poltrona Nube Bouclé",
    precio: 74000.0,
    stock: 10,
    categoria: "Salón",
    descripcion: "Asiento envolvente de silueta orgánica con textura de lana bouclé en tono blanco roto, perfecta para rincones de lectura.",
    imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    color: "#EFECE6"
  },
  {
    id: 8,
    nombre: "Mesa de Noche Terracota Serena",
    precio: 22000.0,
    stock: 15,
    categoria: "Dormitorio",
    descripcion: "Mesa auxiliar compacta con un cajón deslizable suave y repisa inferior en tonalidad terracota pastel atenuada.",
    imagen: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80",
    color: "#F6DFD5"
  },
  {
    id: 9,
    nombre: "Cama Platform Cabecero Acolchado",
    precio: 195000.0,
    stock: 3,
    categoria: "Dormitorio",
    descripcion: "Estructura baja japonesa con cabecero en pana suave gris perla cálido y somier de listones flexibles.",
    imagen: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    color: "#E6ECF5"
  },
  {
    id: 10,
    nombre: "Estantería Abierta Fresno & Lino",
    precio: 62000.0,
    stock: 9,
    categoria: "Almacenaje",
    descripcion: "Estantería geométrica de 4 niveles que combina madera de fresno clara con fondos en tonos lino pastel.",
    imagen: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=800&q=80",
    color: "#EAE6DE"
  }
];

export const MOCK_PEDIDOS = [
  {
    id: 101,
    nombreCliente: "Camila Rodríguez",
    fecha: "2026-11-06T14:30:00",
    estado: "CONFIRMADO",
    total: 113000.0
  },
  {
    id: 102,
    nombreCliente: "Martín Benítez",
    fecha: "2026-11-07T10:15:00",
    estado: "PENDIENTE",
    total: 85000.0
  },
  {
    id: 103,
    nombreCliente: "Sofía Navarro",
    fecha: "2026-11-05T18:45:00",
    estado: "COMPLETADO",
    total: 165000.0
  }
];

export const MOCK_DETALLES = {
  101: [
    { id: 1, productoId: 1, nombreProducto: "Sillón Nórdico Lino Beige", cantidad: 1, precioUnitario: 85000.0, subtotal: 85000.0 },
    { id: 2, productoId: 3, nombreProducto: "Silla Minimalista Salvia Suave", cantidad: 1, precioUnitario: 28000.0, subtotal: 28000.0 }
  ],
  102: [
    { id: 3, productoId: 1, nombreProducto: "Sillón Nórdico Lino Beige", cantidad: 1, precioUnitario: 85000.0, subtotal: 85000.0 }
  ],
  103: [
    { id: 4, productoId: 4, nombreProducto: "Sofá Modular Rosa Empolvado", cantidad: 1, precioUnitario: 165000.0, subtotal: 165000.0 }
  ]
};

// Helper para asignar imágenes elegantes según el nombre del producto
export function getProductImage(producto) {
  if (producto.imagen) return producto.imagen;
  const name = (producto.nombre || '').toLowerCase();
  if (name.includes('sofá') || name.includes('sofa')) {
    return 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('sillón') || name.includes('sillon') || name.includes('poltrona')) {
    return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('silla')) {
    return 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('mesa') || name.includes('ratona')) {
    return 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('cama') || name.includes('somier') || name.includes('dormitorio')) {
    return 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('aparador') || name.includes('comoda') || name.includes('estanter') || name.includes('mueble')) {
    return 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80';
}

