import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { startGetTopsDay } from '../../actions/games/topdays';
import { startGetEmails } from '../../actions/manage/emails';
import { MdRefresh } from 'react-icons/md'
import moment from 'moment';
import _ from 'underscore'
moment.locale('th');
export class TopsDayPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            tops: props.tops || [],
            emails: props.emails || [],
            date: moment()
        }
        this.onDateChange = this.onDateChange.bind(this);
        this.props.startGetEmails();
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
    }
    onDateChange = (date) => {
        this.props.startGetTopsDay(moment(date).format('YYYYMMDD'))
        this.setState({
            date
        });
    }
    onRefresh = () => {
        this.props.startGetTopsDay(moment(this.state.date).format('YYYYMMDD'))
    }

    render() {
        let count = 0;
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
                            if (admin && count < 4) {
                                if (top.ytdPercent >= 50)
                                    count++;
                                return (
                                    <div className="level-item" key={top.adminId}>
                                        <div className="card">
                                            <div className="card-image">
                                                {/* <figure className="image is-128x128"> */}
                                                {top.ytdPercent >= 50
                                                    ? <img style={{ maxWidth: 200, maxHeight: 200 }} src={admin.imgUrl} onClick={() => console.log(top.pageId, top.price)} />
                                                    : <div>
                                                        <img style={{ maxWidth: 200, maxHeight: 200, opacity: '0.4' }} src={admin.imgUrl} onClick={() => console.log(top.price)} />
                                                        <div className="centered" style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                            color: 'red',
                                                            fontWeight: 'bold',
                                                            fontSize: '140%'
                                                        }}>อั้นไม่เนียน<br />ไปเรียน<br />มาใหม่!!</div>
                                                    </div>
                                                }
                                                {/* </figure> */}
                                            </div>
                                            <div className="card-content">
                                                <div className="media">
                                                    <div className="media-content">
                                                        {top.ytdPercent >= 50
                                                            ? <p className="title is-4 has-text-centered">
                                                                {count + '.'} {admin.admin}
                                                            </p>
                                                            : <p className="title is-4 has-text-centered" style={{ textDecoration: 'line-through', opacity: '0.4' }}>
                                                                {(count + 1) + '.'} {admin.admin} ({Math.round(top.ytdPercent)}%)
                                                            </p>
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
    auth: state.auth,
    emails: state.manage.emails
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetTopsDay: (date) => dispatch(startGetTopsDay(date)),
    startGetEmails: () => dispatch(startGetEmails())
});
export default connect(mapStateToProps, mapDispatchToProps)(TopsDayPage);