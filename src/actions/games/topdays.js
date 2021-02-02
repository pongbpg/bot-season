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
                .where('country','==','TH')
                .get()
                .then(snapShot => {
                    let data = [];
                    snapShot.forEach(doc => {
                        const page = doc.data().page.replace('@', '');
                        const target = targets.find(f => f.page == page);
                        const userId = doc.data().edit && target ? target.userId : doc.data().userId
                        const admin = doc.data().edit && target ? target.name : doc.data().admin
                        // const price = doc.data().country == 'TH' ? doc.data().price : doc.data().price * 30;
                        if (doc.data().page.indexOf('TO01') == -1) { //without page office
                            let ok = true;
                            if (doc.data().orderDate == date && doc.data().bank.indexOf('COD') == -1) {
                                const banks = doc.data().banks;
                                for (let i = 0; i < banks.length; i++) {
                                    if (banks[i].date < date && Number(banks[i].time) <= 22) {
                                        ok = false;
                                    }
                                }
                            }
                            if (ok || doc.data().orderDate <= '20201117') data.push({ id: doc.id, ...doc.data(), page, userId, admin })
                        }
                    })

                    const groupOwner = _.chain(data).flatten()
                        .groupBy('orderDate')
                        .map((data, orderDate) => {
                            return {
                                orderDate,
                                data: _.chain(data).groupBy('userId')
                                    .map((owner, adminId) => {
                                        // return {
                                        //     adminId,
                                        //     pages:
                                        return _.chain(owner).flatten().groupBy('page')
                                            .map((page, pageId) => {

                                                const x = { adminId, pageId, price: page.reduce((memo, num) => memo + num.price, 0) }
                                                return x;
                                            })
                                            .sortBy('price')
                                            .reverse()
                                            .value()
                                        // }
                                    }).flatten()
                                    .map((owner, key2) => {
                                        const tgYtd = targetsYtd.find(f => f.page == owner.pageId && f.userId == owner.adminId)
                                        const tgTd = targets.find(f => f.page == owner.pageId && f.userId == owner.adminId)
                                        // console.log('tgTd', tgTd)
                                        // console.log('tgYtd', tgYtd)
                                        const x = {
                                            adminId: owner.adminId,
                                            pageId: owner.pageId,
                                            percent: tgYtd ? owner.price / (orderDate == date ? tgTd.targetPerDay : tgYtd.targetPerDay) * 100 : 50,
                                            price: owner.price,
                                            target: true
                                        }
                                        // if (owner.pages[0].pageId == 'TS01')
                                        // console.log('xxx', x)
                                        return tgYtd ? x : { target: false };
                                    })
                                    .filter(f => f.target)
                                    .sortBy('price')
                                    .reverse()
                                    .value()
                            }
                        })
                        .value()
                    // console.log(groupOwner)
                    let datax = []
                    if (groupOwner.length == 2)
                        datax = _.chain(groupOwner[1].data.map(m => {
                            const findYtd = groupOwner[0].data.find(f => f.adminId == m.adminId && f.pageId == m.pageId);
                            return {
                                ...m,
                                ytdPercent: findYtd ? findYtd.percent : (moment(date).isSame(yesterday, 'month') ? 0 : 50)
                            }
                        })).groupBy('adminId')
                            .sortBy('price')
                            .reverse()
                            .map((top, adminId) => {
                                return top[0] //select top in pages
                            })
                            .sortBy('price')
                            .reverse()
                            .value()
                    // console.log(datax)
                    return dispatch(setTops(datax))
                })
        })


    }
}
export const startGetBanList = (date) => {
    return (dispatch, getState) => {
        return firestore.collection('bans').doc(date).get()
            .then(doc => {
                if (doc.exists) {
                    return dispatch(setBans(doc.data().list || []))
                } else {
                    return dispatch(setBans([]))
                }
            })
    }
}
export const startSetTopBan = (date, { adminId, status }) => {
    return (dispatch, getState) => {
        // console.log(date)
        return firestore.collection('bans').doc(date).get()
            .then(doc => {
                let list = doc.get('list') || [];
                const find = list.find(f => f.adminId == adminId)
                if (find) {
                    list = list.map(m => {
                        if (m.adminId == adminId) {
                            return {
                                adminId,
                                status
                            }
                        } else {
                            return m
                        }
                    })
                } else {
                    list.push({ adminId, status })
                }
                firestore.collection('bans').doc(date).set({ date, list })
                return dispatch(setBans(list))
            })
    }
}
export const setTops = (tops) => ({
    type: 'SET_GAME_TOPS',
    tops
});
export const setBans = (bans) => ({
    type: 'SET_GAME_BANS',
    bans
});