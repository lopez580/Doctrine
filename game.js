import { spriteEntity } from "./assets/sprites/spriteEntity.js";
import { spritePlayer } from "./assets/sprites/spritePlayer.js";
import { spriteNote } from "./assets/sprites/spriteNote.js";
import { spriteCb } from "./assets/sprites/spriteCb.js";
import { spriteEntity2 } from "./assets/sprites/spriteEntity2.js";
import { spriteMirorr } from "./assets/sprites/spriteMIrror.js";
import { wouldCollide, drawCollisionBoxes } from "./collisions.js";
import { gameProgress, resetProgress } from "./progress.js";
// IMPORTA EL SISTEMA DE INTERACCIONES
import { 
    getNearbyInteraction, 
    handleInteraction, 
    drawInteractionIndicators,
    drawInteractionZones,
    getInteractionState,  
    interactionZones
} from "./interactions.js";
// IMPORTA EL SISTEMA DE UI
import { openUI, closeUI, renderUI, uiState } from "./ui.js";


const inicioImage = new Image();
const bgImage = new Image();
const bedImage = new Image();
const tvImage = new Image();
const tableImage = new Image();
const tableLampImage = new Image();
const pantryImage = new Image();
const rugImage = new Image();
const wallcrossImage = new Image();
const portraitImage = new Image();
const staticsImage = new Image();



//para el escenario 2

const foliageImage = new Image();
const foxImage = new Image();
const rockImage = new Image();
const ruinsImage = new Image();
const cabinImage = new Image();
const tree1Image = new Image();
const tree2Image = new Image();
const wellImage = new Image();
const gateImage = new Image();
const invitationImage = new Image();
const michaelImage = new Image();

bgImage.src = "./assets/static/backgroundHab.png";
bedImage.src = "./assets/static/bed.png";
tvImage.src = "./assets/static/tv.png";
tableImage.src = "./assets/static/table.png";
tableLampImage.src = "./assets/static/tableLamp.png";
rugImage.src = "./assets/static/rug.png";
wallcrossImage.src = "./assets/static/wallcross.png";
pantryImage.src = "./assets/static/pantry.png";
portraitImage.src = "./assets/static/portrait.png";
staticsImage.src = "./assets/static/statics.png";
inicioImage.src = "./assets/static/inicio.png";

//para escenario 2
foliageImage.src = "./assets/static/foliage.png";
foxImage.src = "./assets/static/fox.png";
rockImage.src = "./assets/static/rock.png";
ruinsImage.src = "./assets/static/ruins.png";
cabinImage.src = "./assets/static/cabin.png";
tree1Image.src = "./assets/static/tree1.png";
tree2Image.src = "./assets/static/tree2.png";
wellImage.src = "./assets/static/well.png";
gateImage.src = "./assets/static/gate.png";
invitationImage.src = "./assets/static/invitation.png";
michaelImage.src = "./assets/static/michael.png";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d", { alpha: false });


let gameStarted = false;
// MODO DEBUG: activa esto para ver las cajas de colisión e interacciones
const DEBUG_MODE = false;

// Desactiva suavizado
ctx.imageSmoothingEnabled = false;

// Tamaño de cada bloque del sprite
const blockSize = 1;

// Calcula el tamaño de los sprites
const playerWidth = spritePlayer[0].length * blockSize;
const playerHeight = spritePlayer.length * blockSize;

const entityWidth = spriteEntity[0].length * blockSize;
const entityHeight = spriteEntity.length * blockSize;

const entity2Width = spriteEntity2[0].length * blockSize;
const entity2Height = spriteEntity2.length * blockSize;

const noteWidth= spriteNote[0].length * blockSize;
const noteHeight = spriteEntity.length * blockSize;

const cbWidth= spriteCb[0].length * blockSize;
const cbHeight = spriteEntity.length * blockSize;

const mirrorWidth= spriteCb[0].length * blockSize;
const mirrorHeight = spriteEntity.length * blockSize;

