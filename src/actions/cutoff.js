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
        return firestore.collection('counter').doc('orders').set({ cutoffDate: yyyymmdd(), cutoff: true }, { merge: true })
            .then(() => {
                return firestore.collection('orders').where('cutoff', '==', false).get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(function (doc) {
                            firestore.collection('orders').doc(doc.id).set({ ...doc.data(), cutoff: true })
                        })
                        dispatch(setCutOff(true))
                        // dispatch(startListOrders())
                    });
            })

    }
}
const yyyymmdd = () => {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    var now = new Date();
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}