import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { startGetRateTopsDay } from '../../actions/games/ratetops';
import { startGetEmails } from '../../actions/manage/emails';
import { MdRefresh, MdForward10 } from 'react-icons/md'
import moment from 'moment';
import _, { isNull } from 'underscore'
import Money from '../../selectors/money'
moment.locale('th');
export class TopsDayPage extends React.Component {
    constructor(props) {
        super(props);
        const date = moment().date() > 18 ? moment('20210418') : moment()
        this.state = {
            auth: props.auth,
            rates: props.rates || [],
            emails: props.emails || [],
            date
        }
        this.onDateChange = this.onDateChange.bind(this);
        this.props.startGetRateTopsDay(date.format('YYYYMMDD'))
        this.props.startGetEmails();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth })
        }
        if (nextProps.rates != this.state.rates) {
            this.setState({ rates: nextProps.rates })
        }
        if (nextProps.emails != this.state.emails) {
            this.setState({ emails: nextProps.emails })
        }
    }
    onDateChange = (date) => {
        this.props.startGetRateTopsDay(moment(date).format('YYYYMMDD'))
        this.setState({
            date
        });
    }
    onRefresh = () => {
        this.props.startGetRateTopsDay(moment(this.state.date).format('YYYYMMDD'))
    }

    render() {
        let count = 0;
        const bonus = [500, 250, 150, 100]
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="level">
                        <div className="level-left">
                            <div className="level-item">
                                <h2 className="title">Tops SongKran Day (13-18):</h2>
                            </div>
                            <div className="level-item">
                                <DatePicker
                                    className="input has-text-centered"
                                    dateFormat="DD/MM/YYYY"
                                    placeholderText="เลือกวันที่"
                                    selected={this.state.date}
                                    minDate={new Date("2021-04-13")}
                                    maxDate={new Date("2021-04-18")}
                                    onChange={this.onDateChange}
                                // filterDate={(date) => {
                                //     return moment() > date;
                                // }}
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
                    <div className="table-container">
                        <table className="table  is-fullwidth is-hoverable">
                            <thead>
                                <tr>
                                    <th>ลำดับ</th>
                                    <th className="has-text-centered">โบนัส</th>
                                    <th className="has-text-centered">แอดมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.rates.map((top, i) => {
                                    const admin = this.state.emails.filter(f => f.adminId == top.userId && f.role == 'admin')[0];
                                    if (admin && count < 4) {
                                        count++;
                                        return (
                                            <tr key={top.userId} onClick={() => console.log(admin.admin, top)}>
                                                <td className="has-text-weight-bold">{count}</td>
                                                <td className="has-text-success has-text-weight-bold has-text-centered">{bonus[count - 1]}</td>
                                                <td className="has-text-centered">{admin.admin}</td>
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/*}   <div className="level">
                        {this.state.rates.map((top, i) => {
                            const admin = this.state.emails.filter(f => f.adminId == top.userId && f.role == 'admin')[0];
                            if (admin && count < 4) {
                                count++;
                                return (
                                    <div className="level-item" key={top.userId}>
                                        <div className="card">
                                            <div className="card-image">
                                                <img style={{ maxWidth: 200, maxHeight: 200 }} src={admin.imgUrl} onClick={() => console.log(admin.admin, top)} />
                                            </div> 
                                            <div className="card-content">
                                                <div className="media">
                                                    <div className="media-content">
                                                        <p className="title is-4 has-text-centered">
                                                            {count + '.'} {admin.admin}
                                                        </p>
                                                        <p className="is-size-4 has-text-success has-text-centered">{Money(bonus[count - 1], 0)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>*/}
                </div>
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    rates: state.games.rates,
    auth: state.auth,
    emails: state.manage.emails
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetRateTopsDay: (date) => dispatch(startGetRateTopsDay(date)),
    startGetEmails: () => dispatch(startGetEmails()),
});
export default connect(mapStateToProps, mapDispatchToProps)(TopsDayPage);