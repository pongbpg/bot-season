import firestore from '../../firebase/firebase';
export const startGetStock = () => {
    return (dispatch) => {
        return firestore.collection('products').get()
            .then(snapShot => {
                let stock = [];
                snapShot.forEach(product => {
                    stock.push({ id: product.id, ...product.data() })
                })
                return dispatch(setStock(stock))
            })
    }
}
export const startChangeStock = (stock) => {
    return (dispatch) => {
        return firestore.collection('products').doc(stock.id).get()
            .then(doc => {
                let amount = 0;
                if (stock.action == 'plus') amount = doc.data().amount + stock.amount
                if (stock.action == 'minus') amount = doc.data().amount - stock.amount
                return firestore.collection('products').doc(stock.id).update({ amount })
            })
    }
}
export const setStock = (stock) => ({
    type: 'SET_STOCK',
    stock
});
