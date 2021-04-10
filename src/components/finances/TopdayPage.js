import React from 'react';
import { connect } from 'react-redux';
import Money from '../../selectors/money';
import { startGetTopsDay, startGetBanList } from '../../actions/finances/topday'
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import _, { isNull } from 'underscore';
import { startGetEmails } from '../../actions/manage/emails';
import moment from 'moment'
export class TopdayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            daysOfMonth: 0,
            tops: props.tops || [],
            bans: props.bans || [],
            month: "",
            year: moment().year().toString(),
            list: [],
            emails: props.emails || []
        }
        this.props.startGetEmails();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.emails != this.state.emails) {
            this.setState({ emails: nextProps.emails });
        }
    }

    onMonthChange = (e) => {
        const month = e.target.value;
        const daysOfMonth = moment().year(this.state.year).month(Number(month) - 1).daysInMonth()
        Promise.all([
            this.props.startGetBanList(this.state.year, month),
            this.props.startGetTopsDay(this.state.year, month)
        ])
            .then(res => {
                // console.log(res) 
                const orders = res[1];
                let list = [];
                orders.map(order => {
                    const bans = res[0].filter(f => f.date == order.orderDate);
                    const dateNo = moment(order.orderDate).date();
                    const data = order.data.filter(f => {
                        const ban = bans.find(ban => ban.adminId == top.adminId) || { status: null }
                        return f.ytdPercent >= 50 || ban.status == true || isNull(ban.status)
                    }).slice(0, dateNo <= 10 ? 4 : 1)
                    const sumPrice = data.reduce((memo, num) => memo + num.price, 0)
                    list.push(...data.map(m => {
                        return {
                            ...m,
                            bonus1: dateNo <= 10 ? Math.round(m.price / sumPrice * 350) : 0,
                            bonus2: dateNo > 10 ? 100 : 0,
                            bonus: dateNo <= 10 ? Math.round(m.price / sumPrice * 350) : 100
                        }
                    })
                    )
                })
                list = _.chain(list)
                    .groupBy('adminId')
                    .map((admin, adminId) => {
                        const email = this.state.emails.filter(f => f.adminId == adminId && f.role == 'admin')[0];
                        console.log(email)
                        return {
                            adminId,
                            email: email.admin,
                            // pageId:admin.pageId,
                            bonus1: admin.reduce((memo, num) => memo + num.bonus1, 0),
                            bonus2: admin.reduce((memo, num) => memo + num.bonus2, 0),
                            bonus: admin.reduce((memo, num) => memo + num.bonus, 0)
                        }
                    })
                    .sortBy('bonus')
                    .reverse()
                    .value()
                // console.log(list)
                this.setState({ list })
            })
        this.setState({ month, daysOfMonth })
    }
    render() {
        console.log('list', this.state.list)
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">สรุป Topdays</h2>
                        <div className="field is-horizontal">
                            <div className="field-label is-normal">
                                <label className="label">ปี</label>
                            </div>
                            <div className="field-body">
                                <div className="field">
                                    <input className="input" type="number" value={this.state.year} onChange={e => this.setState({ year: e.target.value })}></input>
                                </div>
                                <div className="field">
                                    <div className="select">
                                        <select
                                            value={this.state.month} onChange={this.onMonthChange}>
                                            <option value="" disabled>เดือน</option>
                                            <option value="01">1</option>
                                            <option value="02">2</option>
                                            <option value="03">3</option>
                                            <option value="04">4</option>
                                            <option value="05">5</option>
                                            <option value="06">6</option>
                                            <option value="07">7</option>
                                            <option value="08">8</option>
                                            <option value="09">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="table-container" style={{ marginTop: '20px' }}>
                        <table className="table is-bordered">
                            <thead>
                                <tr>
                                    <th>แอดมิน</th>
                                    <th>1-10</th>
                                    <th>11-{this.state.daysOfMonth}</th>
                                    <th>รวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.list.length > 0 && this.state.list
                                    .map((m, i) => {
                                        return <tr key={i}>
                                            <td>{m.email}</td>
                                            <td>{m.bonus1}</td>
                                            <td>{m.bonus2}</td>
                                            <td>{m.bonus}</td>
                                        </tr>
                                    })}
                            </tbody>
                        </table>
                        {/* <PivotTableUI
                            data={this.state.list}
                            onChange={s => {
                                delete s.data
                                this.setState(s)
                            }}
                            {...this.state}
                        /> */}
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    emails: state.manage.emails
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetTopsDay: (year, month) => dispatch(startGetTopsDay(year, month)),
    startGetBanList: (year, month) => dispatch(startGetBanList(year, month)),
    startGetEmails: () => dispatch(startGetEmails())
});
export default connect(mapStateToProps, mapDispatchToProps)(TopdayPage);