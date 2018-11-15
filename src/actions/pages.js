import firestore from '../firebase/firebase';
export const startListPages = () => {
    return (dispatch) => {
        return firestore.collection('pages')
            .get()
            .then(querySnapshot => {
                let pages = [];
                querySnapshot.forEach(function (doc) {
                    if (doc.id.indexOf('@') == -1) {
                        pages.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    }
                });
                dispatch(setListPages(pages))
            })
    }
}
export const setListPages = (pages) => ({
    type: 'SET_LIST_PAGES',
    pages
});