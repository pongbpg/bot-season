import firestore from '../firebase/firebase';
import { startListOrders } from './orders';
import moment from 'moment';
moment.locale('th');
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
        return firestore.collection('counter').doc('orders').set({ cutoffDate: tomorrow(), cutoff: true }, { merge: true })
            .then(() => {
                return firestore.collection('orders').where('cutoff', '==', false).get()
                    .then(querySnapshot => {
                        querySnapshot.forEach(function (doc) {
                            firestore.collection('orders').doc(doc.id).set({ ...doc.data(), cutoff: true })
                        })
                        dispatch(setCutOff(true))
                        dispatch(startListOrders())
                        return firestore.collection('groups').get()
                            .then(snapShot => {
                                let boardcasts = [];
                                snapShot.forEach(group => {
                                    boardcasts.push({
                                        to: group.id,
                                        messages: [
                                            {
                                                "type": "text",
                                                "text": `>>>วันที่ ${moment(new Date()).format('ll')} ปิดรอบแล้วจ้า<<<`
                                            }
                                        ]
                                    })
                                })
                                fetch('./api/boardcast', {
                                    body: JSON.stringify({ boardcasts }),
                                    headers: {
                                        // 'user-agent': 'Mozilla/4.0 MDN Example',
                                        'Content-Type': 'application/json'
                                    },
                                    method: 'post'
                                })
                                    .then(response => response.json())
                                    .then(result => {
                                        console.log(result);
                                    })
                            })

                    });
            })

    }
}
const tomorrow = () => {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    var now = new Date();
    now.setDate(now.getDate() + 1);
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}
const today = () => {
    function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
    var now = new Date();
    return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
}