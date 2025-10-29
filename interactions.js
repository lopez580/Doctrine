// interactions.js - 
import { updateProgress, checkAllTasksComplete } from "./progress.js";

// Zonas de interacción para SCENE1
export const interactionZones = [
    {
        scene: "scene1",
        x: 135,
        y: 68,
        width: 30,
        height: 25,
        name: "note",
        type: "readable",
        title: "Nota Misteriosa",
        content: [
            "No puedes confiar en nadie...",
            "",
            "Ellos están observando.",
            "Siempre observando.",
            "",
            "- ???"
        ],
        hasBeenRead: false
    },
    
    {
        scene: "scene1",
        x: 133,
        y: 107,
        width: 35,
        height: 30,
        name: "tv",
        type: "toggleable",
        isOn: false,
        onMessage: "La TV se encendió. Muestra estática...",
        offMessage: "Apagaste la TV."
    },

    // ARMARIO - VERIFICADO
    {
        scene: "scene1",
        x: 22,
        y: 23,
        width: 20,
        height: 20,
        name: "closet",
        type: "cutscene",
        message: "Dentro del armario encuentras algo extraño...",
        spriteName: "entity2",
        hasBeenOpened: false
    },
    {
        scene: "scene1",
        x: 15,           // Muy a la izquierda
        y: 50,           // Centro vertical aproximadamente
        width: 10,       // Ancho pequeño (como una puerta)
        height: 45,      // Alto para cubrir área de paso
        name: "exit_door",
        type: "transport",
        targetScene: "scene2",  // Nombre del siguiente escenario
        locked: true,           // Inicialmente bloqueada
        lockedMessage: "La puerta está bloqueada. Parece que falta algo...",
        unlockedMessage: "La puerta se abre..."
    }
];

// Zonas de interacción para SCENE2
export const interactionZonesScene2 = [
    {
        x: 22,
        y: 10,
        width: 25,
        height: 35,
        name: "gate",
        type: "ending",
        message: "La doctrina guardó silencio.\n\nY cruzaste antes de que cambiara de idea."
    }
];

export function getNearbyInteraction(playerX, playerY, playerWidth, playerHeight, interactionRange = 20, currentScene = "scene1") {
    const playerCenterX = playerX + playerWidth / 2;
    const playerCenterY = playerY + playerHeight / 2;

    // Elige las zonas según el escenario
    const zones = currentScene === "scene2" ? interactionZonesScene2 : interactionZones;

    for (let zone of zones) {
        const zoneCenterX = zone.x + zone.width / 2;
        const zoneCenterY = zone.y + zone.height / 2;

        const distance = Math.sqrt(
            Math.pow(playerCenterX - zoneCenterX, 2) + 
            Math.pow(playerCenterY - zoneCenterY, 2)
        );

        if (distance <= interactionRange) {
            return zone;
        }
    }

    return null;
}

export function updateExitDoor() {
    const exitDoor = interactionZones.find(zone => zone.name === "exit_door");
    
    if (exitDoor) {
        const allComplete = checkAllTasksComplete();
        exitDoor.locked = !allComplete;  // Desbloquea si todo está completo
        
        if (!exitDoor.locked) {
            console.log("🚪 ¡Puerta desbloqueada!");
        }
    }
}

