import firestore from '../firebase/firebase';
import { startListOrders } from './orders';
export const setCutOff = (cutoff) => ({
    type: 'SET_CUTOFF',
    cutoff
});
export const startGetCutOff = () => {
    return (dispatch) => {
        return firestore.collection('counter').doc('orders').get()
            .then(cutoff => {
                dispatch(setCutOff(cutoff.data().cutoff))
            })
    }
}
export const startCutOff = () => {
    return (dispatch) => {
        return firestore.collection('counter').doc('orders').set({ cutoff: true }, { merge: true })
            .then(() => {
                return firestore.collection('orders').where('cutoff', '==', false).get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(function (doc) {
                            firestore.collection('orders').doc(doc.id).set({ ...doc.data(), cutoff: true })
                        })
                        dispatch(startGetCutOff())
                        // dispatch(startListOrders())
                    });
            })

    }
}