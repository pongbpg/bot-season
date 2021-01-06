import firestore from '../firebase/firebase';

export const startListOrders = () => {
    return (dispatch) => {
        return firestore.collection('orders')
            .where('cutoff', '==', true)
            .where('tracking', '==', '')
            .where('country', '==', 'TH')
            .orderBy('name', 'asc')
            // .onSnapshot()
            .get()
            .then(querySnapshot => {
                let orders = [];
                querySnapshot.forEach(function (doc) {
                    let codFee = 0;
                    if (doc.data().bank.indexOf('COD') > -1) {
                        if (doc.data().name.substr(0, 1) == 'A') {
                            codFee = Number((doc.data().price * 0.02).toFixed(2));
                            if (Number(codFee) < 25) {
                                codFee = 25;
                            }
                        } else {
                            codFee = Number((doc.data().price * 0.03).toFixed(2));
                        }
                    }
                    orders.push({
                        id: doc.id,
                        ...doc.data(),
                        freight: 0,
                        codFee//: doc.data().bank.indexOf('COD') > -1 ? Number((doc.data().price * 0.03).toFixed(2)) : 0
                    })
                });
                dispatch(setListOrders(orders))
            })
    }
}
export const setListOrders = (orders) => ({
    type: 'SET_LIST_ORDERS',
    orders
});



export const startSaveTracking = (orders) => {
    return (dispatch) => {
        let update = firestore.collection('orders');
        for (let x = 0; x < orders.length; x++) {
            update.doc(orders[x].id).update({
                tracking: orders[x].tracking.toUpperCase(),
                freight: Number(orders[x].freight) || 0,
                codFee: Number(orders[x].codFee) || 0,
                totalFreight: (Number(orders[x].freight) || 0) + (Number(orders[x].codFee) || 0),
                codAmount: orders[x].codFee > 0 ? Number(orders[x].price) : 0,
                cod: orders[x].codFee > 0 ? true : false,
                expressName: orders[x].expressName,
                expressLink: orders[x].expressLink
            })
        }
        dispatch(startListOrders())
    }
}

export const startUploadTracks = (tracks) => {
    return (dispatch) => {
        let errors = [];
        // async function callback() {
        let update = firestore.collection('orders');
        for (let x = 0; x < tracks.length; x++) {
            update.doc(tracks[x].id)
                .update({
                    tracking: tracks[x].tracking.toUpperCase(),
                    expressName: tracks[x].expressName,
                    expressLink: tracks[x].expressLink,
                    freight: tracks[x].freight,
                    codFee: tracks[x].codFee,
                    cod: tracks[x].codFee > 0 ? true : false,
                    totalFreight: tracks[x].totalFreight,
                    codAmount: tracks[x].codAmount
                })
            // console.log(tracks[x].tracking, { ...tracks[x] })
        }
        dispatch(startListOrders())
        // return dispatch(() => errors);
    }
}