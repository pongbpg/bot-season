import firestore from '../firebase/firebase';
export const startListOrders = () => {
    return (dispatch) => {
        return firestore.collection('orders')
            .where('cutoff', '==', true)
            .where('tracking', '==', '')
            // .get()
            .onSnapshot(querySnapshot => {
                let orders = [];
                querySnapshot.forEach(function (doc) {
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



export const startSaveTracking = (orders) => {
    return (dispatch) => {
        let update = firestore.collection('orders');
        for (let x = 0; x < orders.length; x++) {
            update.doc(orders[x].id).set({ tracking: orders[x].tracking }, { merge: true })
        }
        // dispatch(startListOrders())
    }
}