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
    console.log("/// --------Menu--------- /////");
    console.log("1 => Ajoute un taxi");
    console.log("2 => Ajoute un demande");
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
    let time = 0;

    for(let i =0; i<requests.length; i++) {
        requests[i].time++;
        // requests[i].reqId++;
    }

    requests.push({reqId, position, duration, time})
    console.log(`✓ Demande ${reqId} ajoutée - Position: ${position}, Durée: ${duration}, Heure: ${time}`);
    afficheMenu()
}

// Fonction pour trouver le taxi le plus proche


function TaxiPlusProche(n) {
    let availableTaxis = taxis.filter((el) => el.available);

    if(taxis.length == 0 || availableTaxis) {
        return null;
    }

    // find min destance
    let min = n;
    let dis;
    let index;

    for(let j = 0; j<availableTaxis.length; j++) {
        dis = Math.abs(n - availableTaxis[j].position);
        if(dis<min) {
            min = dis;
            index = j;
        }
        // console.log(`nomber ${min} index => ${index}`)
        
    }
    
    return {taxi: availableTaxis[index], Distance: min};

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

}


// Fonction pour générer le rapport finalµ

// Fonction pour lancer la simulation complète




/* -----Affichage  -------*/
function afficheMenu() {
    menu()
    let chos = +prompt("choizer un nombre: ")
    switch(chos) {
        case 1 : addTaxi() 
        break;
        case 2: addRequests()
        break;
        case 0 : return;
    }
}

afficheMenu()

console.log(requests)