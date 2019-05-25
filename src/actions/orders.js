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
            update.doc(orders[x].id).update({
                tracking: orders[x].tracking,
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
                    tracking: tracks[x].tracking,
                    expressName: tracks[x].expressName,
                    expressLink: tracks[x].expressLink,
                    freight: tracks[x].freight
                })
            // console.log(tracks[x].tracking, { ...tracks[x] })
        }
        dispatch(startListOrders())
        // return dispatch(() => errors);
    }
}