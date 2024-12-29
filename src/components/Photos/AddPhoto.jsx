// Arquivo: src/components/Photos/AddPhoto.jsx

import React, { useState, useRef } from 'react';
import { addPhoto } from '../../services/photoService'; // Ajuste o caminho se necessário
import { v4 as uuidv4 } from 'uuid';
import Webcam from 'react-webcam';
import styles from './Photos.module.css';

/**
 * Componente AddPhoto
 * Permite ao usuário adicionar novas fotos ao sistema via upload ou câmera.
 * @param {Object} props
 * @param {Array} props.photos - Lista atual de fotos existentes
 * @param {Function} props.setPhotos - Função para atualizar o estado das fotos no componente pai
 * @param {Function} props.onPhotosAdded - Callback para informar ao pai sobre novas fotos adicionadas
 */
function AddPhoto({ photos, onPhotosAdded }) {
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const webcamRef = useRef(null);

    /**
     * Função para converter um arquivo em base64
     */
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    /**
     * Função para lidar com o upload das fotos
     */
    const handleUploadPhotos = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newPhotos = [];
            for (const file of files) {
                try {
                    const base64 = await convertToBase64(file);
                    const newPhoto = {
                        id: uuidv4(),
                        file,
                        url: URL.createObjectURL(file),
                        photo: base64,
                        description: '',
                        position: photos.length + newPhotos.length + 1, // Atribui uma posição inicial
                    };
                    await addPhoto(newPhoto);
                    newPhotos.push(newPhoto);
                } catch (error) {
                    console.error('Erro ao converter a foto para base64:', error);
                }
            }

            if (onPhotosAdded) {
                onPhotosAdded(newPhotos);
            }

            // Resetar o input de arquivo
            e.target.value = null;
        }
    };

    /**
     * Função para capturar a foto da câmera
     */
    const capturePhoto = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            const newPhoto = {
                id: uuidv4(),
                file: null,
                url: imageSrc,
                photo: imageSrc,
                description: '',
                position: photos.length + 1, // Atribui uma posição inicial
            };
            try {
                await addPhoto(newPhoto);
                if (onPhotosAdded) {
                    onPhotosAdded([newPhoto]);
                }
                alert('Foto capturada com sucesso.');
                setIsCameraOpen(false);
            } catch (error) {
                console.error('Erro ao capturar a foto:', error);
                alert('Ocorreu um erro ao capturar a foto.');
            }
        }
    };

    return (
        <div className={styles.addPhotoContainer}>
            {/* Opção de Carregar Fotos */}
            <div className={styles.uploadSection}>
                <label htmlFor="upload-photo" className={styles.uploadLabel}>
                    📁 Carregar Fotos
                </label>
                <input
                    id="upload-photo"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleUploadPhotos}
                    className={styles.uploadInput}
                />
            </div>

            {/* Opção de Tirar Foto com a Câmera */}
            <div className={styles.cameraSection}>
                <button onClick={() => setIsCameraOpen(true)} className={styles.cameraButton}>
                    📷 Tirar Foto com a Câmera
                </button>
            </div>

            {/* Interface da Câmera */}
            {isCameraOpen && (
                <div className={styles.cameraOverlay}>
                    <div className={styles.cameraContainer}>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className={styles.webcam}
                        />
                        <div className={styles.cameraControls}>
                            <button onClick={capturePhoto} className={styles.captureButton}>
                                Capturar Foto
                            </button>
                            <button onClick={() => setIsCameraOpen(false)} className={styles.closeButton}>
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddPhoto;
