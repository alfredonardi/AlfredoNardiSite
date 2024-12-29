// Arquivo: src/components/Photos/PhotoList.jsx

import React from 'react';
import PhotoItem from './PhotoItem';
import styles from './Photos.module.css';

/**
 * Componente PhotoList
 * @param {Object} props
 * @param {Array} props.photos - Array contendo os objetos das fotos
 * @param {Function} props.handlePositionChange - Função para atualizar a posição de uma foto ou remover
 */
function PhotoList({ photos, handlePositionChange }) {
    /**
     * Validação inicial para garantir que "photos" é um array
     */
    if (!Array.isArray(photos)) {
        console.error('O estado "photos" não é uma lista válida:', photos);
        return (
            <div className={styles.errorMessage}>
                Erro: não foi possível carregar as fotos.
            </div>
        );
    }

    /**
     * Mensagem para estado vazio (sem fotos)
     */
    if (photos.length === 0) {
        return (
            <div className={styles.emptyMessage}>
                Nenhuma foto disponível. Adicione novas fotos para visualizá-las aqui.
            </div>
        );
    }

    // Log para depuração: exibe as fotos carregadas
    console.log('Fotos carregadas:', photos);

    return (
        <div className={styles.photoList}>
            {photos
                .sort((a, b) => a.position - b.position)
                .map((photo) => {
                    /**
                     * Validação para garantir que cada foto possui um "id" e "position"
                     */
                    if (!photo.id || typeof photo.position !== 'number') {
                        console.warn('Foto sem "id" ou "position" detectada:', photo);
                        return null; // Ignora fotos sem ID ou posição válida
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
