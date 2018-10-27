import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
moment.locale('th');
export class ReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(),
            endDate: moment(),
            uid: props.auth.uid
        }
        this.handleStartChange = this.handleStartChange.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
    }
    handleStartChange(date) {
        this.setState({
            startDate: date
        });
    }
    handleEndChange(date) {
        this.setState({
            endDate: date
        });
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">รายงาน</h1>

                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-half">
                        <div className="level">
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">เลือกวันที่</label>
                                    <DatePicker
                                        className="input has-text-centered"
                                        dateFormat="DD/MM/YYYY"
                                        placeholderText="เลือกวันที่"
                                        selected={this.state.startDate}
                                        onChange={this.handleStartChange}
                                    />
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">ถึงวันที่</label>
                                    <DatePicker
                                        className="input has-text-centered"
                                        dateFormat="DD/MM/YYYY"
                                        placeholderText="เลือกวันที่"
                                        selected={this.state.endDate}
                                        onChange={this.handleEndChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column">
                        <table className="table is-bordered is-striped is-fullwidth">
                            <thead>
                                <tr>
                                    <th className="has-text-centered">ลำดับ</th>
                                    <th className="has-text-centered">รายงาน</th>
                                    <th className="has-text-centered">พิมพ์</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="has-text-centered">1</td>
                                    <td className="has-text-centered">รายชื่อแพ็คของ (วันที่เริ่ม)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/report/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=pdf`}
                                                    target="_blank">
                                                    PDF
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/report/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=excel`}
                                                    target="_blank">
                                                    EXCEL
                                        </a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="has-text-centered">2</td>
                                    <td className="has-text-centered">เลขพัสดุประจำวันที่ปิดรอบ (วันที่เริ่ม)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/report/dailyTrack?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=pdf`}
                                                    target="_blank">
                                                    PDF
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/report/dailyTrack?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=excel`}
                                                    target="_blank">
                                                    EXCEL
                                        </a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="has-text-centered">3</td>
                                    <td className="has-text-centered">ยอดขายประจำวันที่สั่งซื้อ (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/report/dailySale?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYYMMDD')}&endDate=${moment(this.state.endDate).format('YYYYMMDD')}&file=pdf`}
                                                    target="_blank">
                                                    PDF
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`http://yaumjai.com:3000/api/report/dailySale?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYYMMDD')}&endDate=${moment(this.state.endDate).format('YYYYMMDD')}&file=excel`}
                                                    target="_blank">
                                                    EXCEL
                                        </a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </section>
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth
});
const mapDispatchToProps = (dispatch, props) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);