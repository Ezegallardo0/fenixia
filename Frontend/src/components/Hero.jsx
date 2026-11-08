import React from 'react';
import { IconSparkles, IconTruck, IconShieldCheck, IconSofa, IconInstagram } from './Icons';

export default function Hero({ onExploreClick }) {
  return (
    <section className="hero-section">
      <div className="hero-background-glow"></div>
      
      <div className="hero-content">
        <div className="hero-badge animate-fade-in">
          <IconSparkles size={15} />
          <span>Fenixia Visual Integral • Arquitectura, Muebles de Diseño & Espacios</span>
        </div>

        <h1 className="hero-title">
          Piezas que dan vida <br />
          <span className="hero-title-accent">a tus espacios más queridos</span>
        </h1>

        <p className="hero-description">
          Conectamos el diseño de autor y la producción artesanal en maderas nobles con una
          estética serena en tonos pasteles y cálidos. Cada mueble está pensado para generar
          armonía, bienestar visual y funcionalidad en tu día a día.
        </p>

        <div className="hero-actions">
          <button className="btn-primary-pastel" onClick={onExploreClick}>
            Explorar Catálogo
          </button>

          <a
            href="https://www.instagram.com/fenixiaa.visual.integral/?__pwa=1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-instagram-pastel"
          >
            <IconInstagram size={18} />
            <span>@fenixiaa.visual.integral</span>
          </a>
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <div className="feature-icon sage">
              <IconSofa size={18} />
            </div>
            <div>
              <h4>Visual Integral</h4>
              <p>Mobiliario en armonía con tu arquitectura</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon rose">
              <IconShieldCheck size={18} />
            </div>
            <div>
              <h4>Calidad & Garantía</h4>
              <p>Maderas macizas y acabados ecológicos</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon sand">
              <IconTruck size={18} />
            </div>
            <div>
              <h4>Envíos Cuidados</h4>
              <p>Embalaje de alta protección a domicilio</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