// Posición inicial(imagenes y sprites)
let playerX = 75, playerY = 115;
let entityX = 100, entityY = 80;
let entity2X = 150, entity2Y = 80;
let bedX = 24, bedY = 99;
let tvX = 133, tvY = 107;
let tableX=140, tableY=70;
let noteX=tableX-1, noteY=tableY+5;
let cbX=25,cbY=23;
let mirrorX=100,mirrorY=23;
let tableLampX=55, tableLampY=23;
let wallcrossX=80,wallcrossY=23;
let rugX=65,rugY=55;
let pantryX=137,pantryY=23;
let portraitX=118,portraitY=23;
let staticsX=145, staticsY=116;
let inicioX=0, inicioY=0;


let foliageX=100,foliageY=30;
let foxX=75,foxY=90;
let rockX=80,rockY=40;
let ruinsX=50,ruinsY=100;
let cabinX=133,cabinY=13;
let tree1X=25,tree1Y=50;
let tree2X=120,tree2Y=70;
let wellX=25,wellY=120;
let gateX=22,gateY=4;

//escenario 2

// Variables para entity2 (enemigo)
let entity1Active = false;
let entity1Speed = 0.25; 
let entity1SpawnDelay = 2000; // 2 segundos de delay
let entity1X = 25, entity1Y = 120;






let currentScene = "scene1";
let isGameEnding = false; 

// Control de carga(imagenes)
let imagesLoaded = 0;
let bedLoaded = false;
let bgLoaded = false;
let tvLoaded = false;
let tableLoaded = false;
let tableLampLoaded = false;
let wallcrossLoaded = false;
let pantryLoaded = false;
let rugLoaded = false;
let portraitLoaded = false;
let staticsLoaded = false;
let inicioLoaded=false;

//
let foliageLoaded = false;
let foxLoaded = false;
let rockLoaded = false;
let ruinsLoaded = false;
let cabinLoaded = false;
let tree1Loaded = false;
let tree2Loaded = false;
let wellLoaded = false;
let gateLoad= false;
let invitationLoaded=false;
let michaelLoaded = false;
//audio
const introAudio = new Audio("./assets/audio/intro.mp3");
const staticAudio = new Audio("./assets/audio/static.mp3");
const noteAudio = new Audio("./assets/audio/note.mp3");
const screamAudio = new Audio("./assets/audio/scream.mp3");
const persecutionAudio = new Audio("./assets/audio/persecution.mp3");
const killAudio = new Audio("./assets/audio/kill.mp3");
const forzarAudio = new Audio("./assets/audio/forzar.mp3");
const endAudio = new Audio("./assets/audio/end.mp3");


window.screamAudio = screamAudio;
window.persecutionAudio = persecutionAudio;
window.forzarAudio = forzarAudio;





function checkAllLoaded() {
    imagesLoaded++;
    if (imagesLoaded === 22) {
        showStartScreen();
    }
}

bgImage.onload = function() {
    console.log("Background cargado:", bgImage.width, "x", bgImage.height);
    bgLoaded = true;
    checkAllLoaded();
};

bedImage.onload = function() {
    console.log("Cama cargada:", bedImage.width, "x", bedImage.height);
    bedLoaded = true;
    checkAllLoaded();
};

tvImage.onload = function() {
    console.log("TV cargada:", tvImage.width, "x", tvImage.height);
    tvLoaded = true;
    checkAllLoaded();
};

tableImage.onload = function() {
    console.log("mesa cargada:", tableImage.width, "x", tableImage.height);
    tableLoaded = true;
    checkAllLoaded();
};

tableLampImage.onload = function() {
    console.log("lampara cargada:", tableLampImage.width, "x", tableLampImage.height);
    tableLampLoaded = true;
    checkAllLoaded();
};

rugImage.onload = function() {
    console.log("alfombra cargada:", rugImage.width, "x", rugImage.height);
    rugLoaded = true;
    checkAllLoaded();
};

wallcrossImage.onload = function() {
    console.log("cruz cargada:", wallcrossImage.width, "x", wallcrossImage.height);
    wallcrossLoaded = true;
    checkAllLoaded();
};

