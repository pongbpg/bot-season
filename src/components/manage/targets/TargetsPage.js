import React from 'react';
import { connect } from 'react-redux';
import { startGetEmails } from '../../../actions/manage/emails';
import { startGetAdmins } from '../../../actions/manage/admins';
import { startGetTargets, startAddTarget, startUpdateTarget, startRemoveTarget } from '../../../actions/manage/targets';
import { MdDelete } from 'react-icons/md'
import NumberFormat from 'react-number-format';
import Money from '../../../selectors/money';
import moment from 'moment';
import _ from 'underscore'
moment.locale('th');
export class TargetsPage extends React.Component {
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
            lists: [],
            action: {},
            teams: this.initTeams(props.pages, []),
            team: '',
            daysInMonth: moment().daysInMonth()
        }
        this.props.startGetEmails();
        this.props.startGetTargets();
        this.props.startGetAdmins();
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
    initTeams(pages, lists) {
        return _.chain(pages.filter(f => _.pluck(lists, 'page').indexOf(f.id) == -1))
            .groupBy('team')
            .map((t, i) => i)
            .value()
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth })
        }
        if (nextProps.admins != this.state.admins) {
            this.setState({ admins: nextProps.admins })
        }
        if (nextProps.pages != this.state.pages) {
            // console.log( )
            this.setState({ pages: nextProps.pages, teams: this.initTeams(nextProps.pages, this.state.lists) })
        }
        if (nextProps.emails != this.state.emails) {
            this.setState({ emails: nextProps.emails })
        }
        if (nextProps.targets != this.state.targets) {
            this.setState({
                targets: nextProps.targets,
                lists: this.initList(nextProps.targets, moment().year(), moment().month())
            })
        }
    }

    onYearChange = (e) => {
        const year = e.target.value;
        this.setState({ year, month: '', lists: [] })
    }
    onMonthChange = (e) => {
        const months = this.state.targets.filter(f => f.id == this.state.year)
        this.setState({
            month: e.target.value,
            lists: this.initList(this.state.targets, this.state.year, e.target.value)
        })
    }
    onTargetClick = (page, type) => {
        this.setState({
            action: { ...this.state.lists.find(f => f.page == page), type }
        })
    }


    render() {
        const pickerLang = {
            months: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
            from: 'จาก', to: 'ถึง',
        }
        const lastConfig = this.state.targets.filter(f => f.team == this.state.team)
        console.log(lastConfig)

        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="columns is-centered">
                        <div className="column is-full">
                            <div className="container">
                                <div className="columns">
                                    <div className="column is-8">
                                        <span className="title">จัดการเป้ายอดขาย</span>
                                    </div>
                                    <div className="column is-4">
                                        <div className="control select">
                                            <select value={this.state.year} onChange={this.onYearChange}>
                                                <option value=''>ปี</option>
                                                {this.state.targets.length > 0 && (
                                                    this.state.targets.map(target => {
                                                        return (<option key={target.id} value={target.id}>{Number(target.id) + 543}</option>)
                                                    })
                                                )}
                                            </select>
                                        </div>
                                        &nbsp;
                                        <div className="control select">
                                            <select value={this.state.month} onChange={this.onMonthChange}>
                                                <option>เดือน</option>
                                                {this.state.year != '' && pickerLang.months.map((month, i) => {
                                                    return (<option key={i} value={i}>{month}</option>)
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="field is-horizontal">

                        <div className="field-body">
                            <div className="field">
                                <div className="control select">
                                    <select value={this.state.team} onChange={e => this.setState({ team: e.target.value })}>
                                        <option value=''>ทีมทั้งหมด</option>
                                        {this.state.teams.length > 0 &&
                                            this.state.teams.map(team => {
                                                return <option key={team} value={team}>{team}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="field">
                                <div className="control select">
                                    <select value={this.state.page} onChange={e => this.setState({ page: e.target.value })}>
                                        <option value=''>เลือกเพจ</option>
                                        {this.state.pages.filter(f => (_.pluck(this.state.lists, 'page').indexOf(f.id) == -1) && f.team == this.state.team)
                                            .map(page => {
                                                return (<option key={page.id} value={page.id}>{page.id}</option>)
                                            })}
                                    </select>
                                </div>
                            </div>
                            <div className="field">
                                <div className="control select">
                                    <select value={this.state.admin} onChange={e => this.setState({ admin: e.target.value })}>
                                        <option value=''>เลือกแอดมิน</option>
                                        {this.state.admins
                                            .map(admin => {
                                                return (<option key={admin.userId} value={admin.userId}>{admin.name}</option>)
                                            })}
                                    </select>
                                </div>
                            </div>
                            <div className="field">
                                <NumberFormat className="input is-rounded is-link has-text-right" thousandSeparator={true}
                                    value={this.state.target}
                                    placeholder="เป้ายอดขาย"
                                    onValueChange={(values) => {
                                        const { formattedValue, value, floatValue } = values;
                                        // formattedValue = $2,223
                                        // value ie, 2223
                                        // console.log(formattedValue)
                                        this.setState({
                                            target: floatValue
                                        })
                                    }}

                                />
                            </div>
                            <div className="field">
                                <button className="button is-info" disabled={this.state.page == '' || this.state.admin == ''}
                                    onClick={() => {
                                        this.props.startAddTarget(this.state.year, this.state.month, {
                                            team: this.state.team,
                                            page: this.state.page,
                                            target: this.state.target,
                                            userId: this.state.admin,
                                            name: this.state.admins.find(f => f.userId == this.state.admin).name,
                                            comId: this.state.admins.find(f => f.userId == this.state.admin).comId || 0
                                        }).then(() => this.setState({ page: '', target: '', admin: '' }))
                                    }}>เพิ่ม</button>
                            </div>
                        </div>
                    </div>

                    <div className="columns is-centered">
                        <div className="column is-full">
                            <div className="table-container">
                                <table className="table is-fullwidth">
                                    <thead>
                                        <tr>
                                            <th>ลำดับ</th>
                                            <th>ทีม</th>
                                            <th>เพจ</th>
                                            <th>แอดมิน</th>
                                            <th>เป้าหมาย</th>
                                            <th>เฉลี่ย/วัน</th>
                                            <th>ลบ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.lists.length > 0 && (
                                            this.state.lists.filter(f => f.team == this.state.team || this.state.team == '').map((list, i) => {
                                                let currentValue = list.target;
                                                return (<tr key={list.page}>
                                                    <td>{i + 1}</td>
                                                    <td>{list.team}</td>
                                                    <td>{list.page}</td>
                                                    <td>
                                                        {(list.page == this.state.action.page && this.state.action.type == 'ADMIN')
                                                            ? <div className="control select is-danger">
                                                                <select value={list.userId} onChange={e => {
                                                                    const admin = this.state.admins.find(f => f.userId == e.target.value);
                                                                    if (admin.userId != this.state.action.userId) {
                                                                        if (confirm(this.state.action.page + ' ต้องการเปลี่ยนผู้ดูแลเป็น ' + admin.name + '?')) {
                                                                            const adminPick = { ..._.pick(admin, 'name', 'userId', 'comId') }

                                                                            this.setState({
                                                                                action: {}
                                                                            })
                                                                            this.props.startUpdateTarget(this.state.year, this.state.month, { page: this.state.action.page, ...adminPick })
                                                                        }
                                                                    } else {
                                                                        this.setState({ action: {} })
                                                                    }
                                                                }}>
                                                                    {this.state.admins.length > 0 && this.state.admins.map((admin, i) => {
                                                                        // console.log(admin)
                                                                        return (<option key={i} value={admin.userId}>{admin.name}</option>)
                                                                    })}
                                                                </select>
                                                            </div>
                                                            : <button className="button is-rounded" onClick={e => this.onTargetClick(list.page, 'ADMIN')}>{list.name}</button>
                                                        }
                                                    </td>
                                                    <td>
                                                        {(list.page == this.state.action.page && this.state.action.type == 'TARGET')
                                                            ? <NumberFormat className="input is-rounded is-link has-text-right" thousandSeparator={true}
                                                                value={this.state.action.target}
                                                                onValueChange={(values) => {
                                                                    const { formattedValue, value, floatValue } = values;
                                                                    // formattedValue = $2,223
                                                                    // value ie, 2223
                                                                    // console.log(formattedValue)
                                                                    currentValue = floatValue;
                                                                }}
                                                                onKeyPress={e => {
                                                                    if (e.key === 'Enter') {
                                                                        console.log(e.target.value, currentValue)
                                                                        if (confirm(this.state.action.page + ' ต้องการบันทึกเป้ายอดขาย ' + e.target.value + '?')) {
                                                                            this.setState({
                                                                                action: {}
                                                                            })
                                                                            this.props.startUpdateTarget(this.state.year, this.state.month, { page: this.state.action.page, target: currentValue })

                                                                        } else {
                                                                            this.setState({
                                                                                action: {}
                                                                            })
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            : (<button className="button is-rounded" onClick={e => this.onTargetClick(list.page, 'TARGET')}>{Money(list.target, 0)}</button>)
                                                        }
                                                    </td>
                                                    <td>{Money(list.target / this.state.daysInMonth, 2)}</td>
                                                    <td><button className="button is-text is-medium" onClick={e => {
                                                        if (confirm('ต้องการลบเป้ายอดขาย ' + list.page + '?')) {
                                                            this.props.startRemoveTarget(this.state.year, this.state.month, list)
                                                        }
                                                    }}><MdDelete /></button></td>
                                                </tr>)
                                            })
                                        )}
                                        {(this.state.team != '' && this.state.lists.filter(f => f.team == this.state.team).length == 0) &&
                                            <tr>
                                                <td colSpan={7} className="has-text-centered">
                                                    <button className="button is-link is-large"
                                                        disabled={lastConfig}>{lastConfig ? 'ไม่มีการตั้งค่าล่าสุด' : 'โหลดการตั้งค่าล่าสุด'}</button>
                                                </td>
                                            </tr>
                                        }

                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colSpan={4}>รวม</th>
                                            <th>{Money(this.state.lists.filter(f => f.team == this.state.team || this.state.team == '').reduce((le, ri) => le + ri.target, 0), 0)}</th>
                                            <th>{Money((this.state.lists.filter(f => f.team == this.state.team || this.state.team == '').reduce((le, ri) => le + ri.target, 0) / this.state.daysInMonth), 2)}</th>
                                            <th></th>
                                        </tr>
                                    </tfoot>
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
    admins: state.manage.admins.filter(f => f.active),
    pages: state.pages.filter(f => f.active).sort((a, b) => a.team > b.team ? 1 : -1)
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetEmails: () => dispatch(startGetEmails()),
    startGetTargets: () => dispatch(startGetTargets()),
    startGetAdmins: () => dispatch(startGetAdmins()),
    startAddTarget: (year, month, target) => dispatch(startAddTarget(year, month, target)),
    startUpdateTarget: (year, month, target) => dispatch(startUpdateTarget(year, month, target)),
    startRemoveTarget: (year, month, target) => dispatch(startRemoveTarget(year, month, target))
});
export default connect(mapStateToProps, mapDispatchToProps)(TargetsPage);