export function handleInteraction(zone, callback) {
    if (!zone) return;

    console.log("handleInteraction llamado con zona:", zone);
    console.log("Tipo de zona:", zone.type);

    switch (zone.type) {
        case "readable":
            if (callback) {
                callback({
                    type: "note",
                    title: zone.title,
                    content: zone.content,
                    zone: zone
                });
            }
            if (!zone.hasBeenRead) {  // Solo actualiza si es la primera vez
                zone.hasBeenRead = true;
                updateProgress('note');
                updateExitDoor();  // ← ACTUALIZA PUERTA
            }
            break;

        case "toggleable":
            zone.isOn = !zone.isOn;
            
            if (callback) {
                const message = zone.isOn ? zone.onMessage : zone.offMessage;
                callback({
                    type: "dialogue",
                    message: message,
                    hasMore: false,
                    zone: zone
                });
            }
            
            // Solo actualiza progreso si se ENCENDIÓ por primera vez
            if (zone.isOn && zone.name === "tv") {
                updateProgress('tv');
                updateExitDoor();  // ← ACTUALIZA PUERTA
            }
            break;

        case "dialogue":
            if (callback && zone.messages) {
                const message = zone.messages[zone.currentMessage];
                callback({
                    type: "dialogue",
                    message: message,
                    hasMore: zone.currentMessage < zone.messages.length - 1,
                    zone: zone
                });
                
                zone.currentMessage = (zone.currentMessage + 1) % zone.messages.length;
            }
            break;

        case "item":
            if (callback) {
                callback({
                    type: "item",
                    itemName: zone.itemName,
                    zone: zone
                });
            }
            break;

        case "cutscene":
            console.log("=== CASO CUTSCENE ===");
            console.log("zone.message:", zone.message);
            console.log("zone.spriteName:", zone.spriteName);
            if (typeof screamAudio !== 'undefined') {
            window.screamAudio.currentTime = 0;
            window.screamAudio.play();
    }
            
            if (callback) {
                const dataToSend = {
                    type: "cutscene",
                    message: zone.message,
                    spriteName: zone.spriteName,
                    zone: zone
                };
                
                console.log("Enviando data al callback:", dataToSend);
                callback(dataToSend);
            }
            
            if (!zone.hasBeenOpened) {  // Solo actualiza si es la primera vez
                zone.hasBeenOpened = true;
                updateProgress('closet');
                updateExitDoor();  // ← ACTUALIZA PUERTA
            }
            break;

        case "transport":
            console.log("=== TRANSPORTE ===");
            console.log("Puerta bloqueada?", zone.locked);
            
            // Verifica el estado actual
            updateExitDoor();  // ← VERIFICA ANTES DE INTENTAR ABRIR
            
            if (zone.locked) {
                // Puerta bloqueada
                if (typeof window.forzarAudio !== 'undefined') {
                    window.forzarAudio.currentTime = 0;
                    window.forzarAudio.play();
        }
                if (callback) {
                    callback({
                        type: "dialogue",
                        message: zone.lockedMessage,
                        hasMore: false,
                        zone: zone
                    });
                }
            } else {
                // Puerta desbloqueada - transportar
                if (callback) {
                    callback({
                        type: "transport",
                        message: zone.unlockedMessage,
                        targetScene: zone.targetScene,
                        zone: zone
                    });
                }
            }
            break;

        case "ending":
            console.log("=== ENDING ===");
            
            if (callback) {
                callback({
                    type: "ending",
                    message: zone.message,
                    zone: zone
                });
            }
            break;

        default:
            console.log("Tipo de interacción desconocido:", zone.type);
    }
}

export function drawInteractionIndicators(ctx, playerX, playerY, playerWidth, playerHeight, currentScene = "scene1") {
    const nearby = getNearbyInteraction(playerX, playerY, playerWidth, playerHeight, 20, currentScene);
    
    if (nearby) {
        ctx.save();
        
        const indicatorX = nearby.x + nearby.width / 2;
        const indicatorY = nearby.y - 8;
        
        // Color diferente si es la puerta desbloqueada
        if (nearby.type === "transport" && !nearby.locked) {
            ctx.fillStyle = "#00ff00";  // Verde si está desbloqueada
        } else if (nearby.type === "transport" && nearby.locked) {
            ctx.fillStyle = "#ff0000";  // Rojo si está bloqueada
        } else {
            ctx.fillStyle = "white";    // Blanco para otros objetos
        }
        
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.font = "8px Arial";
        ctx.textAlign = "center";
        
        const text = "[E]";
        ctx.strokeText(text, indicatorX, indicatorY);
        ctx.fillText(text, indicatorX, indicatorY);
        
        ctx.restore();
    }
}

export function getInteractionState(name) {
    return interactionZones.find(zone => zone.name === name) || null;
}

export function drawInteractionZones(ctx, currentScene = "scene1") {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(0, 0, 255, 0.1)";
    
    const zones = currentScene === "scene2" ? interactionZonesScene2 : interactionZones;
    
    zones.forEach(zone => {
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        
        ctx.fillStyle = "blue";
        ctx.font = "6px Arial";
        ctx.fillText(zone.name, zone.x, zone.y - 2);
    });
}