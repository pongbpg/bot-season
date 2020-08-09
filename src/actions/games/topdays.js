import firestore from '../../firebase/firebase';
import _ from 'underscore';
import { startGetTargets } from '../manage/targets';
import Targets from '../../selectors/targets';
export const startGetTopsDay = (date) => {
    return (dispatch, getState) => {
        return dispatch(startGetTargets()).then(() => {
            const targets = Targets(getState().manage.targets, date.substr(0, 4), Number(date.substr(4, 2)) - 1);
            // console.log(targets)
            return firestore.collection('orders')
                .where('orderDate', '==', date)
                .where('return', '==', false)
                .onSnapshot(snapShot => {
                    let data = [];
                    snapShot.forEach(doc => {
                        const page = doc.data().page.replace('@', '');
                        const target = targets.find(f => f.page == page);
                        const userId = doc.data().edit && target ? target.userId : doc.data().userId
                        const admin = doc.data().edit && target ? target.name : doc.data().admin
                        if (doc.data().page.indexOf('TO01') == -1) { //without page office
                            data.push({ id: doc.id, ...doc.data(), page, userId, admin })
                        }
                    })
                    const groupOwner = _.chain(data).flatten().groupBy('userId')
                        .map((owner, key) => {
                            return {
                                adminId: key,
                                pages: _.chain(owner).flatten().groupBy('page')
                                    .map((page, pageId) => {
                                        return { pageId, price: page.reduce((memo, num) => memo + num.price, 0) }
                                    }).sortBy('price').reverse()
                                    .value()
                            }
                        })
                        .map((owner, key) => {
                            return {
                                adminId: owner.adminId,
                                price: owner.pages[0].price
                            }
                        }).sortBy('price').reverse()
                        .value()
                    // console.log(dispatch())
                    // const tops = _.first(groupOwner, 4);
                    // console.log(tops)
                    return dispatch(setTops(groupOwner))
                })
        })


    }
}

export const setTops = (tops) => ({
    type: 'SET_GAME_TOPS',
    tops
});