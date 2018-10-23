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
export const setStock = (stock) => ({
    type: 'SET_STOCK',
    stock
});
