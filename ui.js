// ui.js - Sistema de UI para mostrar notas, diálogos, etc.
// Versión con textos más nítidos

/**
 * Estado de la UI
 */
export const uiState = {
    isOpen: false,
    currentType: null,
    currentData: null
};

/**
 * Muestra una nota en pantalla
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {number} canvasWidth - Ancho del canvas
 * @param {number} canvasHeight - Alto del canvas
 * @param {Object} data - Datos de la nota {title, content}
 */
export function renderNote(ctx, canvasWidth, canvasHeight, data) {
    const padding = 15;
    const noteWidth = canvasWidth - (padding * 2);
    const noteHeight = canvasHeight - (padding * 2);
    const noteX = padding;
    const noteY = padding;

    // Guarda el estado actual
    ctx.save();
    
    // Habilita suavizado SOLO para el texto
    ctx.imageSmoothingEnabled = true;

    // Fondo semi-transparente (overlay)
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Caja de la nota (estilo papel viejo)
    ctx.fillStyle = "#f4e8d0";
    ctx.fillRect(noteX, noteY, noteWidth, noteHeight);

    // Borde de la nota
    ctx.strokeStyle = "#8b7355";
    ctx.lineWidth = 2;
    ctx.strokeRect(noteX, noteY, noteWidth, noteHeight);

    // Título de la nota
    ctx.fillStyle = "#2c1810";
    ctx.font = "bold 12px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(data.title, canvasWidth / 2, noteY + 12);

    // Línea debajo del título
    ctx.strokeStyle = "#8b7355";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(noteX + 10, noteY + 28);
    ctx.lineTo(noteX + noteWidth - 10, noteY + 28);
    ctx.stroke();

    // Contenido de la nota
    ctx.font = "10px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.fillStyle = "#2c1810";

    let lineY = noteY + 38;
    const lineHeight = 14;

    if (Array.isArray(data.content)) {
        data.content.forEach(line => {
            // Si la línea está vacía, solo agrega espacio
            if (line.trim() === "") {
                lineY += lineHeight * 0.5;
            } else {
                ctx.fillText(line, noteX + 10, lineY);
                lineY += lineHeight;
            }
        });
    } else {
        ctx.fillText(data.content, noteX + 10, lineY);
    }

    // Instrucción para cerrar
    ctx.font = "9px 'Courier New', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "#666";
    ctx.fillText("[E] para cerrar", canvasWidth / 2, noteY + noteHeight - 12);
    
    // Restaura el estado (desactiva suavizado para sprites)
    ctx.restore();
}

/**
 * Muestra un diálogo en pantalla
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {number} canvasWidth - Ancho del canvas
 * @param {number} canvasHeight - Alto del canvas
 * @param {Object} data - Datos del diálogo {message, hasMore}
 */
export function renderDialogue(ctx, canvasWidth, canvasHeight, data) {
    const boxHeight = 60;  // ← AUMENTADO de 35 a 60
    const boxY = canvasHeight - boxHeight - 5;
    const padding = 8;

    // Guarda el estado actual
    ctx.save();
    
    // Habilita suavizado SOLO para el texto
    ctx.imageSmoothingEnabled = true;

    // Caja de diálogo
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, boxY, canvasWidth, boxHeight);

    // Borde
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(2, boxY + 2, canvasWidth - 4, boxHeight - 4);

    // Texto del mensaje
    ctx.fillStyle = "white";
    ctx.font = "9px 'Courier New', monospace";  // ← Reducido de 10px a 9px
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    // Maneja saltos de línea explícitos (\n)
    const paragraphs = data.message.split('\n');
    let y = boxY + padding + 2;
    const lineHeight = 11;  // ← Ajustado
    const maxWidth = canvasWidth - (padding * 4);

    paragraphs.forEach(paragraph => {
        if (paragraph.trim() === '') {
            // Línea vacía = espacio extra
            y += lineHeight * 0.5;
            return;
        }

        const words = paragraph.split(' ');
        let line = '';

        for (let word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line.trim(), padding * 2, y);
                line = word + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        
        if (line.trim() !== '') {
            ctx.fillText(line.trim(), padding * 2, y);
            y += lineHeight;
        }
    });

    // Indicador de "continuar" o "cerrar"
    ctx.font = "8px 'Courier New', monospace";
    ctx.textAlign = "right";
    ctx.fillStyle = "#ccc";
    const indicator = data.hasMore ? "[E] continuar >" : "[E] cerrar";
    ctx.fillText(indicator, canvasWidth - padding * 2, boxY + boxHeight - padding - 4);
    
    // Restaura el estado
    ctx.restore();
}
/**
 * Abre la UI con datos específicos
 * @param {string} type - Tipo de UI (note, dialogue, etc.)
 * @param {Object} data - Datos a mostrar
 */
