import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import selectPages from '../selectors/pages';
import moment from 'moment';
moment.locale('th');
export class ReportPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(),
            endDate: moment(),
            uid: props.auth.uid,
            sum: 'daily',
            auth: props.auth,
            pages: props.pages,
            payment: 'ALL',
            cost: 'admin',
            groupBy: 'cutoff',
            page: (['owner', 'stock'].indexOf(props.auth.role) > -1 ? 'ALL' : props.pages[0].id),
            range: 'today'
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
    onSumChange = (e) => {
        this.setState({ sum: e.target.value })
    }
    handlePageChange = (e) => {
        this.setState({
            page: e.target.value
        })
        // console.log(e.target.value)
    }
    handleCostChange = (e) => {
        this.setState({
            cost: e.target.value
        })
        // console.log(e.target.value)
    }
    handlePaymentChange = (e) => {
        this.setState({ payment: e.target.value })
    }
    handleGroupByChange = (e) => {
        this.setState({ groupBy: e.target.value })
    }
    onRangeChange = (e) => {
        let starDate = moment();
        let endDate = moment();
        const range = e.target.value;
        switch (range) {
            case 'yesterday':
                starDate = moment().subtract('1', 'days')
                endDate = moment().subtract('1', 'days')
                break;
            case '7days':
                starDate = moment().subtract('7', 'days')
                endDate = moment().subtract('1', 'days')
                break;
            case 'thismonth1':
                starDate = moment().startOf('month');
                endDate = moment().subtract('1', 'days')
                break;
            case 'thismonth2':
                starDate = moment().startOf('month');
                break;
            case 'lastmonth':
                starDate = moment().startOf('month').subtract('1', 'months');
                endDate = moment().subtract('1', 'months').endOf('month');
                break;
        }
        this.setState({
            range
        }, this.handleStartChange(starDate)
            , this.handleEndChange(endDate))
    }
    render() {
        // console.log('pages', this.state.pages)
        const rptUri = 'http://rpt.topslimstore.com';
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">รายงาน</h1>

                    </div>
                </div>
                <div className="columns is-mobile is-centered">
                    <div className="column is-8">
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
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">ช่วงเวลา</label>
                                    <div className="select">
                                        <select selected={this.state.range} onChange={this.onRangeChange}>
                                            <option value="today">วันนี้</option>
                                            <option value="yesterday">เมื่อวาน</option>
                                            <option value="7days">7 วันที่แล้ว</option>
                                            <option value="thismonth1">เดือนนี้ถึงเมื่อวาน</option>
                                            <option value="thismonth2">เดือนนี้</option>
                                            <option value="lastmonth">เดือนที่แล้ว</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="level-item has-text-centered">
                                <div className="field">
                                    <label className="label">ยอดรวม</label>
                                    <div className="select">
                                        <select selected={this.state.sum} onChange={this.onSumChange}>
                                            <option value="daily">รายวัน</option>
                                            <option value="all">ทั้งหมด</option>
                                        </select>
                                    </div>
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
                                    <td className="has-text-centered">รายชื่อแพ็คของ (วันที่เริ่ม)
                                    <select className="select is-info"
                                            onChange={this.handlePaymentChange}
                                            value={this.state.payment}>
                                            <option value='ALL'>ทั้งหมด</option>
                                            <option value='BANK'>โอนเงิน</option>
                                            <option value='COD'>COD</option>
                                        </select>
                                    </td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=pdf&country=TH&payment=${this.state.payment}`}
                                                    target="_blank">
                                                    PDF
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=excel&country=TH&payment=${this.state.payment}`}
                                                    target="_blank">
                                                    EXCEL
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-warning is-centered is-small"
                                                    href={`${rptUri}/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=flash&country=TH&payment=${this.state.payment}`}
                                                    target="_blank">
                                                    FLASH
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=jt&country=TH&payment=${this.state.payment}`}
                                                    target="_blank">
                                                    J&T
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/delivery?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=ninja&country=TH&payment=${this.state.payment}`}
                                                    target="_blank">
                                                    NINJA
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
                                                    href={`${rptUri}/dailyTrack?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=pdf`}
                                                    target="_blank">
                                                    PDF
                                        </a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/dailyTrack?startDate=${moment(this.state.startDate).format('YYYYMMDD')}&file=excel`}
                                                    target="_blank">
                                                    EXCEL
                                        </a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="has-text-centered">3</td>
                                    <td className="has-text-centered">ยอดทักประจำวันที่สั่งซื้อ (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/dailySayHi?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/dailySayHi?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                            {/* <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/dailySayHi?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p> */}
                                        </div>
                                    </td>
                                </tr>
                                {['stock', 'owner', 'marketing'].indexOf(this.state.auth.role) > -1 && (
                                    <tr>
                                        <td className="has-text-centered">4</td>
                                        <td className="has-text-centered">
                                            ยอดขายสินค้าเพจ&nbsp;
                                            <select className="select is-info"
                                                onChange={this.handlePageChange}
                                                value={this.state.page}>
                                                {['stock', 'owner'].indexOf(this.state.auth.role) > -1 && (<option value="ALL">ทุกเพจ</option>)}
                                                {this.state.pages.map(page => {
                                                    return <option key={page.id}
                                                        value={page.id}>{page.id + ':' + page.admin}</option>
                                                })}
                                            </select>
                                            &nbsp;(วันที่เริ่ม-ถึงวันที่)
                                        </td>
                                        <td className="has-text-centered">
                                            <div className="field is-grouped is-grouped-centered">
                                                <p className="control">
                                                    <a className="button is-danger is-centered is-small"
                                                        href={`${rptUri}/dailyProduct?uid=${this.state.uid}&page=${this.state.page}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf&sum=${this.state.sum}`}
                                                        target="_blank">
                                                        PDF</a>
                                                </p>
                                                <p className="control">
                                                    <a className="button is-success is-centered is-small"
                                                        href={`${rptUri}/dailyProduct?uid=${this.state.uid}&page=${this.state.page}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel&sum=${this.state.sum}`}
                                                        target="_blank">
                                                        EXCEL</a>
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                                {['owner'].indexOf(this.state.auth.role) > -1 && (< tr >
                                    <td className="has-text-centered">5</td>
                                    <td className="has-text-centered">รายงานขายสินค้าของ Admin (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/item/admin?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/item/admin?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                )}
                                {['stock', 'owner'].indexOf(this.state.auth.role) > -1 && (< tr >
                                    <td className="has-text-centered">6</td>
                                    <td className="has-text-centered">ยอดโอนแต่ละธนาคาร (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/dailyBank?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/dailyBank?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                )}
                                {['stock', 'owner'].indexOf(this.state.auth.role) > -1 && (< tr >
                                    <td className="has-text-centered">7</td>
                                    <td className="has-text-centered">ยอดเก็บเงินปลายทาง COD (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/dailyCod?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/dailyCod?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                )}
                                {['owner', 'stock'].indexOf(this.state.auth.role) > -1 && (< tr >
                                    <td className="has-text-centered">8</td>
                                    <td className="has-text-centered">STATEMENTการโอนแต่ละธนาคาร (วันที่เริ่ม-ถึงวันที่)
                                    <select className="select is-info"
                                            onChange={this.handleGroupByChange}
                                            value={this.state.groupBy}>
                                            <option value='cutoff'>รอบส่งของ</option>
                                            <option value='day'>รอบวันขาย</option>
                                        </select></td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/statement?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf&groupBy=${this.state.groupBy}`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/statement?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel&groupBy=${this.state.groupBy}`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                )}
                                {['owner'].indexOf(this.state.auth.role) > -1 && (< tr >
                                    <td className="has-text-centered">9</td>
                                    <td className="has-text-centered">ค่าคอมฯ และ ค่าใช้จ่าย&nbsp;
                                    <select className="select is-info"
                                            onChange={this.handleCostChange}
                                            value={this.state.cost}>
                                            <option value="admin">แอดมิน</option>
                                            <option value="page">เพจ</option>
                                        </select>
                                    </td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/com/${this.state.cost}?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/com/${this.state.cost}?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                )}

                                {['owner'].indexOf(this.state.auth.role) > -1 && (< tr >
                                    <td className="has-text-centered">10</td>
                                    <td className="has-text-centered">กำไรขาดทุนแต่ละเพจ (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/dailyCost?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/dailyCost?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                )}

                                {['owner', 'marketing'].indexOf(this.state.auth.role) > -1 && (< tr >
                                    <td className="has-text-centered">11</td>
                                    <td className="has-text-centered">ยอดขายแยกช่องทางโฆษณา (วันที่เริ่ม-ถึงวันที่)</td>
                                    <td className="has-text-centered">
                                        <div className="field is-grouped is-grouped-centered">
                                            <p className="control">
                                                <a className="button is-danger is-centered is-small"
                                                    href={`${rptUri}/dailyChannel?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=pdf&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    PDF</a>
                                            </p>
                                            <p className="control">
                                                <a className="button is-success is-centered is-small"
                                                    href={`${rptUri}/dailyChannel?uid=${this.state.uid}&startDate=${moment(this.state.startDate).format('YYYY-MM-DD')}&endDate=${moment(this.state.endDate).format('YYYY-MM-DD')}&file=excel&sum=${this.state.sum}`}
                                                    target="_blank">
                                                    EXCEL</a>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </section>
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    pages: state.pages//selectPages(state.pages, state.auth)
});
const mapDispatchToProps = (dispatch, props) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(ReportPage);