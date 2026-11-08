import React, { useState, useEffect } from 'react';
import { createProducto, updateProducto, deleteProducto } from '../services/api';
import { IconX, IconTrash, IconCheck, IconSofa } from './Icons';

export default function ProductFormModal({ producto, onClose, onSaveSuccess }) {
  const isEditing = Boolean(producto?.id);

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('Salón');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre || '');
      setPrecio(producto.precio || '');
      setStock(producto.stock ?? '');
      setCategoria(producto.categoria || 'Salón');
    } else {
      setNombre('');
      setPrecio('');
      setStock('10');
      setCategoria('Salón');
    }
  }, [producto]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorMessage('El nombre del mueble es obligatorio.');
      return;
    }
    if (isNaN(Number(precio)) || Number(precio) <= 0) {
      setErrorMessage('Ingresa un precio válido mayor a 0.');
      return;
    }
    if (isNaN(Number(stock)) || Number(stock) < 0) {
      setErrorMessage('Ingresa una cantidad de stock válida.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      nombre: nombre.trim(),
      precio: parseFloat(precio),
      stock: parseInt(stock, 10),
      categoria
    };

    try {
      let res;
      if (isEditing) {
        res = await updateProducto(producto.id, payload);
      } else {
        res = await createProducto(payload);
      }
      onSaveSuccess(res.data, isEditing ? 'edit' : 'create');
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Error al guardar el mueble en el backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Seguro que deseas eliminar "${producto.nombre}" del catálogo?`)) {
      return;
    }
    setSubmitting(true);
    try {
      await deleteProducto(producto.id);
      onSaveSuccess(producto, 'delete');
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Error al eliminar el mueble.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="modal-card modal-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <IconSofa size={20} />
            <h3>{isEditing ? 'Editar Mueble' : 'Nuevo Mueble para el Catálogo'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <IconX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {errorMessage && (
            <div className="checkout-error">
              {errorMessage}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="prod-nombre">Nombre del Mueble *</label>
            <input
              id="prod-nombre"
              type="text"
              required
              placeholder="Ej. Sofá Modular Salvia 3 Cuerpos"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-pastel"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prod-precio">Precio ($ ARS) *</label>
              <input
                id="prod-precio"
                type="number"
                step="100"
                required
                placeholder="Ej. 95000"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="input-pastel"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-stock">Stock disponible *</label>
              <input
                id="prod-stock"
                type="number"
                min="0"
                required
                placeholder="Ej. 12"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="input-pastel"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prod-cat">Ambiente / Categoría</label>
            <select
              id="prod-cat"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="select-pastel"
            >
              <option value="Salón">Salón / Sala de Estar</option>
              <option value="Comedor">Comedor</option>
              <option value="Dormitorio">Dormitorio</option>
              <option value="Almacenaje">Almacenaje & Estanterías</option>
            </select>
          </div>

          <div className="modal-footer">
            {isEditing && (
              <button
                type="button"
                className="btn-danger-pastel"
                onClick={handleDelete}
                disabled={submitting}
              >
                <IconTrash size={16} />
                <span>Eliminar Mueble</span>
              </button>
            )}

            <div className="modal-footer-actions">
              <button
                type="button"
                className="btn-secondary-pastel"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary-pastel"
                disabled={submitting}
              >
                <IconCheck size={16} />
                <span>{submitting ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Mueble'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

