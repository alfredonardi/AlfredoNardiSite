import React, { useState, useEffect } from 'react';
import { updatePhoto } from '../../services/photoService';
import { rotateImage } from '../../utils/imageUtils';
import styles from './Photos.module.css';

/**
 * Componente PhotoItem
 * @param {Object} props
 * @param {Object} props.photo - Objeto contendo os dados da foto
 * @param {Function} props.handlePositionChange - Função para lidar com a mudança de posição, rotação ou remoção
 * @param {number} props.totalPhotos - Número total de fotos
 */
function PhotoItem({ photo, handlePositionChange, totalPhotos }) {
    const [description, setDescription] = useState(photo.description || '');
    const [inputPosition, setInputPosition] = useState(photo.position || 1);
    const [localImageUrl, setLocalImageUrl] = useState(photo.url);

    /**
     * Sincroniza a posição do estado local com a posição atualizada no pai
     */
    useEffect(() => {
        setInputPosition(photo.position);
    }, [photo.position]);

    /**
     * Função para excluir a foto
     */
    const handleDelete = () => {
        handlePositionChange(photo.id, null); // Remove a foto do estado global
    };

    /**
     * Função para rotacionar a foto
     */
    const handleRotateClick = async () => {
        try {
            const newRotation = (photo.rotation || 0) + 90;
            const rotatedImage = await rotateImage(photo.url, 90);

            // Atualiza o backend com a nova rotação e URL
            const updatedPhoto = {
                ...photo,
                url: rotatedImage,
                rotation: newRotation % 360,
            };

            await updatePhoto(photo.id, updatedPhoto);

            // Atualiza o estado local e notifica o pai
            setLocalImageUrl(rotatedImage);
            handlePositionChange(photo.id, photo.position, rotatedImage); // Atualiza no pai a URL rotacionada
        } catch (error) {
            console.error('Erro ao rotacionar foto:', error);
            alert('Ocorreu um erro ao rotacionar a foto.');
        }
    };

    /**
     * Função para alterar a descrição da foto
     * @param {Event} e - Evento de mudança no textarea
     */
    const handleDescriptionChange = async (e) => {
        const newDescription = e.target.value;
        setDescription(newDescription);

        try {
            const updatedPhoto = {
                ...photo,
                description: newDescription,
            };
            await updatePhoto(photo.id, updatedPhoto); // Atualiza a descrição no backend
        } catch (error) {
            console.error('Erro ao atualizar descrição:', error);
            alert('Ocorreu um erro ao salvar a descrição.');
        }
    };

    /**
     * Função para lidar com a mudança de posição
     * @param {Event} e - Evento de mudança no input
     */
    const handlePositionInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setInputPosition(value);
        }
    };

    /**
     * Função para submeter a nova posição
     * @param {Event} e - Evento de submissão do formulário
     */
    const handlePositionSubmit = async (e) => {
        e.preventDefault();
        const newPos = parseInt(inputPosition, 10);

        if (isNaN(newPos) || newPos < 1 || newPos > totalPhotos) {
            alert(`Posição inválida. Deve ser entre 1 e ${totalPhotos}.`);
            setInputPosition(photo.position); // Restaura a posição original
            return;
        }

        if (newPos !== photo.position) {
            try {
                const updatedPhoto = {
                    ...photo,
                    position: newPos,
                };
                await updatePhoto(photo.id, updatedPhoto); // Atualiza no backend
                handlePositionChange(photo.id, newPos); // Notifica o pai sobre a nova posição
            } catch (error) {
                console.error('Erro ao alterar posição:', error);
                alert('Ocorreu um erro ao alterar a posição.');
            }
        }
    };

    if (!photo.url) {
        console.error('A foto está com dados inválidos:', photo);
        return null;
    }

    return (
        <div className={styles.photoItemContainer}>
            {/* Campo para selecionar a posição */}
            <form onSubmit={handlePositionSubmit} className={styles.positionForm}>
                <label>
                    Posição:
                    <input
                        type="number"
                        value={inputPosition}
                        onChange={handlePositionInputChange}
                        min="1"
                        max={totalPhotos}
                        className={styles.positionInput}
                    />
                </label>
                <button type="submit" className={styles.positionButton}>Alterar</button>
            </form>

            {/* Renderiza a imagem da foto */}
            <img
                src={localImageUrl}
                alt={`Foto ${photo.position}`}
                className={styles.photoItem}
                onError={() => {
                    console.error('Erro ao carregar a imagem rotacionada.');
                }}
            />

            {/* Campo de texto para descrição */}
            <textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Adicione uma descrição"
                className={styles.photoItemControls}
            />

            {/* Botões para ações: Rotacionar e Excluir */}
            <div className={styles.photoItemButtons}>
                <button onClick={handleRotateClick} className={styles.rotateButton}>Rotacionar</button>
                <button onClick={handleDelete} className={styles.removeButton}>Excluir</button>
            </div>
        </div>
    );
}

export default PhotoItem;
