import firestore from '../../firebase/firebase';
export const startGetSellProducts = (startDate, endDate, userId) => {
    return dispatch => {
        let db = firestore.collection('orders')
            .where('orderDate', '>=', startDate)
            .where('orderDate', '<=', endDate)
            .where('return', '==', false)
        if (userId) {
            db = db.where('userId', '==', userId)
        }
        return db.get().then(snapShot => {
            let sellProducts = [];
            snapShot.forEach(doc => {
                doc.data().product.forEach(prod => {
                    sellProducts.push({
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
            })
            console.log(sellProducts)
            return dispatch(setAdminsSellProducts(sellProducts));
        })

    }
}
export const setAdminsSellProducts = (sellProducts) => ({
    type: 'SET_ADMINS_SELL_PRODUCTS',
    sellProducts
});