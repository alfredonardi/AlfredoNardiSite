/**
 * Redimensiona e rotaciona uma imagem para o modo paisagem.
 * @param {string} base64Str - String base64 da imagem.
 * @param {number} maxWidth - Largura máxima permitida (padrão: 1024).
 * @param {number} maxHeight - Altura máxima permitida (padrão: 1024).
 * @returns {Promise<string>} - Retorna uma string base64 da imagem ajustada.
 */
export const resizeAndRotateToLandscape = (base64Str, maxWidth = 1024, maxHeight = 1024) => {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = base64Str;

        img.onload = () => {
            let canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            let ctx = canvas.getContext('2d');

            if (width < height) {
                // Rotaciona para modo paisagem
                canvas.width = height;
                canvas.height = width;
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate((90 * Math.PI) / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
            } else {
                // Mantém a orientação original
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0);
            }

            const landscapeBase64 = canvas.toDataURL('image/jpeg', 0.7);

            // Log para depuração
            console.log('Imagem ajustada para paisagem (base64):', landscapeBase64);

            resolve(landscapeBase64);
        };

        img.onerror = (error) => {
            console.error('Erro ao redimensionar e rotacionar a imagem:', error);
            resolve(base64Str); // Retorna a imagem original em caso de erro
        };
    });
};

/**
 * Rotaciona uma imagem no formato base64.
 * @param {string} imageDataUrl - URL da imagem em formato base64.
 * @param {number} rotation - Ângulo de rotação (em graus, ex: 90, 180, 270).
 * @returns {Promise<string>} - Retorna uma string base64 da imagem rotacionada.
 */
export const rotateImage = (imageDataUrl, rotation) => {
    return new Promise((resolve) => {
        let img = new Image();
        img.src = imageDataUrl;

        img.onload = () => {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');

            // Ajusta o tamanho do canvas baseado na rotação
            if (rotation === 90 || rotation === 270) {
                canvas.width = img.height;
                canvas.height = img.width;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }

            // Translada e rotaciona o canvas
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            const rotatedBase64 = canvas.toDataURL('image/jpeg', 1.0);

            // Log para depuração
            console.log('Imagem rotacionada (base64):', rotatedBase64);

            resolve(rotatedBase64);
        };

        img.onerror = (error) => {
            console.error('Erro ao rotacionar a imagem:', error);
            resolve(imageDataUrl); // Retorna a imagem original em caso de erro
        };
    });
};
