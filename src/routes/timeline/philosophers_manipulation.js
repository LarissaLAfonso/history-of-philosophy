import { philosophers } from '../../components/data/philosophers.json';

export function getPhilosopherDesc(philosopherName){
    let selectedPhilosopher = null;
    for(let philosopher of philosophers){
        console.log(philosopher);
        if(philosopher.value[0].value == philosopherName){
            selectedPhilosopher = philosopher.value;
            break;
        }
    }
    if(selectedPhilosopher == null) return null;
    let philosopherInfo = {
        name: philosopherName,
        lifetime: selectedPhilosopher[1].value,
        branch: selectedPhilosopher[2].value,
        fields: selectedPhilosopher[3].value,
        image: selectedPhilosopher[4].value,
        description: selectedPhilosopher[5].value,
    };

    return philosopherInfo;
}

export function getAlivePhilosophersIdx(philosopherList, year){
    let aliveIdx = [];
    for(let i = 0; i < philosopherList.length; i++){
        let philosopher = philosopherList[i];
        if(philosopher.nascimento <= year && (philosopher.morte == null || philosopher.morte > year)){
            aliveIdx.push(i);
        }
    }
    return aliveIdx;
}