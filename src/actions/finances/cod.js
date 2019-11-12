import firestore from '../../firebase/firebase';
export const startGetCods = (date) => {
    return dispatch => {
        return firestore.collection('orders')
            .where('codAmount', '>', 0)
            .where('orderDate', '==', date)
            // .get()
            .onSnapshot(snapShot => {
                let cods = [];
                snapShot.forEach(doc => {
                    cods.push({ id: doc.id, ...doc.data() })
                })
                return dispatch(setListCods(cods))
            })
    }
}
export const startAddCods = (qrcodes) => {
    return (dispatch) => {
        for (let i = 0; i < qrcodes.length; i++) {
            console.log(i, qrcodes[i])
            firestore.collection('orders')
                .where('codAmount', '>', 0)
                .where('tracking', '==', qrcodes[i])
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        // console.log(doc.id, " => ", doc.data());
                        if (doc.exists) {
                            console.log(doc.id, qrcodes[i])
                            dispatch(addCod({ id: doc.id, ...doc.data() }))
                        }
                    });
                })
        }
    }
}
export const startUpdateCod = (cod) => {
    return dispatch => {
        return firestore.collection('orders').doc(cod.id).update({ received: cod.received, cod: true })
            .then(() => {
                return dispatch(updateCod(cod))
            })
    }
}
export const startClearCods = () => {
    return dispatch => {
        return dispatch(clearCod())
    }
}
export const setListCods = (cods) => ({
    type: 'SET_LIST_CODS',
    cods
});
export const addCod = (cod) => ({
    type: 'ADD_COD',
    cod
});
export const updateCod = (cod) => ({
    type: 'UPDATE_COD',
    cod
});
export const clearCod = () => ({
    type: 'CLEAR_COD'
});
