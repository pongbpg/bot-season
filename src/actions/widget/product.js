import firestore from '../../firebase/firebase';
export const startAddProduct = (product) => {
    return (dispatch) => {
        // console.log(product)
        return firestore.collection('products').doc(product.id).get()
            .then(doc => {
                if (!doc.exists) {
                    return firestore.collection('products').doc(product.id).set(product)
                        .then(() => {
                            return "ok"
                        })
                } else {
                    return 'no'
                }
            })
    }
}
export const startUpdateProduct = (product) => {
    return (dispatch) => {
        return firestore.collection('products').doc(product.id).update(product)
    }
}
export const startDeleteProduct = (product) => {
    return (dispatch) => {
        return firestore.collection('products').doc(product.id).delete()
    }
}


const threeDigit = (n) => {
    if (n < 10) {
        return '00' + n.toString();
    } else if (n < 100) {
        return '0' + n.toString()
    } else {
        return n.toString();
    }
}

