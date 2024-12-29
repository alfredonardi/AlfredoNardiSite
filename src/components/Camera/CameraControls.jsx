// src/components/Camera/CameraControls.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Camera.module.css';

function CameraControls({ onSwitchCamera, onCapturePhoto }) {
    return (
        <div className={styles.cameraControls}>
            <button onClick={onSwitchCamera} title="Alternar Câmera">
                <FontAwesomeIcon icon="sync-alt" />
            </button>
            <button onClick={onCapturePhoto} title="Capturar Foto">
                <FontAwesomeIcon icon="camera" />
            </button>
        </div>
    );
}

export default CameraControls;
