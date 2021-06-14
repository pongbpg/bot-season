import React from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import Money from '../../selectors/money';
import { startListCosts, startSaveCost, startGetAdsFBVersion } from '../../actions/finances/costs';
// import { FaFacebook } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import ListCosts from '../../selectors/costs';
import NumberFormat from 'react-number-format';
import isJson from '../../selectors/isJson'
import moment from 'moment';
import _ from 'underscore';
moment.locale('th');
export class CostPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            costs: ListCosts(props.costs, props.pages, moment().format('YYYYMMDD')),
            auth: props.auth,
            id: '',
            fb: 0,
            line: 0,
            other: 0,
            action: false,
            date: moment(),
            isLoading: '',
            pages: props.pages || [],
            ads: props.ads || {}
        }
        this.props.startListCosts(moment().format('YYYYMMDD'));
        this.props.startGetAdsFBVersion();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.costs != this.state.costs) {
            this.setState({ costs: ListCosts(nextProps.costs, this.state.pages, moment(this.state.date).format('YYYYMMDD')) });
        }
        if (nextProps.ads != this.state.ads) {
            this.setState({ ads: nextProps.ads });
        }
    }
    onFbChange = (e) => {
        // const fb = e.target.value.replace(/\D/g, '');
        // if (!isNaN(fb)) {
        //     this.setState({
        //         fb: Number(fb)
        //     })
        // }
    }
    onLineChange = (e) => {
        const line = e.target.value.replace(/\D/g, '');
        if (!isNaN(line)) {
            this.setState({
                line: Number(line)
            })
        }
    }
    onOtherChange = (e) => {
        const other = e.target.value.replace(/\D/g, '');
        if (!isNaN(other)) {
            this.setState({
                other: Number(other)
            })
        }
    }
    onActionClick = (action, id) => {
        if (action) {
            const data = this.state.costs.find(f => f.page == id) || { fb: 0, line: 0, other: 0 }
            this.setState({ fb: data.fb, line: data.line, other: data.other })
        }
        this.setState({
            id,
            action
        })
    }
    handleSelectAll = (e) => {
        e.target.select()
    }
    onDateChange = (date) => {
        this.setState({ date })
        this.props.startListCosts(moment(date).format('YYYYMMDD'))
        this.onActionClick(false, 0)
    }
    onAmountSave = () => {
        this.setState({ isLoading: 'is-loading' })
        let cost = this.state.costs.find(f => f.page == this.state.id);
        cost.fb = isNaN(this.state.fb) ? 0 : Number(this.state.fb);
        cost.line = isNaN(this.state.line) ? 0 : Number(this.state.line);
        cost.other = isNaN(this.state.other) ? 0 : Number(this.state.other);
        // console.log(cost)
        this.props.startSaveCost(cost)
            .then((x) => {
                this.setState({ isLoading: '', id: '', fb: 0, line: 0, other: 0 })
            })
    }
    onFbAdsClick = () => {
        // console.log(this.state.token)
        let sumPage = [];
        let count = 0;
        const date = this.state.date;
        const costs = this.state.costs;
        let fetchs = [];
        // console.log(this.state.pages)
        this.state.pages.filter(f => f.actId)
            .map(page => {
                if (isJson(page.actId)) {
                    const tokens = JSON.parse(page.actId);
                    tokens.map(t => {
                        const token = t.token;
                        t.acts.map(act => {
                            const cors_api_url = `https://graph.facebook.com/v${this.state.ads.version}/act_${act.id}/insights?access_token=${token}&filtering=[{"field":"campaign.name","operator":"CONTAIN","value":"*${page.id}*"}]&time_range={"since":"${moment(date).format('YYYY-MM-DD')}","until":"${moment(date).format('YYYY-MM-DD')}"}&time_increment=1`;
                            fetchs.push(fetch(cors_api_url).then(value => value.json()).catch(err => console.log('err api fb', err)))
                            sumPage.push({ page: page.id, spend: 0, account_id: act.id })
                        })
                    })
                }
            })
        Promise.all(fetchs)
            .then((res) => {
                // console.log(res.length)
                let errPages = [];
                res.map((r, i) => {
                    const insights = JSON.parse(JSON.stringify(r));
                    if (insights.error)
                        errPages.push(sumPage[i])
                    if (!insights.error) {
                        if (insights.data.length > 0) {
                            sumPage[i] = { ...sumPage[i], spend: Number(insights.data[0].spend) }
                        }
                    }
                })
                console.log('err page token', errPages)
                const result = _.chain(sumPage).groupBy('page')
                    .map((values, pageId) => {
                        // console.log(values, pageId)
                        const costPage = _.reduce(_.pluck(values, 'spend'), (t, n) => t + n, 0);
                        let cost = costs.find(f => f.page == pageId);
                        const errActs = errPages.filter(f => f.page == pageId);
                        this.props.startSaveCost({
                            date: moment(date).format('YYYYMMDD'),
                            page: pageId,
                            id: moment(date).format('YYYYMMDD') + pageId,
                            fb: costPage,
                            team: cost.team,
                            admin: cost.admin,
                            year: moment(date).format('YYYYMMDD').substr(0, 4),
                            month: moment(date).format('YYYYMMDD').substr(4, 2),
                            day: moment(date).format('YYYYMMDD').substr(6, 2),
                            expire: errActs.length > 0,
                            expireActId: errActs
                        })
                        return { pageId, costPage }
                    }).value();
                console.log(result)
            })

    }

    render() {
        // console.log('render', this.state.costs)
        // console.log(this.state.date)
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">ค่าใช้จ่ายวันที่: {moment(this.state.date).format('LL')}</h2>
                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-three-fifths">
                        <div className="level">
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">วันที่</label>
                                    <div className="control">
                                        <DatePicker
                                            className="input has-text-centered"
                                            dateFormat="DD/MM/YYYY"
                                            placeholderText="เลือกวันที่"
                                            selected={this.state.date}
                                            onChange={this.onDateChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="columns is-centered">
                        <div className="column is-four-fifths">
                            <table className="table is-fullwidth is-striped is-narrow">
                                <thead>
                                    <tr>
                                        <th className="has-text-centered">ลำดับ</th>
                                        <th className="has-text-left">ทีม</th>
                                        <th className="has-text-left">เพจ</th>
                                        <th className="has-text-right">
                                            <a className="button has-text-info"
                                                disabled={!this.state.ads.version}
                                                onClick={this.onFbAdsClick}>
                                                <span className="icon"></span>&nbsp;Facebook v{this.state.ads.version}
                                            </a>
                                        </th>
                                        <th className="has-text-right has-text-success">Line</th>
                                        <th className="has-text-right has-text-danger">อื่นๆ</th>
                                        <th className="has-text-centered" width="20%">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.costs.filter(f => f.date == moment(this.state.date).format('YYYYMMDD'))
                                        .map((cost, i) => {
                                            return (
                                                <tr key={cost.page}>
                                                    <td className="has-text-centered">{++i}</td>
                                                    <td className="has-text-left">{`${cost.team}`}</td>
                                                    <td className={`has-text-left ${cost.expire && 'has-text-danger'}`}>
                                                        {`${cost.page} ${cost.admin}`}
                                                        {cost.expireActId.length > 0 && cost.expireActId.map((m, ii) => {
                                                            return <p key={ii} className="has-text-danger">{m.account_id}</p>
                                                        })}
                                                        {/* <p className="has-text-danger">{cost.expireActId}</p> */}
                                                    </td>
                                                    {(this.state.id !== cost.page) && (<td className="has-text-right">{Money(cost.fb, 0)}</td>)}
                                                    {(this.state.id !== cost.page) && (<td className="has-text-right">{Money(cost.line, 0)}</td>)}
                                                    {(this.state.id !== cost.page) && (<td className="has-text-right">{Money(cost.other, 0)}</td>)}
                                                    {(this.state.id !== cost.page) && (
                                                        <td className="has-text-centered">
                                                            <button
                                                                className="button"
                                                                onClick={() => { this.onActionClick(true, cost.page) }}>
                                                                แก้ไข</button>
                                                        </td>
                                                    )}
                                                    {(this.state.id === cost.page) && (
                                                        <td className="has-text-right">
                                                            <div className="field has-addons has-addons-right">
                                                                <div className="control">
                                                                    {/* <input type="text" name={this.state.id}
                                                                    className="input is-rounded has-text-right"
                                                                    onFocus={this.handleSelectAll}
                                                                    value={Money(this.state.fb, 0)}
                                                                    onChange={this.onFbChange}
                                                                /> */}
                                                                    <NumberFormat className="input is-rounded has-text-right" thousandSeparator={true}
                                                                        value={this.state.fb}
                                                                        onFocus={this.handleSelectAll}
                                                                        onValueChange={(values) => {
                                                                            const { formattedValue, value, floatValue } = values;
                                                                            // formattedValue = $2,223
                                                                            // value ie, 2223
                                                                            this.setState({ fb: floatValue })
                                                                        }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {(this.state.id === cost.page) && (
                                                        <td className="has-text-right">
                                                            <div className="field has-addons has-addons-right">
                                                                <div className="control">
                                                                    {/* <input type="text" name={this.state.id}
                                                                    className="input is-rounded has-text-right"
                                                                    onFocus={this.handleSelectAll}
                                                                    value={Money(this.state.line, 0)}
                                                                    onChange={this.onLineChange}
                                                                /> */}
                                                                    <NumberFormat className="input is-rounded has-text-right" thousandSeparator={true}
                                                                        value={this.state.line}
                                                                        onFocus={this.handleSelectAll}
                                                                        onValueChange={(values) => {
                                                                            const { formattedValue, value, floatValue } = values;
                                                                            // formattedValue = $2,223
                                                                            // value ie, 2223
                                                                            this.setState({ line: floatValue })
                                                                        }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {(this.state.id === cost.page) && (
                                                        <td className="has-text-right">
                                                            <div className="field has-addons has-addons-right">
                                                                <div className="control">
                                                                    {/* <input type="text" name={this.state.id}
                                                                    className="input is-rounded has-text-right"
                                                                    onFocus={this.handleSelectAll}
                                                                    value={Money(this.state.other, 0)}
                                                                    onChange={this.onOtherChange}
                                                                /> */}
                                                                    <NumberFormat className="input is-rounded has-text-right" thousandSeparator={true}
                                                                        value={this.state.other}
                                                                        onFocus={this.handleSelectAll}
                                                                        onValueChange={(values) => {
                                                                            const { formattedValue, value, floatValue } = values;
                                                                            // formattedValue = $2,223
                                                                            // value ie, 2223
                                                                            this.setState({ other: floatValue })
                                                                        }} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )}
                                                    {(this.state.id === cost.page) && (
                                                        <td className="has-text-centered">
                                                            <div className="field is-grouped">
                                                                <div className="control">
                                                                    <button className={`button is-success ${this.state.isLoading}`}
                                                                        onClick={this.onAmountSave}>บันทึก</button>
                                                                </div>
                                                                <div className="control">
                                                                    <button className={`button is-default ${this.state.isLoading}`}
                                                                        onClick={() => { this.onActionClick(false, '') }}>ปิด</button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            )
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    costs: state.costs,
    pages: state.pages.filter(f => f.active),
    ads: state.manage.ads
});
const mapDispatchToProps = (dispatch, props) => ({
    startListCosts: (date) => dispatch(startListCosts(date)),
    startSaveCost: (cost) => dispatch(startSaveCost(cost)),
    startGetAdsFBVersion: () => dispatch(startGetAdsFBVersion())
});
export default connect(mapStateToProps, mapDispatchToProps)(CostPage);