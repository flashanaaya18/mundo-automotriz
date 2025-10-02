import React from 'react';
import PropTypes from 'prop-types'; // 1. Importamos PropTypes

/**
 * Componente Card funcional y reutilizable.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {string} props.imagen - La URL de la imagen para la tarjeta.
 * @param {string} props.titulo - El título de la tarjeta.
 * @param {string} props.descripcion - El texto descriptivo de la tarjeta.
 * @param {string} [props.enlace] - (Opcional) La URL a la que dirigirá el botón "Ver más".
 * @param {string} [props.altText] - (Opcional) Texto alternativo para la imagen.
 */
function Card({ imagen, titulo, descripcion, enlace, altText }) {
  // Usamos las clases CSS que ya tienes en tu archivo 'estilos.css'.
  // React usa 'className' en lugar de 'class'.
  return (
    <article className="card">
      <div className="card-img">
        <img src={imagen} alt={altText} />
      </div>
      <div className="card-content">
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
        {/* 
          Renderizado condicional: 
          Este botón solo aparecerá si se le pasa la prop "enlace".
        */}
        {enlace && (
          <a href={enlace} className="btn btn-sm" target="_blank" rel="noopener noreferrer">
            Ver más
          </a>
        )}
      </div>
    </article>
  );
}

// 2. Definimos los tipos de las props para validación y autocompletado.
Card.propTypes = {
  imagen: PropTypes.string.isRequired,
  titulo: PropTypes.string.isRequired,
  descripcion: PropTypes.string.isRequired,
  enlace: PropTypes.string,
  altText: PropTypes.string,
};

// 3. (Opcional pero recomendado) Definimos valores por defecto para las props no requeridas.
Card.defaultProps = {
  enlace: null,
  // Si no se provee un altText, se usará el título por defecto para mejorar la accesibilidad.
  // Nota: Esto es una mejora sobre `alt={altText || titulo}` porque el valor por defecto
  // se resuelve antes del renderizado. Para que funcione, necesitamos que `titulo` esté
  // disponible, por lo que lo pasamos como un argumento a la función de defaultProps.
  // Sin embargo, la forma más simple y común es no depender de otras props aquí.
  altText: 'Imagen de la tarjeta',
};

export default Card;