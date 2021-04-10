import firestore from '../../firebase/firebase';
import _ from 'underscore';
import { startGetTargets } from '../manage/targets';
import Targets from '../../selectors/targets';
import moment from 'moment'
export const startGetTopsDay = (year, month) => {
    return (dispatch, getState) => {
        return dispatch(startGetTargets()).then(() => {
            const daysOfMonth = moment().year(year).month(Number(month) - 1).daysInMonth()
            const yesterday = moment(year + month + '01').subtract(1, 'days').format('YYYYMMDD');

            const targets = Targets(getState().manage.targets, year, Number(month) - 1);
            const targetsYtd = Targets(getState().manage.targets, yesterday.substr(0, 4), Number(yesterday.substr(4, 2)) - 1);
            return firestore.collection('orders')
                .where('orderDate', '>=', yesterday)
                .where('orderDate', '<=', year + month + daysOfMonth)
                .where('return', '==', false)
                .where('country', '==', 'TH')
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
                            if (doc.data().bank.indexOf('COD') == -1) {
                                const banks = doc.data().banks;
                                for (let i = 0; i < banks.length; i++) {
                                    if (banks[i].date < doc.data().orderDate && Number(banks[i].time) <= 22) {
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
                                        const x = {
                                            adminId: owner.adminId,
                                            pageId: owner.pageId,
                                            percent: tgYtd ? (owner.price / (yesterday == orderDate ? tgYtd.targetPerDay : tgTd.targetPerDay)) * 100 : 50,
                                            price: owner.price,
                                            target: true
                                        }
                                        return tgYtd ? x : { target: false };
                                    })
                                    .filter(f => f.target)
                                    .sortBy('price')
                                    .reverse()
                                    .value()
                            }
                        })
                        .value()

                    let datax = []
                    datax = _.chain(groupOwner.map((m, i) => {
                        // console.log('xxx',i)
                        if (i == 0) {
                            return {
                                thismonth: false
                            }
                        } else {
                            return {
                                data: _.chain(m.data.map(m2 => {
                                    const findYtd = groupOwner[i - 1].data.find(f => f.adminId == m2.adminId && f.pageId == m2.pageId);
                                    return {
                                        ...m2,
                                        orderDate: m.orderDate,
                                        ytdPercent: findYtd ? findYtd.percent : (moment(m.orderDate).isSame(yesterday, 'month') ? 0 : 50)
                                    }
                                })).groupBy('adminId')
                                    .sortBy('price')
                                    .reverse()
                                    .map((top, adminId) => {
                                        return top[0]
                                    })
                                    .sortBy('price')
                                    .reverse()
                                    .value(),
                                thismonth: true,
                                orderDate: m.orderDate
                            }
                        }
                    }))
                        .filter(f => f.thismonth)
                        .value()
                    return datax
                })
        })
    }
}
export const startGetBanList = (year, month) => {
    console.log('ban',year, month)
    return (dispatch, getState) => {
        return firestore.collection('bans')
            .where('year', '==', year.toString())
            .where('month', '==', month.toString())
            .get()
            .then(snapShot => {
                let data = [];
                snapShot.forEach(doc => {
                    data.push({ ...doc.data() })
                })
                return data;
            })
    }
}