pantryImage.onload = function() {
    console.log("despensa cargada:", pantryImage.width, "x", pantryImage.height);
    pantryLoaded = true;
    checkAllLoaded();
};

portraitImage.onload = function() {
    console.log("retrato cargado:", portraitImage.width, "x", portraitImage.height);
    portraitLoaded = true;
    checkAllLoaded();
};

staticsImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    staticsLoaded = true;
    checkAllLoaded();
};
foliageImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    foliageLoaded = true;
    checkAllLoaded();
};
foxImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    foxLoaded = true;
    checkAllLoaded();
};
rockImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    rockLoaded = true;
    checkAllLoaded();
};
ruinsImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    ruinsLoaded = true;
    checkAllLoaded();
};
cabinImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    cabinLoaded = true;
    checkAllLoaded();
};
tree1Image.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    tree1Loaded = true;
    checkAllLoaded();
};
tree2Image.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    tree2Loaded = true;
    checkAllLoaded();
};
wellImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    wellLoaded = true;
    checkAllLoaded();
};

gateImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    gateLoad = true;
    checkAllLoaded();
};

inicioImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    inicioLoaded = true;
    checkAllLoaded();
};

invitationImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    invitationLoaded = true;
    checkAllLoaded();
};
michaelImage.onload = function() {
    console.log("estática cargada:", staticsImage.width, "x", staticsImage.height);
    michaelLoaded = true;
    checkAllLoaded();
};

// Pantalla de inicio
function showStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (inicioImage) {
        ctx.drawImage(inicioImage, 0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = "gray";
    ctx.font = "30px Courier New";
    ctx.fillText("DOCTRINE", 30, 80);
    ctx.font = "10px Courier New";
    ctx.fillText("Enter para empezar", 30, 100);
    
}

// Listener para iniciar el juego
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !gameStarted && imagesLoaded === 22) {
        gameStarted = true;
        introAudio.play();
        startGame();
    }
});

// Dibuja un sprite de matriz
function drawSprite(spriteMatrix, xPos, yPos, blockSize = 1) {
    for (let y = 0; y < spriteMatrix.length; y++) {
        for (let x = 0; x < spriteMatrix[y].length; x++) {
            const color = spriteMatrix[y][x];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(xPos + x * blockSize, yPos + y * blockSize, blockSize, blockSize);
            }
        }
    }
}

// Variable para evitar múltiples listeners
let moveListenerAdded = false;
let interactionListenerAdded = false;

// Inicia el juego
function startGame() {
    render();
    
    if (!moveListenerAdded) {
        document.addEventListener("keydown", movePlayer);
        moveListenerAdded = true;
    }

    if (!interactionListenerAdded) {
        document.addEventListener("keydown", handleInteractionInput);
        interactionListenerAdded = true;
    }
}

/**
 * Cambia al siguiente escenario x: 160, y: 115
 * @param {string} sceneName - Nombre del escenario
 * @param {string} entryPoint - Punto de entrada opcional ('default', 'fromDoor', etc.)
 */
function changeScene(sceneName, entryPoint = 'default') {
    console.log("Cambiando a escenario:", sceneName, "- Punto de entrada:", entryPoint);
    introAudio.pause();
     // Pausa cualquier audio
    if (!staticAudio.paused) {
        staticAudio.pause();
        staticAudio.currentTime = 0;
    }
    if (typeof persecutionAudio !== 'undefined') {
        persecutionAudio.currentTime = 0;
        persecutionAudio.play();
    }
    
    currentScene = sceneName;
    
    // Define las posiciones de entrada para cada escenario
    const spawnPoints = {
        scene1: {
            default: { x: 80, y: 50 },
            fromDoor: { x: 80, y: 100 },
            fromMirror: { x: 100, y: 30 }
        },
        scene2: {
            default: { x: 160, y: 115 },
            fromGate: { x: 30, y: 30 },
            fromCabin: { x: 140, y: 30 }
        }
    };
    
    // Aplica la posición según el escenario y punto de entrada
    if (spawnPoints[sceneName] && spawnPoints[sceneName][entryPoint]) {
        playerX = spawnPoints[sceneName][entryPoint].x;
        playerY = spawnPoints[sceneName][entryPoint].y;
    } else if (spawnPoints[sceneName] && spawnPoints[sceneName].default) {
        playerX = spawnPoints[sceneName].default.x;
        playerY = spawnPoints[sceneName].default.y;
    }
    
    // Si cambiamos a scene2, activar entity2 después de 2 segundos
    if (sceneName === "scene2") {
        entity1Active = false; // Desactiva primero
        entity1X = 30; // Posición cerca del pozo (esquina inferior izquierda)
        entity1Y = 115;
        
        // Activa entity2 después de 2 segundos
        setTimeout(() => {
            entity1Active = true;
            console.log("Entity1 activado - comenzando persecución");
        }, entity1SpawnDelay);
    } else {
        // Si no es scene2, desactiva entity2
        entity1Active = false;
    }
    
    console.log("Nueva posición del jugador:", playerX, playerY);
    
    render();
}

