import React from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import Money from '../../selectors/money';
import { startListCosts, startSaveCost, startGetAdsFBToken } from '../../actions/finances/costs';
import { FaFacebook } from 'react-icons/fa';
import { MdRefresh } from 'react-icons/md';
import ListCosts from '../../selectors/costs';
import NumberFormat from 'react-number-format';
import moment from 'moment';
moment.locale('th');
export class CostPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            costs: ListCosts(props.costs || [], props.pages || [], moment().format('YYYYMMDD')),
            auth: props.auth,
            id: '',
            fb: 0,
            line: 0,
            other: 0,
            action: false,
            date: moment(),
            isLoading: '',
            pages: props.pages || [],
            token: props.ads || {}
        }
        this.props.startListCosts(moment().format('YYYYMMDD'));
        this.props.startGetAdsFBToken();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.costs != this.state.costs) {
            this.setState({ costs: ListCosts(nextProps.costs, this.state.pages, moment(this.state.date).format('YYYYMMDD')) });
        }
        if (nextProps.ads != this.state.token) {
            this.setState({ token: nextProps.ads });
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
        this.state.pages.map(page => {
            if (page.actId) {
                const acts = page.actId.split(',');
                if (sumPage.indexOf(page.id) == -1) {
                    sumPage[page.id] = 0;
                }
                count += acts.length;
                for (let i = 0; i < acts.length; i++) {
                    var cors_api_url = `https://graph.facebook.com/v4.0/act_${acts[i]}/insights?access_token=${this.state.token.fb}&filtering=[{"field":"campaign.name","operator":"CONTAIN","value":"${page.id}"}]&time_range={"since":"${moment(date).format('YYYY-MM-DD')}","until":"${moment(date).format('YYYY-MM-DD')}"}&time_increment=1`;
                    // console.log(cors_api_url)
                    fetch(cors_api_url)
                        .then(function (response) {
                            return response.json();
                        })
                        .then((jsonStr) => {
                            const insights = JSON.parse(JSON.stringify(jsonStr));
                            if (insights.data.length > 0) {
                                sumPage[page.id] += Number(insights.data[0].spend)
                            }
                            if (count > 0) {
                                count--;
                            }
                            if (count == 0) {
                                for (var item in sumPage) {
                                    let cost = this.state.costs.find(f => f.page == item);
                                    // console.log(cost)
                                    this.props.startSaveCost({
                                        date: moment(date).format('YYYYMMDD'),
                                        page: item,
                                        id: moment(date).format('YYYYMMDD') + item,
                                        fb: sumPage[item],
                                        team: cost.team,
                                        admin: cost.admin,
                                        year: moment(date).format('YYYYMMDD').substr(0, 4),
                                        month: moment(date).format('YYYYMMDD').substr(4, 2),
                                        day: moment(date).format('YYYYMMDD').substr(6, 2)
                                    })
                                }
                                // console.log(sumPage)
                            }
                        })
                }
            }
        })
    }

    render() {
        // console.log(this.state.costs)
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
                                                disabled={!this.state.token.fb}
                                                onClick={this.onFbAdsClick}>
                                                <span className="icon"><MdRefresh /></span>&nbsp;Facebook
                                            </a>
                                        </th>
                                        <th className="has-text-right has-text-success">Line</th>
                                        <th className="has-text-right has-text-danger">อื่นๆ</th>
                                        <th className="has-text-centered" width="20%">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.costs.map((cost, i) => {
                                        return (
                                            <tr key={cost.page}>
                                                <td className="has-text-centered">{++i}</td>
                                                <td className="has-text-left">{`${cost.team}`}</td>
                                                <td className="has-text-left">{`${cost.page} ${cost.admin}`}</td>
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
                                                                        const { formattedValue, value } = values;
                                                                        // formattedValue = $2,223
                                                                        // value ie, 2223
                                                                        this.setState({ fb: value })
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
                                                                        const { formattedValue, value } = values;
                                                                        // formattedValue = $2,223
                                                                        // value ie, 2223
                                                                        this.setState({ line: value })
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
                                                                        const { formattedValue, value } = values;
                                                                        // formattedValue = $2,223
                                                                        // value ie, 2223
                                                                        this.setState({ other: value })
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
    pages: state.pages,
    ads: state.manage.ads
});
const mapDispatchToProps = (dispatch, props) => ({
    startListCosts: (date) => dispatch(startListCosts(date)),
    startSaveCost: (cost) => dispatch(startSaveCost(cost)),
    startGetAdsFBToken: () => dispatch(startGetAdsFBToken())
});
export default connect(mapStateToProps, mapDispatchToProps)(CostPage);