import React, { useState } from 'react';
import { connect } from 'react-redux';
import { startGetEmails } from '../../actions/manage/emails';
import { startGetTargets } from '../../actions/manage/targets';
import { startGetRankings } from '../../actions/games/ranking';
import { MdRefresh } from 'react-icons/md'
import NumberFormat from 'react-number-format';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import Money from '../../selectors/money';
import moment from 'moment';
import _ from 'underscore'
import { format } from 'numeral';
moment.locale('th');

export class ShowTargets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            emails: props.emails,
            admins: props.admins,
            admin: '',
            pages: props.pages,
            page: '',
            targets: props.targets,
            target: '',
            year: moment().year(),
            month: moment().month(),
            lists: [],//this.initList(props.targets, moment().year(), moment().month()),
            rankings: props.rankings,
            startDate: new Date(),
            endDate: new Date()
        }
        this.props.startGetEmails();
        this.props.startGetTargets();
        // this.props.startGetRankings([], moment().format('YYYYMMDD'), moment().format('YYYYMMDD'))
    }
    initList(targets, year, month) {
        let lists = [];
        if (targets.find(f => f.id == year)) {
            const data = targets.find(f => f.id == year).months;
            if (data.find(f => f.month == month)) {
                lists = data.find(f => f.month == month).pages;
            }
        }
        return lists.sort((a, b) => a.team + a.page > b.team + b.team ? 1 : -1);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth })
        }
        if (nextProps.emails != this.state.emails) {
            this.setState({ emails: nextProps.emails })
        }
        if (nextProps.targets != this.state.targets) {
            this.setState({
                targets: nextProps.targets
            })
            this.props.startGetRankings(
                this.initList(nextProps.targets, this.state.year, this.state.month),
                moment(this.state.startDate).format('YYYYMMDD'),
                moment(this.state.endDate).format('YYYYMMDD')
            )
            //     lists:this.initList(nextProps.targets, this.state.year, this.state.month)
            // },this.onGetRankings())
        }
        if (nextProps.rankings != this.state.rankings) {
            console.log('new props ranking', nextProps.rankings)
            this.setState({
                rankings: nextProps.rankings
            })
        }
    }
    onYearChange = (e) => {
        const year = e.target.value;
        const startDate = new Date(moment([e.target.value, this.state.month, 1]));
        const endDate = new Date(moment([e.target.value, this.state.month, 1]));
        this.setState({
            year, month: '0',
            startDate,
            endDate
        })
        this.props.startGetRankings(
            this.initList(this.state.targets, year, this.state.month),
            moment(startDate).format('YYYYMMDD'),
            moment(endDate).format('YYYYMMDD')
        )
    }
    onMonthChange = (e) => {
        const startDate = new Date(moment([this.state.year, e.target.value, 1]));
        const endDate = new Date(moment([this.state.year, e.target.value, 1]));
        this.setState({
            month: e.target.value,
            startDate,
            endDate
        })
        this.props.startGetRankings(
            this.initList(this.state.targets, this.state.year, e.target.value),
            moment(startDate).format('YYYYMMDD'),
            moment(endDate).format('YYYYMMDD')
        )
    }
    onDateChange = (values) => {
        // console.log('change', values)
        const startDate = values[0];
        const endDate = values[1];
        this.setState({ startDate, endDate })
        this.props.startGetRankings(
            this.initList(this.state.targets, this.state.year, this.state.month),
            moment(startDate).format('YYYYMMDD'),
            moment(endDate).format('YYYYMMDD')
        )
    }
    onRefresh = () => {
        this.setState({ rankings: [] })
        this.props.startGetRankings(
            this.initList(this.state.targets, this.state.year, this.state.month),
            moment(this.state.startDate).format('YYYYMMDD'),
            moment(this.state.endDate).format('YYYYMMDD')
        )
    }
    render() {
        const pickerLang = {
            months: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
            from: 'จาก', to: 'ถึง',
            colors: [
                { percent: 30, color: 'has-background-black-bis' },
            ]
        }
        const percentColor = (percent) => {
            if (percent <= 30) {
                return 'has-background-black has-text-white'
            } else if (percent <= 50) {
                return 'has-background-danger has-text-white'
            } else if (percent <= 70) {
                return 'has-background-warning'
            } else if (percent <= 90) {
                return 'has-background-success'
            } else if (percent <= 100) {
                return 'has-background-primary'
            } else {
                return 'has-background-info has-text-light'
            }
        }
        const MyDateRange = () => {

            const selectMonthYear = moment([this.state.year, this.state.month]);
            const minDate = moment([this.state.year, this.state.month, 1]);
            const maxDate = moment([this.state.year, this.state.month, selectMonthYear.daysInMonth()]);

            return (
                <div>
                    <DateRangePicker
                        format="dd-MM"
                        onChange={this.onDateChange}
                        minDate={new Date(minDate)}
                        maxDate={new Date(maxDate)}
                        value={[this.state.startDate, this.state.endDate]}
                    />
                </div>
            );
        }
        // console.log('new list', this.state.lists)
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="container">
                        <h2 className="title">Admin Rankings</h2>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="columns">
                        <div className="column is-12">
                            <div className="field is-grouped">
                                <div className="control select">
                                    <select value={this.state.year} onChange={this.onYearChange}>
                                        <option value=''>ปี</option>
                                        {this.state.targets.length > 0 && (
                                            this.state.targets.map(target => {
                                                return (<option key={target.id} value={target.id}>{target.id}</option>)
                                            })
                                        )}
                                    </select>
                                </div>
                                <div className="control select">
                                    <select value={this.state.month} onChange={this.onMonthChange}>
                                        <option>เดือน</option>
                                        {this.state.year != '' && pickerLang.months.map((month, i) => {
                                            return (<option key={i} value={i}>{month}</option>)
                                        })}
                                    </select>
                                </div>
                                <div className="control">
                                    <MyDateRange />
                                </div>
                            </div>
                            <div class="tags are-medium">
                                <span className={percentColor(0) + ' tag'}>0-30%</span>
                                <span className={percentColor(31) + ' tag'}>31-50%</span>
                                <span className={percentColor(51) + ' tag'}>51-70%</span>
                                <span className={percentColor(71) + ' tag'}>71-90%</span>
                                <span className={percentColor(100) + ' tag'}>90-100%</span>
                                <span className={percentColor(101) + ' tag'}>100%+</span>
                            </div>
                        </div>
                    </div>
                    <div className="columns is-centered">
                        <div className="column is-12">
                            <div className="table-container">
                                <table className="table is-fullwidth">
                                    <thead>
                                        <tr>
                                            <th className="is-size-4">ลำดับ<button className="button" onClick={this.onRefresh}><MdRefresh /></button></th>
                                            <th className="is-size-4">เพจ</th>
                                            <th className="is-size-4">แอดมิน</th>
                                            <th className="is-size-4">เปอร์เซ็นต์</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.rankings.length > 0 && (
                                            this.state.rankings.map((rank, i) => {
                                                return (<tr key={rank.pageId} className={percentColor(rank.percent)}>
                                                    <td>{i + 1}</td>
                                                    <td>{rank.page}</td>
                                                    <td>{rank.name}</td>
                                                    <td>{Money(rank.percent, 2)}%</td>
                                                    {/* <td>{rank.price}</td>
                                                    <td>{rank.targetPerDay}</td>
                                                    <td>{rank.target100}</td> */}
                                                </tr>)
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    emails: state.manage.emails,
    targets: state.manage.targets,
    rankings: state.games.rankings
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetEmails: () => dispatch(startGetEmails()),
    startGetTargets: () => dispatch(startGetTargets()),
    startGetRankings: (targets, startDate, endDate) => dispatch(startGetRankings(targets, startDate, endDate))
});
export default connect(mapStateToProps, mapDispatchToProps)(ShowTargets);