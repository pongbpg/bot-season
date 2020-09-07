import firestore from '../../firebase/firebase';
import _ from 'underscore';
import { startGetTargets } from '../manage/targets';
import Targets from '../../selectors/targets';
import moment from 'moment'
export const startGetTopsDay = (date) => {
    return (dispatch, getState) => {
        return dispatch(startGetTargets()).then(() => {
            const targets = Targets(getState().manage.targets, date.substr(0, 4), Number(date.substr(4, 2)) - 1);

            const yesterday = moment(date).subtract(1, 'days').format('YYYYMMDD');
            const targetsYtd = Targets(getState().manage.targets, yesterday.substr(0, 4), Number(yesterday.substr(4, 2)) - 1);
            // console.log(targets)
            return firestore.collection('orders')
                .where('orderDate', '>=', yesterday)
                .where('orderDate', '<=', date)
                .where('return', '==', false)
                .get()
                .then(snapShot => {
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
                    const groupOwner = _.chain(data).flatten()
                        .groupBy('orderDate')
                        .map((data, key) => {
                            return {
                                orderDate: key,
                                data: _.chain(data).groupBy('userId')
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
                                        const tgYtd = targetsYtd.find(f => f.page == owner.pages[0].pageId && f.userId == owner.adminId)
                                        return {
                                            adminId: owner.adminId,
                                            pageId: owner.pages[0].pageId,
                                            percent: tgYtd ? owner.pages[0].price / tgYtd.targetPerDay * 100 : 50,
                                            price: owner.pages[0].price
                                        }
                                    })
                                    .sortBy('price').reverse().value()
                            }
                        })
                        .value()
                    // console.log(groupOwner)
                    let datax = []
                    if (groupOwner.length == 2)
                        datax = groupOwner[1].data.map(m => {
                            const findYtd = groupOwner[0].data.find(f => f.adminId == m.adminId && f.pageId == m.pageId);
                            return {
                                ...m,
                                ytdPercent: findYtd ? findYtd.percent : 50
                            }
                        })
                    // console.log(dispatch())
                    // const tops = _.first(groupOwner, 4);
                    // console.log(tops)
                    // console.log(groupOwner)
                    return dispatch(setTops(datax))
                })
        })


    }
}

export const setTops = (tops) => ({
    type: 'SET_GAME_TOPS',
    tops
});