export function openUI(type, data) {
    uiState.isOpen = true;
    uiState.currentType = type;
    uiState.currentData = data;
}

/**
 * Cierra la UI
 */
export function closeUI() {
    uiState.isOpen = false;
    uiState.currentType = null;
    uiState.currentData = null;
}

export function renderCutscene(ctx, canvasWidth, canvasHeight, data) {
    // Validación de datos
    if (!data) {
        console.error("renderCutscene: data es undefined");
        return;
    }
    
    console.log("renderCutscene llamado con data:", data);
    
    // Fondo semi-transparente oscuro
    ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Guarda el estado
    ctx.save();
    ctx.imageSmoothingEnabled = true;

    // Dibuja el sprite en el centro (si existe)
    if (data.spriteMatrix && Array.isArray(data.spriteMatrix)) {
        console.log("Dibujando sprite...");
        const blockSize = 3; // Escala el sprite más grande
        const spriteWidth = data.spriteMatrix[0].length * blockSize;
        const spriteHeight = data.spriteMatrix.length * blockSize;
        const spriteX = (canvasWidth - spriteWidth) / 2;
        const spriteY = 30; // Posición en la parte superior

        // Dibuja el sprite pixel por pixel
        for (let y = 0; y < data.spriteMatrix.length; y++) {
            for (let x = 0; x < data.spriteMatrix[y].length; x++) {
                const color = data.spriteMatrix[y][x];
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        spriteX + x * blockSize, 
                        spriteY + y * blockSize, 
                        blockSize, 
                        blockSize
                    );
                }
            }
        }
    } else {
        console.warn("No hay spriteMatrix válido");
    }

    // Caja de diálogo en la parte inferior
    const boxHeight = 40;
    const boxY = canvasHeight - boxHeight - 10;
    const padding = 10;

    // Caja de diálogo
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(padding, boxY, canvasWidth - (padding * 2), boxHeight);

    // Borde
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(padding + 1, boxY + 1, canvasWidth - (padding * 2) - 2, boxHeight - 2);

    // Texto del mensaje
    ctx.fillStyle = "white";
    ctx.font = "10px 'Courier New', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    
    // VALIDACIÓN: Asegúrate de que message existe
    const message = data.message || "...";
    console.log("Mensaje a mostrar:", message);
    
    // Divide el texto en líneas si es muy largo
    const maxWidth = canvasWidth - (padding * 4);
    const words = message.split(' ');
    let line = '';
    let y = boxY + padding;
    const lineHeight = 12;

    for (let word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line.trim(), padding * 2, y);
            line = word + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line.trim(), padding * 2, y);

    // Indicador de cerrar
    ctx.font = "8px 'Courier New', monospace";
    ctx.textAlign = "right";
    ctx.fillStyle = "#ccc";
    ctx.fillText("[E] cerrar", canvasWidth - padding * 2, boxY + boxHeight - padding);
    
    // Restaura el estado
    ctx.restore();
}

/**
 * Renderiza la UI actual si está abierta
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {number} canvasWidth - Ancho del canvas
 * @param {number} canvasHeight - Alto del canvas
 */
export function renderUI(ctx, canvasWidth, canvasHeight) {
    if (!uiState.isOpen) return;

    switch (uiState.currentType) {
        case "note":
            renderNote(ctx, canvasWidth, canvasHeight, uiState.currentData);
            break;
        case "dialogue":
            renderDialogue(ctx, canvasWidth, canvasHeight, uiState.currentData);
            break;
        case "cutscene":
            renderCutscene(ctx,canvasWidth,canvasHeight,uiState.currentData); 
            break;   
        default:
            console.log("Tipo de UI desconocido:", uiState.currentType);
    }
}