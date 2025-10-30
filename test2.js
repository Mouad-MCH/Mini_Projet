const prompt = require('prompt-sync')();

let taxis = [
    { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
    { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
    { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 }
];

let requests = [
    { reqId: 1, position: 10, duration: 3, time: 0 }
];

let waitingQueue = [];
let currentTime = 0;

function menu() {
    console.log("\n/// -------- Menu --------- ///");
    console.log("1 => Ajouter un taxi");
    console.log("2 => Ajouter une demande");
    console.log("3 => Afficher l'état actuel");
    console.log("4 => Avancer d'une minute");
    console.log("5 => Lancer la simulation complète");
    console.log("0 => Quitter");
}

// Function Add Taxi - CORRIGÉE
function addTaxi() {
    let position = +prompt('Position du taxi : ');
    let id = taxis.length + 1;
    
    taxis.push({
        id: id,
        position: position,
        available: true,
        timeRemaining: 0,
        totalRides: 0
    });
    
    console.log(`✓ Taxi ${id} ajouté à la position ${position}`);
}

// Function Add Request - CORRIGÉE
function addRequest() {
    let reqId = requests.length + 1;
    let position = +prompt("Position de la demande : ");
    let duration = +prompt("Durée du trajet : ");
    let time = +prompt("Heure d'arrivée de la demande : ");

    requests.push({
        reqId: reqId,
        position: position,
        duration: duration,
        time: time
    });
    
    console.log(`✓ Demande ${reqId} ajoutée - Position: ${position}, Durée: ${duration}, Heure: ${time}`);
}

// Fonction pour trouver le taxi le plus proche
function findClosestTaxi(requestPosition) {
    let availableTaxis = taxis.filter(taxi => taxi.available);
    
    if (availableTaxis.length === 0) {
        return null;
    }
    
    // Trouver le taxi avec la distance minimale
    let closestTaxi = availableTaxis[0];
    let minDistance = Math.abs(closestTaxi.position - requestPosition);
    
    for (let i = 1; i < availableTaxis.length; i++) {
        let distance = Math.abs(availableTaxis[i].position - requestPosition);
        if (distance < minDistance) {
            minDistance = distance;
            closestTaxi = availableTaxis[i];
        }
    }
    
    return { taxi: closestTaxi, distance: minDistance };
}

// Fonction pour assigner un taxi à une demande
function assignTaxiToRequest(taxi, request) {
    taxi.available = false;
    taxi.timeRemaining = request.duration;
    taxi.totalRides++;
    taxi.position = request.position; // Le taxi se déplace vers la position de la demande
    
    console.log(`Minute ${currentTime}: → Demande ${request.reqId} à la position ${request.position} → Taxi ${taxi.id} assigné (distance: ${Math.abs(taxi.position - request.position)})`);
}

// Fonction pour faire avancer le temps d'une minute
function advanceTime() {
    console.log(`\n--- Minute ${currentTime} ---`);
    
    // 1. Traiter les demandes qui arrivent à cette minute
    let currentRequests = requests.filter(req => req.time === currentTime);
    
    for (let request of currentRequests) {
        let result = findClosestTaxi(request.position);
        
        if (result) {
            assignTaxiToRequest(result.taxi, request);
        } else {
            waitingQueue.push(request);
            console.log(`Minute ${currentTime}: → Demande ${request.reqId} à la position ${request.position} → Tous les taxis occupés → Ajoutée à la file d'attente.`);
        }
    }
    
    // 2. Mettre à jour le temps restant des taxis occupés
    for (let taxi of taxis) {
        if (!taxi.available) {
            taxi.timeRemaining--;
            
            if (taxi.timeRemaining === 0) {
                taxi.available = true;
                console.log(`Minute ${currentTime}: → Taxi ${taxi.id} a terminé sa course.`);
                
                // 3. Prendre une demande de la file d'attente si disponible
                if (waitingQueue.length > 0) {
                    let nextRequest = waitingQueue.shift();
                    assignTaxiToRequest(taxi, nextRequest);
                }
            }
        }
    }
    
    currentTime++;
    displayCurrentState();
}

// Fonction pour afficher l'état actuel
function displayCurrentState() {
    console.log("\n=== État actuel ===");
    console.log("Taxis:");
    taxis.forEach(taxi => {
        let status = taxi.available ? "Disponible" : `Occupé (${taxi.timeRemaining} min restantes)`;
        console.log(`  Taxi ${taxi.id}: Position ${taxi.position}, ${status}, Courses: ${taxi.totalRides}`);
    });
    
    console.log(`File d'attente: ${waitingQueue.length} demande(s)`);
    waitingQueue.forEach(req => {
        console.log(`  - Demande ${req.reqId}: Position ${req.position}, Durée ${req.duration}`);
    });
}

// Fonction pour générer le rapport final
function generateFinalReport() {
    console.log("\n=== RAPPORT FINAL ===");
    let totalRides = 0;
    
    taxis.forEach(taxi => {
        console.log(`Taxi ${taxi.id}: ${taxi.totalRides} courses, position ${taxi.position}`);
        totalRides += taxi.totalRides;
    });
    
    console.log(`Total des courses: ${totalRides}`);
}

// Fonction pour lancer la simulation complète
function runFullSimulation() {
    console.log("\n=== LANCEMENT DE LA SIMULATION COMPLÈTE ===");
    
    // Trouver le temps maximum de simulation
    let maxTime = Math.max(...requests.map(req => req.time)) + 10; // +10 pour être sûr
    
    for (let time = 0; time <= maxTime; time++) {
        currentTime = time;
        advanceTime();
        
        // Vérifier si tout est terminé
        let allTaxisAvailable = taxis.every(taxi => taxi.available);
        let queueEmpty = waitingQueue.length === 0;
        
        if (allTaxisAvailable && queueEmpty && time > maxTime - 5) {
            console.log("\n✓ Toutes les courses sont terminées !");
            generateFinalReport();
            break;
        }
    }
}

// Menu principal - CORRIGÉ
function mainMenu() {
    let choice;
    
    do {
        menu();
        choice = +prompt("Choisissez une option : ");
        
        switch(choice) {
            case 1: 
                addTaxi();
                break;
            case 2: 
                addRequest();
                break;
            case 3: 
                displayCurrentState();
                break;
            case 4: 
                advanceTime();
                break;
            case 5: 
                runFullSimulation();
                break;
            case 0: 
                console.log("Au revoir !");
                break;
            default: 
                console.log("Option invalide !");
        }
    } while (choice !== 0);
}

// Démarrer le programme
mainMenu();