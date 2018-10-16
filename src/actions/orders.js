import firestore from '../firebase/firebase';
export const startListOrders = () => {
    return (dispatch) => {
        firestore.collection('orders').where('cutoff', '==', true).get()
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