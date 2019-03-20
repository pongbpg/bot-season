import firestore from '../../firebase/firebase';
export const startGetVotes = () => {
    return (dispatch) => {
        return firestore.collection('votes')//.get()
            .onSnapshot(snapShot => {
                let votes = [];
                snapShot.forEach(vote => {
                    votes.push({ id: vote.id, ...vote.data() })
                })
                return dispatch(setVotes(votes))
            })
    }
}
export const setVotes = (votes) => ({
    type: 'SET_GAME_VOTES',
    votes
});

export const startAddItemVote = (vote) => {
    return (dispatch) => {
        return firestore.collection('votes').doc(vote.id).set({ active: false, scores: [] })
    }
}

export const startToggleActive = (vote) => {
    return (dispatch) => {
        let active = false;
        if (vote.active == false) {
            active = true;
        }
        return firestore.collection('votes').doc(vote.id).update({ active })
    }
}

export const startUpdateScores = (id, scores) => {
    return (dispatch) => {
        return firestore.collection('votes').doc(id).update({ scores })
    }
}
export const startGetRandom = () => {
    return (dispatch) => {
        return firestore.collection('setting').doc('votes')
            .onSnapshot(doc => {
                return dispatch(setRandom(doc.data().random))
            })
    }
}
export const setRandom = (random) => ({
    type: 'SET_GAME_RANDOM',
    random
});

export const startSetRandom = (random) => {
    return (dispatch) => {
        return firestore.collection('setting').doc('votes').update({ random })
    }
}