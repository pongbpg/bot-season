import firestore from '../firebase/firebase';
export const startListOrders = () => {
    return (dispatch) => {
        return firestore.collection('orders')
            .where('cutoff', '==', true)
            .where('tracking', '==', '')
            .get()
            .then(querySnapshot => {
                let orders = [];
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    // console.log(doc.id, " => ", doc.data());
                    orders.push({
                        id: doc.id,
                        ...doc.data()
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

export const startCutOff = () => {
    return (dispatch) => {
        return firestore.collection('orders').where('cutoff', '==', false).get()
            .then(querySnapshot => {
                // let xx = [];
                querySnapshot.forEach(function (doc) {
                    //     // doc.data() is never undefined for query doc snapshots
                    //     console.log(doc.id, " => ", doc.data());
                    //     xx.push({
                    //         id: doc.id,
                    //         ...doc.data()
                    //     })
                    firestore.collection('orders').doc(doc.id).set({ ...doc.data(), cutoff: true })
                })
                // return xx;
                dispatch(startListOrders())
            });
    }
}