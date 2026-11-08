# Fenixia

Fenixia es una aplicación web para explorar un catálogo de muebles y gestionar productos, stock y pedidos. El repositorio contiene un frontend en React y una API REST en Spring Boot que persiste los datos en PostgreSQL.

## Funcionalidades

- Explorar el catálogo y consultar el detalle de los productos.
- Crear, editar y eliminar productos.
- Actualizar el stock y consultar sus movimientos.
- Crear y consultar pedidos, ver sus detalles y actualizar su estado o cancelarlos.
- Usar datos de muestra en el frontend cuando la API no está disponible. En ese modo, los cambios se mantienen solo en memoria y no se guardan en la base de datos.

## Tecnologías

- **Frontend:** React, Vite y JavaScript.
- **Backend:** Java 25, Spring Boot, Spring Data JPA y Maven.
- **Base de datos:** PostgreSQL.

## Requisitos

- Java 25.
- Node.js y npm, en versiones compatibles con Vite 8.
- PostgreSQL.

## Configuración y ejecución

### 1. Preparar PostgreSQL

Crea una base de datos llamada `fenixia` y configura la conexión para que coincida con tus credenciales locales. La configuración actual está en `Backend/src/main/resources/application.properties` y usa `localhost:5432` y el usuario `postgres` por defecto. Define allí tu contraseña local; no la compartas ni la subas al repositorio.

Hibernate actualiza el esquema automáticamente al iniciar la aplicación.

### 2. Iniciar el backend

Desde la raíz del repositorio:

```powershell
cd Backend
.\mvnw.cmd spring-boot:run
```

La API estará disponible en `http://localhost:8080`.

### 3. Iniciar el frontend

En otra terminal, desde la raíz del repositorio:

```powershell
cd Frontend
npm ci
npm run dev
```

Abre `http://localhost:5173`. Vite reenvía las solicitudes `/api` al backend en `http://localhost:8080`.

## API principal

La API usa el prefijo `http://localhost:8080/api`.

| Recurso | Operaciones |
| --- | --- |
| `/productos` | Listar (`GET`), crear (`POST`), consultar por ID (`GET /{id}`), actualizar (`PUT /{id}`) y eliminar (`DELETE /{id}`). |
| `/productos/{id}/stock` | Actualizar stock (`PATCH`). Recibe `{"cantidad": 5}`; los valores negativos representan una salida. |
| `/productos/{id}/movimientos` | Consultar movimientos de stock (`GET`). |
| `/pedidos` | Listar pedidos (`GET`) y crear (`POST`). |
| `/pedidos/{id}` | Consultar un pedido (`GET`). |
| `/pedidos/{id}/detalles` | Consultar los detalles (`GET`). |
| `/pedidos/{id}/estado` | Cambiar el estado (`PATCH`). |
| `/pedidos/{id}/cancelar` | Cancelar un pedido (`DELETE`). |

Para crear un pedido, envía un cuerpo JSON con el nombre del cliente y al menos un artículo:

```json
{
  "nombreCliente": "Nombre del cliente",
  "items": [
    {
      "productoId": 1,
      "cantidad": 2
    }
  ]
}
```

## Comprobaciones

Para ejecutar las pruebas del backend:

```powershell
cd Backend
.\mvnw.cmd test
```

Para compilar y revisar el frontend:

```powershell
cd Frontend
npm run build
npm run lint
```

## Estructura del repositorio

```text
Backend/   API REST y persistencia
Frontend/  Aplicación web
```
