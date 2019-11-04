import firestore from '../../firebase/firebase';
export const startListCosts = (date) => {
    return (dispatch) => {
        return firestore.collection('costs')
            .where('date', '==', date)
            .get()
            .then(querySnapshot => {
                let costs = [];
                querySnapshot.forEach(function (doc) {
                    costs.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                return dispatch(setListCosts(costs))
            })
    }
}
export const setListCosts = (costs) => ({
    type: 'SET_LIST_COSTS',
    costs
});
function twoDigit(n) { return (n < 10 ? '0' : '') + n; }

export const startSaveCost = (cost) => {
    return dispatch => {
        return firestore.collection('costs').doc(cost.date + cost.page)
            .set(cost, { merge: true })
            .then(() => {
                return dispatch(startListCosts(cost.date))
            })
    }
}
export const startGetAdsFBToken = () => {
    return (dispatch) => {
        return firestore.collection('settings').doc('ads')
            .get()
            .then(doc => {
                return dispatch(setAdsFBToken(doc.data().fb))
            })
    }
}
export const setAdsFBToken = (token) => ({
    type: 'SET_ADS_FB_TOKEN',
    token
});