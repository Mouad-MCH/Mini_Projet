const prompt = require('prompt-sync')();

let taxis = [
    { id: 1, position: 5, available: true, timeRemaining: 0, totalRides: 0 },
    { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
    { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 }
];
let requests = [
    { reqId: 1, position: 10, duration: 3, time: 0 }
];

let  waitingQueue = [];
let currentTime = 0;


function menu() {
    console.log("/// --------Menu--------- ///// ");
    console.log("1 => Ajoute un taxi");
    console.log("2 => Ajoute un demande");
    console.log("3 => Avancer d'une minute")
    console.log("4 => Afficher l'état actuel")
    console.log("5 => lancer la simulation complète")
    console.log("0 => Quitter");
}

// Function Add Taxis

function addTaxi() {
    let position = +prompt('add position :');
    let available = true;
    let timeRemaining = 0;
    let totalRides = 0;
    let id = taxis.length + 1;

    taxis.push({id,position,available,timeRemaining,totalRides})
}

// Function Add Request

function addRequests() {

    let reqId = requests.length + 1;
    // let reqId = 0;
    let position = +prompt("add your position: ");
    let duration = +prompt("add duration: ");
    let time = +prompt("Heure d'arrivée de la demande : ");

    // for(let i =0; i<requests.length; i++) {
    //     requests[i].time++;
    //     // requests[i].reqId++;
    // }

    requests.push({reqId, position, duration, time})
    console.log(`✓ Demande ${reqId} ajoutée - Position: ${position}, Durée: ${duration}, Heure: ${time}`);
    afficheMenu()
}

// Fonction pour trouver le taxi le plus proche


function TaxiPlusProche(n) {
    let availableTaxis = taxis.filter((el) => el.available);

    if(taxis.length === 0) {
        return null;
    }

    // find min destance
    let min = Infinity;
    let dis;
    let index = availableTaxis[0];

    for(let j = 0; j<availableTaxis.length; j++) {
        dis = Math.abs(n - availableTaxis[j].position);
        if(dis<min) {
            min = dis;
            index = availableTaxis[j];
        }
        // console.log(`nomber ${min} index => ${index}`)
        
    }
    
    return {taxi: index, Distance: min};

}

// Fonction pour assigner un taxi à une demande

function assignerTaxi(taxi, request) {
    taxi.available = false;
    taxi.timeRemaining = request.duration;
    taxi.totalRides++;
    console.log(`Minute ${currentTime}: → Demande ${request.reqId} à la position ${request.position} → Taxi ${taxi.id} assigné (distance: ${Math.abs(request.position - taxi.position)})`);
    taxi.position = request.position;

}

// Fonction pour faire avancer le temps d'une minute

function advanceTime() {
    console.log(`\n--- Minute ${currentTime} ---`);

    let currentRequests = requests.filter(el => el.time === currentTime);

    for(let request of currentRequests) {
        let result = TaxiPlusProche(request.position);
        
        if(result) {
            assignerTaxi(result.taxi, request)
        }else {
            waitingQueue.push(request)
            console.log(`Minute ${currentTime}: → Demande ${request.reqId} à la position ${request.position} → Tous les taxis occupés → Ajoutée à la file d'attente.`);
        }
    }


    for(let taxi of taxis) {
        if(!taxi.available) {
            taxi.timeRemaining--
            if(taxi.timeRemaining == 0) {
                taxi.available = true;
                console.log(`Minute ${currentTime}: → Taxi ${taxi.id} a terminé sa course.`);

                if(waitingQueue.length > 0) {
                    let nextRequest = waitingQueue.shift();
                    assignerTaxi(taxi,nextRequest)
                }
            }
        }
    }

    currentTime++;
    display()
}

// function display 

function display() {
    console.log("Taxis:");
    taxis.forEach(taxi => {
        let status = taxi.available ? "Disponible" : `occupé est (${taxi.timeRemaining}) min restantes`;
        console.log(`  Taxi ${taxi.id}: Position ${taxi.position}, ${status}, Courses: ${taxi.totalRides}`);
    })

    console.log(`File d'attente: ${waitingQueue.length} demande(s)`);
    waitingQueue.forEach(req => {
        console.log(`  - Demande ${req.reqId}: Position ${req.position}, Durée ${req.duration}`);
    });
}


// Fonction pour générer le rapport finalµ

function rapport() {
    console.log("--- Final Report ---")
    let TotaleRides = 0;

    for(let taxi of taxis) {
        console.log(`Taxi ${taxi.id}: ${taxi.totalRides} rides, position ${taxi.position}`)
        TotaleRides += taxi.totalRides;
    }

    console.log(`Total des courses: ${TotaleRides}`);  
}

// Fonction pour lancer la simulation complète


function runSimulation() {
    let maxTime = Math.max(...requests.map(el => el.time)) + 10;

    for(let time = 0; time<= maxTime; time++) {
        currentTime = time;
        advanceTime()
        // verefi tout les element termine
        let allAvailable = taxis.every(el => el.available);
        let empty = waitingQueue.length === 0;
        if(allAvailable && empty && time > maxTime-5) {
            console.log("\n✓ Toutes les courses sont terminées !");
            rapport();
            break;
        }
    }
    
}


/* -----Affichage  -------*/
function afficheMenu() {
    let chos;
    do {
    menu()
    chos = +prompt("choizer un nombre: ")
    switch(chos) {
        case 1 : addTaxi() 
        break;
        case 2: addRequests()
        break;
        case 3: advanceTime()
        break;
        case 4: display()
        break;
        case 5: runSimulation()
        break;
        case 0 :console.log("Au revoir !")
        break;
        default: console.log('! option note valide');
    }    
    }while(chos !== 0)

}

afficheMenu()