// collision.js - Sistema de colisiones para objetos del juego

/**
 * Define las áreas de colisión (hitboxes) para cada objeto del juego
 * Cada objeto tiene:
 * - x, y: posición
 * - width, height: dimensiones del área de colisión
 * - name: identificador (opcional, para debug)
 */

export const collisionBoxes = [
    // Cama
    {
        x: 24,
        y: 105,
        width: 48,
        height: 35,
        name: "bed"
    },
    // TV
    {
        x: 140,
        y: 115,
        width: 30,
        height: 25,
        name: "tv"
    },
    // Mesa
    {
        x: 143,
        y: 70,
        width: 25,
        height: 20,
        name: "table"
    },
    // Lámpara de mesa
    {
        x: 55,
        y: 23,
        width: 20,
        height: 15,
        name: "tableLamp"
    },
    // Cruz de pared (si quieres que bloquee)
    {
        x: 80,
        y: 23,
        width: 10,
        height: 8,
        name: "wallcross"
    },
    
    // Despensa
    {
        x: 137,
        y: 23,
        width: 30,
        height: 25,
        name: "pantry"
    },
    // Retrato
    {
        x: 118,
        y: 23,
        width: 15,
        height: 10,
        name: "portrait"
    },

    // closet
    {
        x: 25,
        y: 23,
        width: 15,
        height: 15,
        name: "closet"
    }
];

/**
 * Verifica si hay colisión entre dos rectángulos
 * @param {Object} rect1 - Primer rectángulo {x, y, width, height}
 * @param {Object} rect2 - Segundo rectángulo {x, y, width, height}
 * @returns {boolean} - true si hay colisión
 */
export function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

/**
 * Verifica si el jugador colisionaría con algún objeto en una nueva posición
 * @param {number} newX - Nueva posición X del jugador
 * @param {number} newY - Nueva posición Y del jugador
 * @param {number} playerWidth - Ancho del sprite del jugador
 * @param {number} playerHeight - Alto del sprite del jugador
 * @returns {boolean} - true si HAY colisión (no puede moverse)
 */
export function wouldCollide(newX, newY, playerWidth, playerHeight) {
    const playerRect = {
        x: newX,
        y: newY,
        width: playerWidth,
        height: playerHeight
    };

    // Verifica contra todas las cajas de colisión
    for (let box of collisionBoxes) {
        if (checkCollision(playerRect, box)) {
            return true; // Hay colisión
        }
    }

    return false; // No hay colisión
}

/**
 * Obtiene el nombre del objeto con el que colisionó (útil para interacciones)
 * @param {number} x - Posición X del jugador
 * @param {number} y - Posición Y del jugador
 * @param {number} playerWidth - Ancho del sprite del jugador
 * @param {number} playerHeight - Alto del sprite del jugador
 * @returns {string|null} - Nombre del objeto o null si no hay colisión
 */
export function getCollidingObject(x, y, playerWidth, playerHeight) {
    const playerRect = {
        x: x,
        y: y,
        width: playerWidth,
        height: playerHeight
    };

    for (let box of collisionBoxes) {
        if (checkCollision(playerRect, box)) {
            return box.name;
        }
    }

    return null;
}

/**
 * Modo debug: dibuja las cajas de colisión en el canvas
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 */
export function drawCollisionBoxes(ctx) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    
    collisionBoxes.forEach(box => {
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        
        // Opcionalmente, dibuja el nombre
        ctx.fillStyle = "red";
        ctx.font = "6px Arial";
        ctx.fillText(box.name, box.x, box.y - 2);
    });
}