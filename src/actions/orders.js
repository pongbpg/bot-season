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
    orders = orders.filter(f => {
        if ([5, 7, 8, 12, 13].indexOf(f.tracking.length) > -1) {
            return true;
        }
        // else if (f.tracking.substr(0, 1).toUpperCase() == 'K' && f.tracking.length == 13) {
        //     return true;
        // } else if (f.tracking.indexOf('TH') > -1 && f.tracking.length == 13) {
        //     return true;
        // }
        else {
            return false;
        }
    })
    return (dispatch) => {
        let update = firestore.collection('orders');
        for (let x = 0; x < orders.length; x++) {
            let expressLink = '', expressName = '';
            if ([5, 7, 8, 12].indexOf(orders[x].tracking.length) > -1) {
                expressName = 'ALPHA FAST';
                expressLink = 'https://www.alphafast.com/th/track-alpha';
            } else if (orders[x].tracking.indexOf('TH') > -1 && orders[x].tracking.length == 13) {
                expressName = 'EMS';
                expressLink = 'http://track.thailandpost.co.th/tracking/default.aspx';
            } else {
                expressName = 'KERRY';
                expressLink = 'https://th.kerryexpress.com/th/track/?track';
            }
            update.doc(orders[x].id).set({
                tracking: orders[x].tracking,
                expressName,
                expressLink
            }, { merge: true })
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
                    expressName: 'FLASH',
                    expressLink: 'https://www.flashexpress.co.th/tracking/'
                })
            // .get()
            // .then((doc) => {
            //     errors.push({ ...tracks[x], error: false })

            // })
            // .catch(error => {
            //     errors.push({ ...tracks[x], error: true })
            // })
            // }
            // console.log(errors)
        }
        dispatch(startListOrders())
        // return dispatch(() => errors);
    }
}