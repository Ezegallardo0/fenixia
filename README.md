<div align="center">

# FENIXIA

### Muebles con identidad. Espacios que se sienten como hogar.

Diseño, calidez y confort para transformar cada ambiente.

[Conocé Fenixia en Instagram](https://www.instagram.com/fenixiaa.visual.integral/)

<br />

![React](https://img.shields.io/badge/React-19-232323?style=flat&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4-232323?style=flat&logo=springboot&logoColor=6DB33F)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-232323?style=flat&logo=postgresql&logoColor=4169E1)

</div>

---

Fenixia Visual Integral es una experiencia digital para descubrir mobiliario de autor, explorar el catálogo y gestionar compras. El proyecto combina una tienda hecha con **React** y una API en **Spring Boot**, con persistencia en **PostgreSQL**.

## ✨ La experiencia

- **Explorá** el catálogo, descubrí cada pieza y guardá tus favoritos.
- **Armá tu carrito** y generá pedidos.
- **Gestioná productos** y mantené el stock al día.
- **Seguí los pedidos**, revisá sus detalles y actualizá su estado.
- **Probá la interfaz** con cuentas y datos de demostración.

> La autenticación es solo una simulación del frontend: no hay gestión real de usuarios en el backend. Si la API está desconectada, la aplicación usa datos locales en memoria; los cambios de ese modo no se guardan y se pierden al recargar.

## 📸 Encontranos

¿Querés conocer más sobre nuestros muebles y espacios?

### [@fenixiaa.visual.integral en Instagram →](https://www.instagram.com/fenixiaa.visual.integral/)

---

## 🚀 Cómo ejecutar el proyecto

### Necesitás

- Java 25
- Node.js compatible con Vite 8 y npm
- PostgreSQL

### 1. Prepará la base de datos

Crea una base llamada `fenixia` en PostgreSQL:

```sql
CREATE DATABASE fenixia;
```

La configuración local predeterminada usa `localhost:5432` y el usuario `postgres`. Configurá la contraseña con una variable de entorno; no guardes credenciales en el repositorio.

### 2. Iniciá la API

En PowerShell, desde la raíz del proyecto:

```powershell
$env:SPRING_DATASOURCE_PASSWORD = "tu contraseña local"
cd Backend
.\mvnw.cmd spring-boot:run
```

La API queda disponible en `http://localhost:8080`. Hibernate actualiza el esquema al iniciar. Si el catálogo está vacío, podés cargar los muebles de muestra desde la interfaz.

### 3. Iniciá la tienda

En otra terminal:

```powershell
cd Frontend
npm ci
npm run dev
```

Abrí [`http://localhost:5173`](http://localhost:5173). Vite conecta las solicitudes `/api` con el backend local.

## 🧰 Tecnologías

| Tienda | API y datos |
| --- | --- |
| React 19 · JavaScript · Vite 8 | Java 25 · Spring Boot 4 · Spring Data JPA · PostgreSQL |

## 🧪 Comprobaciones

```powershell
# Backend
cd Backend
.\mvnw.cmd test
```

```powershell
# Frontend
cd Frontend
npm run build
npm run lint
```

## 🗂️ Estructura

```text
Backend/
  src/main/java/       API, lógica de negocio y persistencia
  src/main/resources/  Configuración de la aplicación
Frontend/
  src/components/      Interfaz y componentes
  src/context/         Carrito, favoritos y sesión de demostración
  src/services/        API y datos de demostración
```

<details>
<summary>📡 Endpoints de la API</summary>

Base local: `http://localhost:8080/api`

| Método | Ruta | Acción |
| --- | --- | --- |
| `GET` | `/productos` | Listar productos |
| `GET` | `/productos/{id}` | Ver un producto |
| `POST` | `/productos` | Crear un producto |
| `PUT` | `/productos/{id}` | Actualizar un producto |
| `DELETE` | `/productos/{id}` | Eliminar un producto |
| `PATCH` | `/productos/{id}/stock` | Ajustar el stock |
| `GET` | `/productos/{id}/movimientos` | Ver movimientos de stock |
| `GET` | `/pedidos` | Listar pedidos |
| `POST` | `/pedidos` | Crear un pedido |
| `GET` | `/pedidos/{id}` | Ver un pedido |
| `GET` | `/pedidos/{id}/detalles` | Ver sus artículos |
| `PATCH` | `/pedidos/{id}/estado` | Cambiar su estado |
| `DELETE` | `/pedidos/{id}/cancelar` | Cancelarlo |

Para ajustar stock, enviá `{"cantidad": 5}`; los valores negativos descuentan unidades. Para crear un pedido:

```json
{
  "nombreCliente": "Camila Rodríguez",
  "items": [
    {
      "productoId": 1,
      "cantidad": 2
    }
  ]
}
```

</details>

<div align="center">

Hecho con dedicación para **Fenixia Visual Integral**<br />
[Instagram @fenixiaa.visual.integral](https://www.instagram.com/fenixiaa.visual.integral/)

</div>
