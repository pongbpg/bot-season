import firestore from '../../firebase/firebase';
import _ from 'underscore';
import { startGetTargets } from '../manage/targets';
import { startListCosts } from '../finances/costs';
import Targets from '../../selectors/targets';
import moment from 'moment'
export const startGetRateTopsDay = (date) => {
    return (dispatch, getState) => {
        return dispatch(startGetTargets()).then(() => {
            const targets = Targets(getState().manage.targets, '2021', 3);
            return dispatch(startListCosts(date)).then(() => {
                const costs = getState().costs;
                // console.log(costs)
                return firestore.collection('orders')
                    .where('orderDate', '==', date)
                    .where('return', '==', false)
                    .where('country', '==', 'TH')
                    // .limit(10)
                    .get()
                    .then(snapShot => {
                        let data = [];
                        snapShot.forEach(doc => {
                            const page = doc.data().page.replace('@', '');
                            const channel = doc.data().page.indexOf('@') > -1 ? 'line' : 'fb';
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
                                if (ok) data.push({ id: doc.id, ...doc.data(), page, userId, admin, channel })
                            }
                        })
                        const sumPricePageChannel = _.chain(data)
                            .groupBy(value => value.page + '#' + value.channel)
                            .map((m, i) => {
                                const page = i.split('#')[0];
                                const channel = i.split('#')[1];
                                const ads = costs.find(f => f.page == page);
                                return {
                                    page,
                                    channel,
                                    price: _.reduce(_.pluck(m, 'price'), (t, n) => t + n, 0),
                                    ads: ads ? ads[channel] : 0
                                }
                            })
                            .value()
                        console.log('costs', sumPricePageChannel)
                        let sumProfit = 0;
                        let sumPercent = 0;
                        const groupAdmin = _.chain(data)
                            .map(m => {
                                const cost = sumPricePageChannel.find(f => f.page == m.page && f.channel == m.channel);
                                const ads = (m.price / cost.price) * cost.ads;
                                return {
                                    userId: m.userId,
                                    price: m.price,
                                    product: m.costs,
                                    ads,
                                    costTotal: m.costs + ads,
                                    profit: m.price - m.costs - ads,
                                }
                            })
                            .groupBy('userId')
                            .map((m, i) => {
                                return {
                                    userId: i,
                                    price: _.reduce(_.pluck(m, 'price'), (t, n) => t + n, 0),
                                    product: _.reduce(_.pluck(m, 'product'), (t, n) => t + n, 0),
                                    ads: _.reduce(_.pluck(m, 'ads'), (t, n) => t + n, 0),
                                    costTotal: _.reduce(_.pluck(m, 'costTotal'), (t, n) => t + n, 0),
                                    profit: _.reduce(_.pluck(m, 'profit'), (t, n) => t + n, 0),
                                }
                            })
                            .filter(f => f.profit > 0&&f.price>=10000)
                            .map((m, i) => {
                                sumProfit += m.profit;
                                sumPercent += (m.costTotal / m.price) * 100;
                                return {
                                    ...m,
                                    _Cost: m.costTotal / m.price * 100,
                                    _Profit: m.profit / m.price * 100
                                }
                            })
                            .map((m, i) => {
                                // console.log(sumProfit, sumPercent)
                                return {
                                    ...m,
                                    rate: (m._Cost / sumPercent) * (m.profit / sumProfit)
                                }
                            })
                            .sortBy('rate')
                            .reverse()
                            .value()
                        // console.log(groupAdmin)
                        return dispatch(setRates(groupAdmin))
                    })
            })

        })
    }
}

export const setRates = (rates) => ({
    type: 'SET_GAME_RATES',
    rates
});