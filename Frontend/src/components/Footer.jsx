import React from 'react';
import { IconSofa, IconTruck, IconShieldCheck, IconInstagram } from './Icons';

export default function Footer({ onOpenCatalog, onOpenOrders }) {
  return (
    <footer className="footer-fenixia">
      <div className="footer-container">
        
        <div className="footer-col brand">
          <div className="footer-brand-title">
            <IconSofa size={22} />
            <span>FENIXIA VISUAL INTEGRAL</span>
          </div>
          <p className="footer-tagline">
            Especialistas en mobiliario de autor, diseño de espacios y comunicación visual armónica.
            Diseñamos piezas únicas en tonos pasteles y maderas nobles para dar identidad,
            calidez y confort a hogares y espacios comerciales.
          </p>
          <div className="footer-social-box">
            <a
              href="https://www.instagram.com/fenixiaa.visual.integral/?__pwa=1"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-instagram-btn"
            >
              <IconInstagram size={18} />
              <span>Seguinos en Instagram @fenixiaa.visual.integral</span>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Experiencia de Compra</h4>
          <ul className="footer-links">
            <li><button onClick={onOpenCatalog}>Catálogo de Muebles</button></li>
            <li><button onClick={onOpenOrders}>Estado de mis Pedidos</button></li>
            <li><a href="#catalogo">Salón & Living</a></li>
            <li><a href="#catalogo">Comedor & Sillas</a></li>
            <li><a href="#catalogo">Dormitorio & Descanso</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Compromiso Fenixia</h4>
          <ul className="footer-features">
            <li>
              <IconTruck size={16} />
              <span>Entregas protegidas con logística especializada</span>
            </li>
            <li>
              <IconShieldCheck size={16} />
              <span>Garantía de fabricación estructural por 24 meses</span>
            </li>
          </ul>
          <p className="footer-note">
            Atención personalizada de Lunes a Sábados de 9:00 a 19:00 hs.
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© {new Date().getFullYear()} Fenixia Visual Integral. Todos los derechos reservados.</p>
          <p className="footer-tech">
            Frontend React + Vite integrado con Backend Spring Boot (API RESTful)
          </p>
        </div>
      </div>
    </footer>
  );
}
