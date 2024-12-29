// src/components/Camera/CameraView.jsx

import React, { useEffect, useRef, useState } from 'react';
import CameraControls from './CameraControls';
import { addPhoto, loadPhotos } from '../../services/photoService';
import { resizeAndRotateToLandscape } from '../../utils/imageUtils';
import styles from './Camera.module.css';

function CameraView({ videoRef, setPhotos }) {
    const [isRearCamera, setIsRearCamera] = useState(true);
    const streamRef = useRef(null);

    // Função para iniciar a câmera
    const startCamera = async () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
        try {
            const constraints = {
                video: isRearCamera ? { facingMode: 'environment' } : { facingMode: 'user' },
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            videoRef.current.srcObject = mediaStream;
            streamRef.current = mediaStream;
        } catch (err) {
            console.error('Erro ao acessar a câmera:', err);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, [isRearCamera]);

    // Função para capturar foto
    const handleTakePhoto = async () => {
        const canvas = document.createElement('canvas');
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoDataUrl = canvas.toDataURL('image/jpeg', 1.0);

        const resizedPhoto = await resizeAndRotateToLandscape(photoDataUrl, 1024, 1024);

        await addPhoto({ photo: resizedPhoto, description: '', position: photos.length + 1, rotation: 0 });
        const updatedPhotos = await loadPhotos();
        setPhotos(updatedPhotos);
    };

    return (
        <div className={styles.cameraContainer}>
            <video ref={videoRef} autoPlay playsInline muted className={styles.cameraVideo} />
            <CameraControls
                onSwitchCamera={() => setIsRearCamera((prevState) => !prevState)}
                onCapturePhoto={handleTakePhoto}
            />
        </div>
    );
}

export default CameraView;
