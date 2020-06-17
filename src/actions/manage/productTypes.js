import firestore from '../../firebase/firebase';
export const startAddProductType = (productType) => {
    return (dispatch) => {
        // console.log(product)
        return firestore.collection('productType').doc(productType.id).get()
            .then(doc => {
                if (!doc.exists) {
                    return firestore.collection('productType').doc(productType.id).set(productType)
                        .then(() => {
                            return "ok"
                        })
                } else {
                    return 'no'
                }
            })
    }
}
export const startGetProductTypes = () => {
    return (dispatch) => {
        return firestore.collection('productType').get()
            .then(snapShot => {
                let productTypes = [];
                snapShot.forEach(productType => {
                    productTypes.push({ id: productType.id, ...productType.data() })
                })
                return dispatch(setProductTypes(productTypes))
            })
    }
}
export const startUpdateProductType = (productType) => {
    return (dispatch) => {
        return firestore.collection('productType').doc(productType.id).update({ ...productType })
            .then(() => {
                return dispatch(setProductType(productType))
            })
    }
}
export const startDeleteProductType = (productType) => {
    return (dispatch) => {
        return firestore.collection('productType').doc(productType.id).delete()
    }
}

export const setProductTypes = (productTypes) => ({
    type: 'SET_MANAGE_PRODUCT_TYPES',
    productTypes
});

export const setProductType = (productType) => ({
    type: 'SET_MANAGE_PRODUCT_TYPE',
    productType
});