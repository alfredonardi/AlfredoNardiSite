// src/utils/generatePDFReport.js

import { jsPDF } from 'jspdf';
import logo from '../assets/logo.jpg'; // Ajuste conforme seu projeto

// Função auxiliar para obter dimensões da imagem a partir de um dataURL
function getImageDimensions(dataURL) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = dataURL;
    });
}

export async function generatePDFReport({ photos, boNumber, version, selectedGroup }) {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginLeft = 20;
    const marginRight = 20;
    const marginTop = 20;
    const marginBottom = 25;
    const headerHeight = 100;
    const footerHeight = 20;
    const spacingBetweenElements = 5;
    const spacingBetweenImageAndDescription = 12;
    const photosPerPage = 2;
    const lineHeight = 14;

    const contentHeight = pageHeight - marginTop - marginBottom - headerHeight - footerHeight - (photosPerPage - 1) * spacingBetweenElements;
    const maxBlockHeight = contentHeight / photosPerPage;
    const maxImageWidth = pageWidth - marginLeft - marginRight;
    const maxImageHeight = maxBlockHeight * 0.8;
    const maxDescriptionHeight = maxBlockHeight * 0.6;

    const addHeader = () => {
        doc.addImage(logo, 'JPEG', marginLeft, marginTop, 84, 112);
        const textXStart = marginLeft + 84 + 15;
        const textYStart = marginTop + 25;

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Secretaria da Segurança Pública', textXStart, textYStart);
        doc.setFontSize(16);
        doc.text('POLÍCIA CIVIL DO ESTADO DE SÃO PAULO', textXStart, textYStart + 16);
        doc.setFontSize(12);
        doc.text('Departamento Estadual de Homicídios e Proteção à Pessoa – DHPP', textXStart, textYStart + 31);
        doc.text('Divisão de Homicídios "Dr. FRANCISCO DE ASSIS CAMARGO MAGANO"', textXStart, textYStart + 46);
        doc.text('Grupo Especial de Atendimento a Local de Crime – GEACRIM', textXStart, textYStart + 61);
        doc.text(`${selectedGroup}`, textXStart, textYStart + 76);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Boletim de Ocorrência ${boNumber}/2025 ${version}`, textXStart + 160, textYStart + 92);
    };

    const addFooter = () => {
        doc.setFontSize(10);
        const footerText1 = 'Endereço: Rua Brigadeiro Tobias, 527 – Centro – São Paulo/SP – CEP 01032-001';
        const footerText2 = 'Telefone: (11) 3311-3980   |   Email: dhpp.dh@policiacivil.sp.gov.br';
        doc.text(footerText1, pageWidth / 2, pageHeight - marginBottom, { align: 'center' });
        doc.text(footerText2, pageWidth / 2, pageHeight - marginBottom + 15, { align: 'center' });
    };

    const addTitle = () => {
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        const titleY = marginTop + headerHeight + spacingBetweenElements + 50;
        doc.text('Relatório Fotográfico', pageWidth / 2, titleY, { align: 'center' });
        return titleY + 30;
    };

    // Transformar em função assíncrona para aguardar as dimensões da imagem
    const addPhotoBlock = async (photo, currentY) => {
        const imageDataUrl = photo.photo;
        if (!imageDataUrl) {
            console.error('Foto sem dataURL:', photo);
            return currentY;
        }
        // Detecta o formato (PNG ou JPEG) a partir do dataURL
        let format = 'JPEG';
        if (imageDataUrl.includes('data:image/png')) {
            format = 'PNG';
        } else if (imageDataUrl.includes('data:image/jpeg') || imageDataUrl.includes('data:image/jpg')) {
            format = 'JPEG';
        } else {
            console.warn('Formato de imagem não suportado, usando JPEG como padrão.');
            format = 'JPEG';
        }

        // Obtém dimensões reais da imagem
        let imgWidth, imgHeight;
        try {
            ({ width: imgWidth, height: imgHeight } = await getImageDimensions(imageDataUrl));
        } catch (error) {
            console.error('Erro ao carregar a imagem:', error);
            return currentY;
        }

        // Calcula escala para caber na área máxima
        const scale = Math.min(maxImageWidth / imgWidth, maxImageHeight / imgHeight, 1);
        const scaledWidth = imgWidth * scale;
        const scaledHeight = imgHeight * scale;

        const x = (pageWidth - scaledWidth) / 2;
        const y = currentY;

        doc.addImage(imageDataUrl, format, x, y, scaledWidth, scaledHeight);

        let newY = y + scaledHeight + spacingBetweenImageAndDescription;

        if (photo.description) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');

            const textLines = doc.splitTextToSize(photo.description, maxImageWidth);
            const requiredHeight = textLines.length * lineHeight;

            if (requiredHeight > maxDescriptionHeight) {
                const maxLines = Math.floor(maxDescriptionHeight / lineHeight);
                const truncatedText = textLines.slice(0, maxLines - 1).join(' ') + '...';
                doc.text(truncatedText, pageWidth / 2, newY, { align: 'center' });
                newY += (maxLines * lineHeight) + spacingBetweenElements;
            } else {
                doc.text(textLines, pageWidth / 2, newY, { align: 'center' });
                newY += requiredHeight + spacingBetweenElements;
            }
        } else {
            newY += spacingBetweenElements;
        }

        return newY;
    };

    const startNewPage = () => {
        doc.addPage();
        addHeader();
        return addTitle();
    };

    addHeader();
    let currentY = addTitle();

    const sortedPhotos = photos.slice().sort((a, b) => a.id.localeCompare(b.id));

    // O loop principal agora deve aguardar cada addPhotoBlock
    for (let i = 0; i < sortedPhotos.length; i += photosPerPage) {
        for (let j = i; j < i + photosPerPage && j < sortedPhotos.length; j++) {
            const photo = sortedPhotos[j];
            currentY = await addPhotoBlock(photo, currentY);
        }

        addFooter();

        if (i + photosPerPage < sortedPhotos.length) {
            currentY = startNewPage();
        }
    }

    doc.save('relatório-fotográfico.pdf');
}
