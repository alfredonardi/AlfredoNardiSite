import { openDB } from 'idb';

/**
 * Inicialização do IndexedDB
 */
const dbPromise = openDB('photo-report-db', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('photos')) {
            db.createObjectStore('photos', {
                keyPath: 'id',
            });
        }
    },
});

/**
 * Adiciona uma nova foto ao banco de dados
 */
export const addPhoto = async (photo) => {
    try {
        const db = await dbPromise;

        if (!photo.id || !photo.url) {
            throw new Error('A propriedade "id" e "url" são obrigatórias para adicionar uma foto.');
        }

        const allPhotos = await db.getAll('photos');
        const maxPosition = allPhotos.length > 0 ? Math.max(...allPhotos.map(p => p.position)) : 0;
        const newPosition = maxPosition + 1;

        const photoToAdd = {
            ...photo,
            position: newPosition,
            rotation: photo.rotation || 0,
            description: photo.description || '',
            updatedAt: new Date().toISOString(),
        };

        await db.add('photos', photoToAdd);
        console.log('Foto adicionada com sucesso:', photoToAdd);
    } catch (error) {
        console.error('Erro ao adicionar foto:', error);
    }
};

/**
 * Atualiza uma foto existente no banco de dados
 */
export const updatePhoto = async (id, updatedData) => {
    try {
        const db = await dbPromise;
        const existingPhoto = await db.get('photos', id);

        if (!existingPhoto) {
            console.warn('Foto não encontrada para atualização:', id);
            return;
        }

        const updatedPhoto = {
            ...existingPhoto,
            ...updatedData,
            updatedAt: new Date().toISOString(),
        };

        await db.put('photos', updatedPhoto);
        console.log('Foto atualizada com sucesso:', updatedPhoto);
    } catch (error) {
        console.error('Erro ao atualizar foto:', error);
    }
};

/**
 * Remove uma foto do banco de dados pelo ID
 */
export const removePhotoFromDB = async (id) => {
    try {
        const db = await dbPromise;
        await db.delete('photos', id);
        console.log('Foto removida com sucesso:', id);
    } catch (error) {
        console.error('Erro ao remover foto:', error);
    }
};

/**
 * Carrega todas as fotos do banco de dados
 */
export const loadPhotos = async () => {
    try {
        const db = await dbPromise;
        const allPhotos = await db.getAll('photos');

        // Inicializa propriedades essenciais e ordena por posição
        const sortedPhotos = allPhotos.map((photo) => ({
            ...photo,
            position: photo.position || 1,
            rotation: photo.rotation || 0,
            description: photo.description || '',
        })).sort((a, b) => a.position - b.position);

        return sortedPhotos;
    } catch (error) {
        console.error('Erro ao carregar fotos:', error);
        return [];
    }
};

/**
 * Remove todas as fotos do banco de dados
 */
export const clearAllPhotos = async () => {
    try {
        const db = await dbPromise;
        await db.clear('photos');
        console.log('Todas as fotos foram removidas do banco de dados.');
    } catch (error) {
        console.error('Erro ao limpar o banco de dados:', error);
    }
};

/**
 * Busca uma foto pelo ID
 */
export const getPhotoById = async (id) => {
    try {
        const db = await dbPromise;
        return await db.get('photos', id);
    } catch (error) {
        console.error('Erro ao buscar foto por ID:', error);
        return null;
    }
};

/**
 * Remove fotos que atendem a uma condição específica
 */
export const removePhotosByCondition = async (conditionCallback) => {
    try {
        const db = await dbPromise;
        const allPhotos = await db.getAll('photos');

        for (const photo of allPhotos) {
            if (conditionCallback(photo)) {
                await db.delete('photos', photo.id);
                console.log('Foto removida pela condição:', photo);
            }
        }
    } catch (error) {
        console.error('Erro ao remover fotos por condição:', error);
    }
};
