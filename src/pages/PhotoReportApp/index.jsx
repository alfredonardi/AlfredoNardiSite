import { useState, useEffect } from 'react';
import { loadPhotos, clearAllPhotos, updatePhoto, addPhoto } from '../../services/photoService';
import BOInput from '../../components/BOInput';
import GroupSelector from '../../components/GroupSelector';
import AddPhoto from '../../components/Photos/AddPhoto';
import PhotoList from '../../components/Photos/PhotoList';
import { generatePDFReport } from '../../utils/generatePDFReport';
import styles from './PhotoReportApp.module.css';

function PhotoReportApp() {
    const [selectedGroup, setSelectedGroup] = useState('Grupo 1');
    const [boNumber, setBoNumber] = useState('');
    const [version, setVersion] = useState('Versão 1');
    const [photos, setPhotos] = useState([]);
    const [isClearing, setIsClearing] = useState(false);

    // Função para carregar fotos e sincronizar com o banco de dados
    useEffect(() => {
        const fetchAndSyncPhotos = async () => {
            try {
                const loadedPhotos = await loadPhotos();

                // Verifica se as fotos carregadas estão sincronizadas no banco
                const syncedPhotos = await Promise.all(
                    loadedPhotos.map(async (photo) => {
                        if (!photo.id) {
                            // Adiciona fotos sem ID ao banco
                            const newPhoto = {
                                ...photo,
                                id: crypto.randomUUID(), // Gera um ID único
                                position: photo.position || loadedPhotos.length + 1,
                                description: photo.description || '',
                                rotation: photo.rotation || 0,
                            };
                            await addPhoto(newPhoto);
                            return newPhoto;
                        }
                        return photo;
                    })
                );

                // Atualiza o estado com as fotos sincronizadas
                setPhotos(syncedPhotos);
                console.log('Fotos sincronizadas:', syncedPhotos);
            } catch (error) {
                console.error('Erro ao carregar e sincronizar as fotos:', error);
            }
        };

        fetchAndSyncPhotos();
    }, []);

    const handleClearReport = async () => {
        if (window.confirm('Você realmente deseja iniciar um novo relatório? Isso apagará todas as fotos, BO, versão e grupo.')) {
            setIsClearing(true);
            try {
                await clearAllPhotos();
                setPhotos([]);
                setBoNumber('');
                setVersion('Versão 1');
                setSelectedGroup('Grupo 1');
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

        try {
            const updatedPhotos = await Promise.all(
                newPhotos.map(async (photo) => {
                    if (photo.file && !photo.photo) {
                        const base64 = await convertToBase64(photo.file);
                        return { ...photo, photo: base64 };
                    }
                    return photo;
                })
            );

            // Adiciona as novas fotos ao banco
            for (const photo of updatedPhotos) {
                await addPhoto(photo);
            }

            setPhotos((prevPhotos) => {
                const combinedPhotos = [...prevPhotos, ...updatedPhotos];
                combinedPhotos.sort((a, b) => a.position - b.position);
                return combinedPhotos;
            });
            alert('Fotos adicionadas com sucesso.');
        } catch (error) {
            console.error('Erro ao adicionar fotos:', error);
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
                selectedGroup
            });
        } catch (error) {
            console.error('Erro ao gerar o relatório:', error);
            alert('Ocorreu um erro ao gerar o relatório.');
        }
    };

    const handlePositionChange = async (photoId, newPosition = null, rotatedUrl = null) => {
        try {
            const updatedPhotos = [...photos];

            if (rotatedUrl) {
                // Atualização de rotação
                const photoIndex = updatedPhotos.findIndex((photo) => photo.id === photoId);
                if (photoIndex !== -1) {
                    updatedPhotos[photoIndex] = {
                        ...updatedPhotos[photoIndex],
                        url: rotatedUrl,
                    };
                    await updatePhoto(photoId, { url: rotatedUrl });
                }
            }

            if (newPosition !== null) {
                // Atualização de posição
                const photoIndex = updatedPhotos.findIndex((photo) => photo.id === photoId);
                if (photoIndex !== -1) {
                    updatedPhotos[photoIndex] = {
                        ...updatedPhotos[photoIndex],
                        position: newPosition,
                    };
                    await updatePhoto(photoId, { position: newPosition });
                }
            }

            // Reordena as fotos para refletir as mudanças no estado
            setPhotos(updatedPhotos.sort((a, b) => a.position - b.position));
        } catch (error) {
            console.error('Erro ao alterar foto:', error);
            alert('Ocorreu um erro ao alterar a foto.');
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

            <AddPhoto photos={photos} onPhotosAdded={handlePhotosAdded} />

            <div className={styles.appContent}>
                {photos.length > 0 ? (
                    <PhotoList photos={photos} handlePositionChange={handlePositionChange} />
                ) : (
                    <p className={styles.noPhotosMessage}>Nenhuma foto adicionada.</p>
                )}
            </div>

            <button
                onClick={handleGenerateReport}
                className={styles.reportButton}
            >
                Gerar Relatório
            </button>

            <button
                onClick={handleClearReport}
                className={styles.clearButton}
                disabled={isClearing}
            >
                {isClearing ? 'Limpando...' : 'Limpar Relatório'}
            </button>
        </div>
    );
}

export default PhotoReportApp;
