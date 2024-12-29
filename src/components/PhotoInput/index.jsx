import { useState, useEffect } from 'react';
import { loadPhotos, clearAllPhotos, updatePhoto } from '../../services/photoService';
import BOInput from '../../components/BOInput';
import GroupSelector from '../../components/GroupSelector';
import AddPhoto from '../../components/Photos/AddPhoto';
import PhotoList from '../../components/Photos/PhotoList';
import { generatePDFReport } from '../../utils/generatePDFReport'; // Import da função de geração do PDF
import styles from './PhotoReportApp.module.css';

function PhotoReportApp() {
    const [selectedGroup, setSelectedGroup] = useState('Grupo 1');
    const [boNumber, setBoNumber] = useState('');
    const [version, setVersion] = useState('Versão 1');
    const [photos, setPhotos] = useState([]);
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        const fetchAndSyncPhotos = async () => {
            try {
                const loadedPhotos = await loadPhotos();
                const updatedPhotos = await Promise.all(
                    (loadedPhotos || []).map(async (photo) => {
                        const updatedPhoto = {
                            ...photo,
                            rotation: photo.rotation || 0, // Garante que a rotação inicial esteja definida
                            description: photo.description || '', // Garante que a descrição esteja inicializada
                        };
                        // Sincroniza com o backend se necessário
                        if (!photo.rotation || !photo.description) {
                            await updatePhoto(photo.id, updatedPhoto);
                        }
                        return updatedPhoto;
                    })
                );
                setPhotos(updatedPhotos);
                console.log('Fotos sincronizadas:', updatedPhotos);
            } catch (error) {
                console.error('Erro ao carregar e sincronizar as fotos:', error);
            }
        };
        fetchAndSyncPhotos();
    }, []);

    // Função auxiliar para converter arquivo em base64
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleClearReport = async () => {
        if (window.confirm('Você realmente deseja iniciar um novo relatório? Isso apagará todas as fotos.')) {
            setIsClearing(true);
            try {
                await clearAllPhotos();
                setPhotos([]);
                alert('Relatório limpo com sucesso.');
            } catch (error) {
                console.error('Erro ao limpar o relatório:', error);
                alert('Ocorreu um erro ao limpar o relatório.');
            } finally {
                setIsClearing(false);
            }
        }
    };

    const handlePhotosAdded = async (newPhotos) => {
        if (!newPhotos || newPhotos.length === 0) {
            console.warn('Nenhuma foto foi adicionada.');
            return;
        }

        const updatedPhotos = [];
        for (const photo of newPhotos) {
            if (photo.file && !photo.photo) {
                const base64 = await convertToBase64(photo.file);
                updatedPhotos.push({ ...photo, photo: base64, rotation: 0, description: '' });
            } else {
                updatedPhotos.push({ ...photo, rotation: 0, description: '' });
            }
        }

        try {
            // Sincroniza cada nova foto com o backend
            for (const photo of updatedPhotos) {
                await updatePhoto(photo.id, photo);
            }

            setPhotos((prevPhotos) => [...prevPhotos, ...updatedPhotos]);
            console.log('Novas fotos adicionadas e sincronizadas:', updatedPhotos);
        } catch (error) {
            console.error('Erro ao adicionar fotos:', error);
            alert('Ocorreu um erro ao adicionar as fotos.');
        }
    };

    const handleGenerateReport = async () => {
        if (!boNumber || photos.length === 0) {
            alert('Por favor, preencha o número do BO e adicione ao menos uma foto antes de gerar o relatório.');
            return;
        }

        try {
            await generatePDFReport({
                photos,
                boNumber,
                version,
                selectedGroup,
            });
            alert('Relatório gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar o relatório:', error);
            alert('Ocorreu um erro ao gerar o relatório.');
        }
    };

    return (
        <div className={styles.photoReportApp}>
            <div className={styles.headerSection}>
                <img src="/logo.jpg" alt="Logotipo da Polícia" className={styles.logo} />
                <h3 className={styles.title}>Gerador de Relatório Fotográfico</h3>
            </div>

            <BOInput
                boNumber={boNumber}
                setBoNumber={setBoNumber}
                version={version}
                setVersion={setVersion}
            />

            <GroupSelector
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
            />

            <AddPhoto setPhotos={setPhotos} onPhotosAdded={handlePhotosAdded} />

            <div className={styles.appContent}>
                {photos.length > 0 ? (
                    <PhotoList photos={photos} setPhotos={setPhotos} />
                ) : (
                    <p className={styles.noPhotosMessage}>Nenhuma foto adicionada.</p>
                )}
            </div>

            <button
                onClick={handleClearReport}
                className={styles.clearButton}
                disabled={isClearing}
            >
                {isClearing ? 'Limpando...' : 'Limpar Relatório'}
            </button>

            <button
                onClick={handleGenerateReport}
                className={styles.reportButton}
            >
                Gerar Relatório
            </button>
        </div>
    );
}

export default PhotoReportApp;