/**
 * Actualiza la posición de entity2 para perseguir al jugador
 */
function updateEntity1() {
    if (!entity1Active || currentScene !== "scene2") return;
    
    // Calcula la dirección hacia el jugador
    const dx = playerX - entity1X;
    const dy = playerY - entity1Y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
        // Normaliza y mueve hacia el jugador
        entity1X += (dx / distance) * entity1Speed;
        entity1Y += (dy / distance) * entity1Speed;
    }
    
    // Verifica si tocó al jugador
    if (checkCollisionWithPlayer()) {
        gameOver();
    }
}

/**
 * Detecta si entity2 colisionó con el jugador
 */
function checkCollisionWithPlayer() {
    if (!entity1Active) return false;
    
    const collisionDistance = 8; // Distancia de colisión (ajustable)
    const dx = playerX - entity1X;
    const dy = playerY - entity1Y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < collisionDistance;
}

/**
 * Game Over - El jugador fue atrapado
 */
function gameOver() {
    console.log("GAME OVER - Entity2 atrapó al jugador");
    entity1Active = false;
    isGameEnding = true; 
    
    // Pausa cualquier audio
    if (!staticAudio.paused) {
        staticAudio.pause();
        staticAudio.currentTime = 0;
    }
    if (!introAudio.paused) {
        introAudio.pause();
    }
    if (!persecutionAudio.paused) {  
        persecutionAudio.pause();
        persecutionAudio.currentTime = 0;
    }
    killAudio.play();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (michaelLoaded) {
        ctx.drawImage(michaelImage, 0, 0, canvas.width, canvas.height);
    }
    
    // Muestra el mensaje de game over
    openUI("dialogue", {
        message: "La doctrina te nombró en voz baja.\n\nY el bosque respondió con olvido.",
        hasMore: false
    });
    renderUI(ctx, canvas.width, canvas.height);
    
    // Después de 5 segundos, reinicia el juego
    setTimeout(() => {
        closeUI();
        isGameEnding = false;
        
        resetGame();
        introAudio.play();
    }, 5000);
    return;
}


/**
 * Reinicia el juego al estado inicial
 */
function resetGame() {
    console.log("Reiniciando juego...");
    
    // Reinicia variables
    gameStarted = false;
    isGameEnding = false;
    currentScene = "scene1";
    playerX = 75;
    playerY = 115;
    entity1Active = false;
    entity1X = 100;
    entity1Y = 80;
    
    // Reinicia audio
    introAudio.currentTime = 0;
    
    //  Reinicia el progreso del juego
    resetProgress();
    console.log("Progreso reseteado:", gameProgress);
    
    // Reinicia el estado de las interacciones en scene1
    const exitDoor = interactionZones.find(zone => zone.name === "exit_door" && zone.scene === "scene1");
    if (exitDoor) {
        exitDoor.locked = true;
        console.log("Puerta bloqueada de nuevo");
    }
    
    const note = interactionZones.find(zone => zone.name === "note" && zone.scene === "scene1");
    if (note) {
        note.hasBeenRead = false;
        console.log("Nota reiniciada");
    }
    
    const closet = interactionZones.find(zone => zone.name === "closet" && zone.scene === "scene1");
    if (closet) {
        closet.hasBeenOpened = false;
        console.log("Closet reiniciado");
    }
    
    const tv = interactionZones.find(zone => zone.name === "tv" && zone.scene === "scene1");
    if (tv) {
        tv.isOn = false;
        console.log("TV reiniciada");
    }
    
    // Muestra pantalla de inicio
    showStartScreen();
}



