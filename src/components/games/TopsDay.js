import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { startGetTopsDay, startSetTopBan, startGetBanList } from '../../actions/games/topdays';
import { startGetEmails } from '../../actions/manage/emails';
import { MdRefresh, MdForward10 } from 'react-icons/md'
import moment from 'moment';
import _, { isNull } from 'underscore'
import Money from '../../selectors/money'
moment.locale('th');
export class TopsDayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            tops: props.tops || [],
            emails: props.emails || [],
            bans: props.bans || [],
            date: moment()
        }
        this.onDateChange = this.onDateChange.bind(this);
        this.props.startGetEmails();
        this.props.startGetBanList(moment().format('YYYYMMDD'));
        this.props.startGetTopsDay(moment().format('YYYYMMDD'));
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth })
        }
        if (nextProps.tops != this.state.tops) {
            this.setState({ tops: nextProps.tops })
            // console.log(nextProps.tops)
        }
        if (nextProps.emails != this.state.emails) {
            this.setState({ emails: nextProps.emails })
        }
        if (nextProps.bans != this.state.bans) {
            this.setState({ bans: nextProps.bans })
        }
    }
    onDateChange = (date) => {
        this.props.startGetTopsDay(moment(date).format('YYYYMMDD'))
        this.props.startGetBanList(moment(date).format('YYYYMMDD'));
        this.setState({
            date
        });
    }
    onRefresh = () => {
        this.props.startGetTopsDay(moment(this.state.date).format('YYYYMMDD'))
        this.props.startGetBanList(moment(this.state.date).format('YYYYMMDD'))
    }

    render() {
        let count = 0;
        const top4Price = this.state.tops.filter(top => {
            const ban = this.state.bans.find(ban => ban.adminId == top.adminId) || { status: null }
            return top.ytdPercent >= 50 || ban.status == true || isNull(ban.status)
        }).slice(0, 4).reduce((memo, num) => memo + num.price, 0);
        const dateNo = moment(this.state.date).date();
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="level">
                        <div className="level-left">
                            <div className="level-item">
                                <h2 className="title">Tops Day :</h2>
                            </div>
                            <div className="level-item">
                                <DatePicker
                                    className="input has-text-centered"
                                    dateFormat="DD/MM/YYYY"
                                    placeholderText="เลือกวันที่"
                                    selected={this.state.date}
                                    onChange={this.onDateChange}
                                    filterDate={(date) => {
                                        return moment() > date;
                                    }}
                                />
                            </div>
                            <div className="level-item">
                                <button className='button is-text' onClick={this.onRefresh}>
                                    <span className="icon"><MdRefresh /></span>
                                </button>
                            </div>
                        </div>
                        <div className="level-right">

                        </div>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="level">
                        {this.state.tops.map((top, i) => {
                            const admin = this.state.emails.filter(f => f.adminId == top.adminId && f.role == 'admin')[0];
                            const ban = this.state.bans.find(f => f.adminId == top.adminId) || { status: null }
                            if (admin && count < 4) {
                                if (top.ytdPercent >= 50 || ban.status == true || isNull(ban.status)) count++;
                                return (
                                    <div className="level-item" key={top.adminId}>
                                        <div className="card">
                                            <div className="card-image">
                                                {(top.ytdPercent >= 50 || ban.status == true)
                                                    ? <img style={{ maxWidth: 200, maxHeight: 200 }} src={admin.imgUrl} onClick={() => console.log(top.pageId, admin.admin, top.price)} />
                                                    : <div>
                                                        <img style={{
                                                            maxWidth: 200, maxHeight: 200,
                                                            opacity: (ban.status == true) ? '1' : '0.4'
                                                        }} src={admin.imgUrl} onClick={() => console.log(top.pageId, admin.admin, top.price)} />
                                                        <div className="has-text-centered" style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '45%',
                                                            transform: 'translate(-50%, -50%)',
                                                            color: ban.status == false ? '#EC407A' : '#F26D21',
                                                            fontWeight: 'bold',
                                                            fontSize: '130%',
                                                        }}>{
                                                                ban.status == false ? 'สู้ๆน๊าา ><"' : (
                                                                    this.state.auth.role == 'owner' ? (
                                                                        <div className="buttons">
                                                                            <button className="button is-success"
                                                                                onClick={e => this.props.startSetTopBan(moment(this.state.date).format('YYYYMMDD'),
                                                                                    { adminId: admin.adminId, status: true })}>ได้</button>
                                                                            <button className="button is-danger"
                                                                                onClick={e => this.props.startSetTopBan(moment(this.state.date).format('YYYYMMDD'),
                                                                                    { adminId: admin.adminId, status: false })}>ไม่ได้</button>
                                                                        </div>
                                                                    ) : (ban.status ? '' : <p>แจ้งหัวหน้าทีม<br />เพื่อตรวจสอบ</p>))
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className="card-content">
                                                <div className="media">
                                                    <div className="media-content">
                                                        {(top.ytdPercent >= 50)
                                                            ? <p className="title is-4 has-text-centered">
                                                                {count + '.'} {admin.admin}
                                                            </p>
                                                            : <p className="title is-4 has-text-centered" style={{ textDecoration: ((ban.status || isNull(ban.status)) ? '' : 'line-through'), opacity: ban.status ? '1' : '0.4' }}>
                                                                {((ban.status || isNull(ban.status)) ? count : count + 1) + '.'} {admin.admin} ({Math.round(top.ytdPercent)}%)
                                                            </p>
                                                        }
                                                        {((ban.status || isNull(ban.status)) && moment(this.state.date).isAfter('20210201')) &&
                                                            <p className="is-size-4 has-text-success has-text-centered">{(dateNo <= 10) ? Money(top.price / top4Price * 350, 0) : count == 1 ? 100 : ''}</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    tops: state.games.tops,
    bans: state.games.bans,
    auth: state.auth,
    emails: state.manage.emails
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetTopsDay: (date) => dispatch(startGetTopsDay(date)),
    startGetEmails: () => dispatch(startGetEmails()),
    startSetTopBan: (date, adminId, status) => dispatch(startSetTopBan(date, adminId, status)),
    startGetBanList: (date) => dispatch(startGetBanList(date))
});
export default connect(mapStateToProps, mapDispatchToProps)(TopsDayPage);