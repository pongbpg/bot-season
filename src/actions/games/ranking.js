import firestore from '../../firebase/firebase';
import _ from 'underscore';
import moment from 'moment'
export const startGetRankings = (targets, startDate, endDate) => {
    const difdays = moment(endDate).diff(moment(startDate), 'days');
    // console.log('action difday',difdays)
    return (dispatch) => {
        return firestore.collection('orders')
            .where('orderDate', '>=', startDate)
            .where('orderDate', '<=', endDate)
            .where('return', '==', false)
            .get()
            .then(snapShot => {
                let data = [];
                snapShot.forEach(doc => {
                    if (doc.data().page.indexOf('TO01') == -1) {//without page office
                        const owner = targets.find(f => f.page == doc.data().page.replace('@', ''))
                        data.push({
                            id: doc.id,
                            ...doc.data(),
                            userId: doc.data().edit && owner ? owner.userId : doc.data().userId,
                            page: doc.data().page.replace('@', '')
                        })
                    }
                })
                let rankings = [];
                // console.log('targets',targets)
                const groupOwner = _.chain(data).flatten().groupBy('userId')
                    .map((owner, key) => {
                        return {
                            adminId: key,
                            pages: _.chain(owner).flatten().groupBy('page')
                                .map((page, pageId) => {
                                    return { pageId, price: page.reduce((memo, num) => memo + num.price, 0) }
                                })
                                // 
                                .value()
                                .map(page => {
                                    const target = targets.find(f => f.page == page.pageId && f.userId == key)
                                    // console.log('find target', target, page.pageId, key)
                                    if (target) {
                                        const target100 = (difdays + 1) * target.targetPerDay;
                                        const price = target.team == 'KH' ? page.price * 31 : page.price
                                        rankings.push({
                                            adminId: key,
                                            ...page,
                                            ...target,
                                            target100,
                                            percent: (price / target100) * 100,
                                            price
                                        })
                                    }
                                })
                        }
                    })
                    .value()

                    targets.map(target=>{
                        if(!rankings.find(f=>f.page==target.page)){
                            rankings.push({...target,percent:0})
                        }
                    })
                // console.log('data', data)
                // console.log('groupOwner', groupOwner)
                // console.log('rankings', rankings)
                // console.log('data',_.chain(rankings).sortBy('percent').reverse().value())
                // const tops = _.first(groupOwner, 4);
                // console.log(tops)
                return dispatch(setRankings(_.chain(rankings).sortBy('percent').reverse().value()))
            })
    }
}

export const setRankings = (rankings) => ({
    type: 'SET_GAME_RANKINGS',
    rankings
});