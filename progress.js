
// progress.js - Sistema de progreso del juego

export const gameProgress = {
    tvTurnedOn: false,
    noteRead: false,
    closetOpened: false
};

/**
 * Actualiza el progreso del juego
 * @param {string} action - Acción completada ('tv', 'note', 'closet')
 */
export function updateProgress(action) {
    switch(action) {
        case 'tv':
            gameProgress.tvTurnedOn = true;
            break;
        case 'note':
            gameProgress.noteRead = true;
            break;
        case 'closet':
            gameProgress.closetOpened = true;
            break;
    }
    
    console.log("Progreso actualizado:", gameProgress);
    checkAllTasksComplete();
}

/**
 * Verifica si todas las tareas están completadas
 * @returns {boolean}
 */
export function checkAllTasksComplete() {
    const allComplete = gameProgress.tvTurnedOn && 
                       gameProgress.noteRead && 
                       gameProgress.closetOpened;
    
    if (allComplete) {
        console.log("🎉 ¡TODAS LAS TAREAS COMPLETADAS! La salida está desbloqueada.");
    }
    
    return allComplete;
}

/**
 * Reinicia el progreso
 */
export function resetProgress() {
    gameProgress.tvTurnedOn = false;
    gameProgress.noteRead = false;
    gameProgress.closetOpened = false;
}