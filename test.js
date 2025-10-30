const prompt = require('prompt-sync')();

let taxis = [
    { id: 1, position: 5,  available: true, timeRemaining: 0, totalRides: 0 },
    { id: 2, position: 12, available: true, timeRemaining: 0, totalRides: 0 },
    { id: 3, position: 20, available: true, timeRemaining: 0, totalRides: 0 }
];
let requests = [
    { reqId: 1, position: 10, duration: 3, time: 0 }
];


function TaxiPlusProche(n) {
    let availableTaxis = taxis.filter((el) => el.available);

    if(taxis.length == 0) {
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

    taxis[index].available = false;
    return {taxi: taxis[index], mindistance: min};

}

console.log(TaxiPlusProche(10))

function assignerTaxi(taxi, request) {
    taxi.available = false;
    taxi.timeRemaining = request.duration;
    taxi.totalRides++;
    taxi.position = request.position;
    console.log(`Minute ${currentTime}: → Demande ${request.reqId} à la position ${request.position} → Taxi ${taxi.id} assigné (distance: ${Math.abs(request.position - taxi.position)})`);

}


