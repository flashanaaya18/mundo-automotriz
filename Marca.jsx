import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de React para mostrar una tarjeta de marca con banner.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.id - Identificador único para el anclaje (ej: "mercedes-benz").
 * @param {string} props.nombre - El nombre de la marca.
 * @param {string} props.descripcion - Un párrafo descriptivo de la marca.
 * @param {string} props.bannerUrl - La URL de la imagen para el banner.
 * @param {string} [props.altText] - Texto alternativo para la imagen del banner.
 */
function Marca({ id, nombre, descripcion, bannerUrl, altText }) {
    // Estos nombres de clase corresponden a los estilos definidos en 'estilos.css'
    return (
        <article className="marca-banner" id={id}>
            <img
                src={bannerUrl}
                alt={altText || `Banner de ${nombre}`}
                className="marca-banner-img"
                loading="lazy"
            />
            <div className="marca-banner-content">
                <h3>{nombre}</h3>
                <p>{descripcion}</p>
            </div>
        </article>
    );
}

Marca.propTypes = {
    id: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string.isRequired,
    bannerUrl: PropTypes.string.isRequired,
    altText: PropTypes.string,
};

Marca.defaultProps = {
    altText: '',
};

export default Marca;