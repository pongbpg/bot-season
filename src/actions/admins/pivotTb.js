import firestore from '../../firebase/firebase';
export const startGetPivotTb = (startDate, endDate, userId, typePv) => {
    return dispatch => {
        let db = firestore.collection('orders')
            .where('orderDate', '>=', startDate)
            .where('orderDate', '<=', endDate)
            .where('return', '==', false)
        if (userId) {
            db = db.where('userId', '==', userId)
        }
        return db.get().then(snapShot => {
            let pivotTb = [];
            snapShot.forEach(doc => {
                if (typePv == 'product')
                    doc.data().product.forEach(prod => {
                        pivotTb.push({
                            quantity: prod.amount,
                            product: prod.code,
                            // productName: prod.name,
                            productType: prod.typeId,
                            admin: doc.data().admin,
                            channel: doc.data().page.indexOf('@') > -1 ? 'Line' : 'FB',
                            country: doc.data().country,
                            date: doc.data().orderDate,
                            page: doc.data().page.replace('@', ''),
                            team: doc.data().team
                        })
                    })
                else
                    pivotTb.push({
                        admin: doc.data().admin,
                        channel: doc.data().page.indexOf('@') > -1 ? 'Line' : 'FB',
                        country: doc.data().country,
                        date: doc.data().orderDate,
                        page: doc.data().page.replace('@', ''),
                        team: doc.data().team,
                        price: doc.data().country == 'TH' ? doc.data().price : doc.data().price * 30
                    })
            })
            console.log(pivotTb)
            return dispatch(setAdminsPivotTb(pivotTb));
        })

    }
}
export const setAdminsPivotTb = (pivotTb) => ({
    type: 'SET_ADMINS_PIVOT_TB',
    pivotTb
});