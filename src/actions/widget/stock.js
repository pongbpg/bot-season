import firestore from '../../firebase/firebase';
export const startGetStock = () => {
    return (dispatch) => {
        return firestore.collection('products')//.get()
            .onSnapshot(snapShot => {
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
                let amount = doc.data().amount;
                if (stock.action == 'plus') amount += stock.amount
                if (stock.action == 'minus') amount -= stock.amount
                return firestore.collection('products').doc(stock.id).update({ amount })
            })
    }
}


export const startGetProductType = () => {
    return (dispatch) => {
        // console.log(product)
        return firestore.collection('productType').get()
            .then(snapShot => {
                let types = [];
                snapShot.forEach(doc => {
                    types.push({ typeId: doc.id, typeName: doc.data().name })
                })
                return dispatch(setTypes(types))
            })
    }
}


export const setStock = (stock) => ({
    type: 'SET_STOCK',
    stock
});

export const setTypes = (types) => ({
    type: 'SET_TYPES',
    types
});