// Renderiza todo
function render() {
    if (isGameEnding) {
        console.log("Render bloqueado durante ending");
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (currentScene === "scene1") {
        // ESCENARIO 1: Habitación original
        
        // Fondo
        if (bgLoaded) {
            ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        }
        
        // Cama
        if (bedLoaded) {
            ctx.drawImage(bedImage, bedX, bedY, 48, 40);
        }

        // TV
        if (tvLoaded) {
            ctx.drawImage(tvImage, tvX, tvY, 35, 30);
        }

        // Estática (solo si TV está encendida)
        const tvState = getInteractionState("tv");
        if (staticsLoaded && tvState && tvState.isOn) {
            ctx.drawImage(staticsImage, staticsX, staticsY, 19, 15);
            if (staticAudio.paused) {
                staticAudio.play();
            }
        } else {
            if (!staticAudio.paused) {
                staticAudio.pause();
                staticAudio.currentTime = 0;
            }
        }
        
        // Mesa 
        if (tableLoaded) {
            ctx.drawImage(tableImage, tableX, tableY, 25, 20);
        }
        
        if (tableLampLoaded) {
            ctx.drawImage(tableLampImage, tableLampX, tableLampY, 20, 15);
        }
        
        if (rugLoaded) {
            ctx.drawImage(rugImage, rugX, rugY, 65, 60);
        }
        
        if(wallcrossLoaded){
            ctx.drawImage(wallcrossImage,wallcrossX,wallcrossY,10,8);
        }
        
        if (pantryLoaded) {
            ctx.drawImage(pantryImage, pantryX, pantryY, 30, 25);
        }
        
        if (portraitLoaded) {
            ctx.drawImage(portraitImage, portraitX, portraitY, 15, 10);
        }

        // Sprites
    
        drawSprite(spritePlayer, playerX, playerY, blockSize);
        drawSprite(spriteNote, noteX, noteY, blockSize);
        drawSprite(spriteCb, cbX, cbY, blockSize);
        drawSprite(spriteMirorr, mirrorX, mirrorY, blockSize);

        // Modo Debug - SOLO EN SCENE1
        if (DEBUG_MODE) {
            drawCollisionBoxes(ctx);
            drawInteractionZones(ctx, "scene1");  // ← Agrega "scene1"
        }

        // Indicadores de interacción - SOLO EN SCENE1
        if (!uiState.isOpen) {
            drawInteractionIndicators(ctx, playerX, playerY, playerWidth, playerHeight, "scene1");  // ← Agrega "scene1"
        }

        
       
        
    } else if (currentScene === "scene2") {
        // ESCENARIO 2: Fondo negro con límites
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // DIBUJA LOS BORDES BLANCOS
        ctx.strokeStyle = "#912001";
        ctx.lineWidth = 2;
        
        // Los mismos límites que en scene1
        const limiteIzq = 23;
        const limiteDer = 160;    
        const limiteArr = 23;
        const limiteAbajo = 120;
        
        // Borde superior
        ctx.beginPath();
        ctx.moveTo(limiteIzq, limiteArr);
        ctx.lineTo(limiteDer + playerWidth, limiteArr);
        ctx.stroke();
        
        // Borde inferior
        ctx.beginPath();
        ctx.moveTo(limiteIzq, limiteAbajo + playerHeight);
        ctx.lineTo(limiteDer + playerWidth, limiteAbajo + playerHeight);
        ctx.stroke();
        
        // Borde izquierdo
        ctx.beginPath();
        ctx.moveTo(limiteIzq, limiteArr);
        ctx.lineTo(limiteIzq, limiteAbajo + playerHeight);
        ctx.stroke();
        
        // Borde derecho
        ctx.beginPath();
        ctx.moveTo(limiteDer + playerWidth, limiteArr);
        ctx.lineTo(limiteDer + playerWidth, limiteAbajo + playerHeight);
        ctx.stroke();
        
        //fondos
        updateEntity1();

        if (foliageLoaded) {
            ctx.drawImage(foliageImage, foliageX, foliageY, 15, 10);
            ctx.drawImage(foliageImage, foliageX+10, foliageY+40, 15, 10);
            ctx.drawImage(foliageImage, foliageX+40, foliageY+25, 15, 10);
            ctx.drawImage(foliageImage, foliageX-60, foliageY+5, 15, 10);
            ctx.drawImage(foliageImage, foliageX-65, foliageY+70, 15, 10);
            ctx.drawImage(foliageImage, foliageX+40, foliageY+90, 15, 10);
            ctx.drawImage(foliageImage, foliageX-20, foliageY+20, 15, 10);
        }

        if (foxLoaded) {
            ctx.drawImage(foxImage, foxX, foxY, 15, 10);
        }

        if (rockLoaded) {
            ctx.drawImage(rockImage, rockX, rockY, 10, 5);
            ctx.drawImage(rockImage, rockX+10, rockY+80, 10, 5);
            ctx.drawImage(rockImage, rockX+50, rockY+90, 10, 5);
            ctx.drawImage(rockImage, rockX+50, rockY+20, 10, 5);
            ctx.drawImage(rockImage, rockX-50, rockY+50, 10, 5);
            ctx.drawImage(rockImage, rockX, rockY+40, 10, 5);
        }

        if (ruinsLoaded) {
            ctx.drawImage(ruinsImage, ruinsX, ruinsY, 30, 25);
        }
        if (cabinLoaded) {
            ctx.drawImage(cabinImage, cabinX, cabinY, 35, 30);
        }
        if (tree1Loaded) {
            ctx.drawImage(tree1Image, tree1X, tree1Y, 45, 40);
            ctx.drawImage(tree1Image, tree1X+55, tree1Y-40, 45, 40);
        }
        if (tree2Loaded) {
            ctx.drawImage(tree2Image, tree2X, tree2Y, 45, 40);
            ctx.drawImage(tree2Image, tree2X-45, tree2Y+27, 45, 40);
        }
        if (wellLoaded) {
            ctx.drawImage(wellImage, wellX, wellY, 20, 15);
        }
        if (gateLoad) {
            ctx.drawImage(gateImage, gateX, gateY, 25, 20);
        }
        // Jugador
        drawSprite(spritePlayer, playerX, playerY, blockSize);
        if (entity1Active) {
        drawSprite(spriteEntity, entity1X, entity1Y, blockSize);
        // Modo Debug - SCENE2
if (DEBUG_MODE) {
    drawInteractionZones(ctx, "scene2");
}

// Indicadores de interacción - SCENE2
if (!uiState.isOpen) {
    drawInteractionIndicators(ctx, playerX, playerY, playerWidth, playerHeight, "scene2");
}
    }

        
    }

    // UI: Se renderiza en TODOS los escenarios
    renderUI(ctx, canvas.width, canvas.height);
}

// Movimiento del jugador CON DETECCIÓN DE COLISIONES
function movePlayer(e) {
    // Si hay una UI abierta, no permitir movimiento
    if (uiState.isOpen) return;

    const step = 2;
    
    // Calcula la nueva posición según la tecla presionada
    let newX = playerX;
    let newY = playerY;
    
    switch (e.key) {
        case "ArrowUp": 
        case "w":
        case "W":
            newY -= step; 
            break;
        case "ArrowDown":
        case "s":
        case "S":
            newY += step; 
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            newX -= step; 
            break;
        case "ArrowRight":
        case "d":
        case "D":
            newX += step; 
            break;
        default: 
            return;
    }

    // Límites del mapa (IGUALES PARA TODOS LOS ESCENARIOS)
    const limiteIzq = 23;
    const limiteDer = 160;    
    const limiteArr = 23;
    const limiteAbajo = 120; 
    
    // Aplica límites del mapa
    if (newX < limiteIzq) newX = limiteIzq;
    if (newX > limiteDer) newX = limiteDer;
    if (newY < limiteArr) newY = limiteArr;
    if (newY > limiteAbajo) newY = limiteAbajo;

    //VERIFICA COLISIONES SOLO EN SCENE1 
    if (currentScene === "scene1") {
        // En scene1: Verifica colisiones con objetos
        if (!wouldCollide(newX, newY, playerWidth, playerHeight)) {
            playerX = newX;
            playerY = newY;
        }
        // Si hay colisión, NO actualiza la posición (se queda donde está)
    } else {
        
        playerX = newX;
        playerY = newY;
    }

    render();
}

// Maneja el input para interacciones (tecla E)

function handleInteractionInput(e) {
    if (e.key === "e" || e.key === "E") {
        console.log("=== TECLA E PRESIONADA ===");
        if (isGameEnding) {
            console.log("Input bloqueado durante ending");
            return;
        }
        
        if (uiState.isOpen) {
            console.log("Cerrando UI");
            closeUI();
            render();
            return;
        }

        const nearbyZone = getNearbyInteraction(playerX, playerY, playerWidth, playerHeight, 20, currentScene);
        
        console.log("Zona encontrada:", nearbyZone);
        
        if (nearbyZone) {
            handleInteraction(nearbyZone, (data) => {
                console.log("=== CALLBACK RECIBIDO ===");
                console.log("data completa:", data);
                if (data.type === "note") {
                noteAudio.currentTime = 0;
                noteAudio.play();
        }
                
                // Manejo especial para transporte
                if (data.type === "transport") {
                    console.log("Transportando a:", data.targetScene);
                    
                    
                    // Muestra mensaje primero
                    openUI("dialogue", {
                        message: data.message,
                        hasMore: false
                    });
                    
                    // Después de 2 segundos, cambia de escenario
                    setTimeout(() => {
                        closeUI();
                        
                        changeScene(data.targetScene);
                    }, 1500);
                    
                    render();
                    return;
                }

                if (data.type === "ending") {
                    console.log("ENDING - Juego terminado");
                    entity1Active = false;
                    isGameEnding = true; 
                    
                    if (!persecutionAudio.paused) {
                        persecutionAudio.pause();
                        persecutionAudio.currentTime = 0;
                    }
                    introAudio.currentTime=0;
                    endAudio.play();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if (invitationLoaded) {
                        ctx.drawImage(invitationImage, 0, 0, canvas.width, canvas.height);
                    }
                    
                    // Muestra el mensaje final
                    openUI("dialogue", {
                        message: data.message,
                        hasMore: false
                    });
                    renderUI(ctx, canvas.width, canvas.height);
                    
                    // Después de 8 segundos, vuelve a la pantalla principal
                    setTimeout(() => {
                        closeUI();
                        resetGame();
                        introAudio.play();
                    }, 8000);
                    
                    
                    return;
                }
                
                if (data.type === "cutscene") {
                    console.log("Procesando cutscene...");
                    
                    const spriteMap = {
                        "entity": spriteEntity,
                        "entity2": spriteEntity2,
                        "player": spritePlayer,
                        "note": spriteNote,
                        "cb": spriteCb,
                        "mirror": spriteMirorr
                    };
                    
                    data.spriteMatrix = spriteMap[data.spriteName];
                    
                    console.log("spriteMatrix asignado:", data.spriteMatrix);
                }
                
                console.log("Abriendo UI con:", data);
                openUI(data.type, data);
                render();
            });
        } else {
            console.log("No hay zona cercana");
        }
    }
}

// Game loop para actualizar entity2 continuamente
function gameLoop() {
    // Solo renderiza si NO estamos en ending
    if (!isGameEnding) {
        if (gameStarted && currentScene === "scene2" && entity1Active) {
            updateEntity1();
            render();
        }
    }
    requestAnimationFrame(gameLoop);
}

// Inicia el game loop
gameLoop();
