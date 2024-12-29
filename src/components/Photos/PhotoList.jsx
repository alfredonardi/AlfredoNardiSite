// Arquivo: src/components/Photos/PhotoList.jsx

import React from 'react';
import PhotoItem from './PhotoItem';
import styles from './Photos.module.css';

/**
 * Componente PhotoList
 * @param {Object} props
 * @param {Array} props.photos - Array contendo os objetos das fotos
 * @param {Function} props.handlePositionChange - Fun��o para atualizar a posi��o de uma foto ou remover
 */
function PhotoList({ photos, handlePositionChange }) {
    /**
     * Valida��o inicial para garantir que "photos" � um array
     */
    if (!Array.isArray(photos)) {
        console.error('O estado "photos" n�o � uma lista v�lida:', photos);
        return (
            <div className={styles.errorMessage}>
                Erro: n�o foi poss�vel carregar as fotos.
            </div>
        );
    }

    /**
     * Mensagem para estado vazio (sem fotos)
     */
    if (photos.length === 0) {
        return (
            <div className={styles.emptyMessage}>
                Nenhuma foto dispon�vel. Adicione novas fotos para visualiz�-las aqui.
            </div>
        );
    }

    // Log para depura��o: exibe as fotos carregadas
    console.log('Fotos carregadas:', photos);

    return (
        <div className={styles.photoList}>
            {photos
                .sort((a, b) => a.position - b.position)
                .map((photo) => {
                    /**
                     * Valida��o para garantir que cada foto possui um "id" e "position"
                     */
                    if (!photo.id || typeof photo.position !== 'number') {
                        console.warn('Foto sem "id" ou "position" detectada:', photo);
                        return null; // Ignora fotos sem ID ou posi��o v�lida
                    }

                    return (
                        <PhotoItem
                            key={photo.id}
                            photo={photo}
                            handlePositionChange={handlePositionChange}
                            totalPhotos={photos.length}
                        />
                    );
                })}
        </div>
    );
}

export default PhotoList;
