import firestore from '../../firebase/firebase';
import _ from 'underscore';
export const startGetTopsDay = (date) => {
    return (dispatch) => {
        return firestore.collection('orders')
            .where('orderDate', '==', date)
            .onSnapshot(snapShot => {
                let data = [];
                snapShot.forEach(doc => {
                    if (doc.data().page.indexOf('TO01') == -1) //without page office
                        data.push({ id: doc.id, ...doc.data(), page: doc.data().page.replace('@', '') })
                })
                const groupOwner = _.chain(data).flatten().groupBy('userId')
                    .map((owner, key) => {
                        return {
                            adminId: key,
                            pages: _.chain(owner).flatten().groupBy('page')
                                .map((page, pageId) => {
                                    return { pageId, price: page.filter(f => f.return == false).reduce((memo, num) => memo + num.price, 0) }
                                }).sortBy('price').reverse()
                                .value()
                        }
                    })
                    .map((owner, key) => {
                        return {
                            adminId: owner.adminId,
                            price: owner.adminId == 'Ubfe755500584c1459cee5eaac2a23933'
                                ? owner.pages.reduce((memo, num) => memo + num.price, 0)
                                : owner.pages[0].price
                        }
                    }).sortBy('price').reverse()
                    .value()
                const tops = _.first(groupOwner, 4);
                console.log(tops)
                return dispatch(setTops(tops))
            })
    }
}

export const setTops = (tops) => ({
    type: 'SET_GAME_TOPS',
    tops
});