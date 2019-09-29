import React from 'react';
import { connect } from 'react-redux';
import { startGetCods, startUpdateCod, startAddCods, startClearCods } from '../../actions/finances/cod';
import DatePicker from 'react-datepicker';
import Money from '../../selectors/money';
import { FaSearch } from 'react-icons/fa';
import readXlsxFile from 'read-excel-file'
import moment from 'moment';
moment.locale('th');
export class CodPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: props.auth,
            tracking: '',
            col: 2,
            checkAll: false,
            cods: props.cods || [],
            date: moment()
        }
        this.props.startGetCods(moment().format('YYYYMMDD'))
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth != this.state.auth) {
            this.setState({ auth: nextProps.auth });
        }
        if (nextProps.cods != this.state.cods) {
            this.setState({ cods: nextProps.cods });
        }
    }

    onTrackingChange = (e) => {
        const tracking = e.target.value.toUpperCase();
        this.setState({ tracking })
    }
    onUploadClick = (e) => {

    }
    onCancelClick = (e) => {

    }
    onDateChange = (date) => {
        this.setState({ date, checkAll: false })
        this.props.startGetCods(moment(date).format('YYYYMMDD'))
    }
    onColChange = (e) => {
        this.setState({ col: Number(e.target.value) })
        // console.log(Number(e.target.value))
    }
    onCheckClick = (e) => {
        const check = e.target.checked;
        let cods = this.state.cods.map(m => {
            if (m.id !== e.target.name) return m
            return { ...m, received: check }
        })
        this.props.startUpdateCod({ id: e.target.name, received: check })
        this.setState({ cods })
    }
    onCheckAll = (e) => {
        const checkAll = e.target.checked;
        let cods = this.state.cods.map(m => {
            this.props.startUpdateCod({ id: m.id, received: m.return ? false : checkAll })
            return {
                ...m,
                received: m.return ? false : checkAll
            }
        })
        this.setState({ cods, checkAll })
    }
    onFileChange = (e) => {
        // console.log(e.target.files[0])
        this.props.startClearCods();
        this.setState({ checkAll: false })
        readXlsxFile(e.target.files[0])
            .then((rows) => {
                if (rows.length > 0) {
                    let qrcodes = [];
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i][this.state.col] != null) {
                            // if (qrcodes.length <= 100)
                            qrcodes.push(rows[i][this.state.col])
                            // else {
                            //     alert('สามารถอัพโหลดได้ทีละ 100 เลขพัสดุเท่านั้น!')
                            //     break;
                            // }
                        }
                    }
                    this.props.startAddCods(qrcodes)
                }
            })
            .catch((errors) => {
                console.log('upload file', errors)
                alert('ไฟล์ที่อัพไม่ถูกต้อง กรุณาตรวจสอบต้องเป็น Excel เท่านั้น!')
                this.setState({ cods: [] })
            })

    }
    render() {
        let sumPrice = 0;
        let sumRev = 0;
        let sumNotRev = 0;
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h2 className="title">COD ชำระเงินปลายทาง</h2>
                    </div>
                    <div className="column is-full">
                        <div className="level">
                            <div className="level-item">
                                <input className="file" type="file" onClick={e => (e.target.value = null)} onChange={this.onFileChange} />
                                <select onChange={this.onColChange} value={this.state.col}>
                                    <option value="0">1</option>
                                    <option value="1">2</option>
                                    <option value="2">3</option>
                                </select>
                            </div>
                        </div>
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
                        <div className="columns">
                            <div className="column is-centered">
                                <table className="table is-fullwidth is-striped is-narrow">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>ID</th>
                                            <th>เลขพัสดุ</th>
                                            <th>ลูกค้า</th>
                                            <th>ยอดเงิน</th>
                                            <th>โอนแล้ว</th>
                                            <th>ค้างชำระ</th>
                                            <th>ทั้งหมด<input type="checkbox" name="checkAll" checked={this.state.checkAll} onChange={this.onCheckAll} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.cods.length > 0 ?
                                            this.state.cods.map((cod, i) => {
                                                sumPrice += cod.price;
                                                sumRev += cod.received ? cod.price : 0;
                                                sumNotRev += !cod.received ? cod.price : 0;
                                                return (
                                                    <tr key={cod.id}>
                                                        <td>{i + 1}</td>
                                                        <td>{cod.id}</td>
                                                        <td>{cod.tracking}</td>
                                                        <td>{cod.name + ' ' + cod.page}</td>
                                                        <td>{Money(cod.price, 0)}</td>
                                                        <td>{cod.received && Money(cod.price, 0)}</td>
                                                        <td>{!cod.received && Money(cod.price, 0)}</td>
                                                        <td><input type="checkbox" name={cod.id} disabled={cod.return} checked={cod.received ? true : false} onChange={this.onCheckClick} /></td>
                                                    </tr>
                                                )
                                            })
                                            : <tr>
                                                <td colSpan="8" className="has-text-centered">ไม่มีรายการ</td>
                                            </tr>
                                        }
                                        <tr>
                                            <td colSpan="4">รวม</td>
                                            <td>{Money(sumPrice, 0)}</td>
                                            <td>{Money(sumRev, 0)}</td>
                                            <td>{Money(sumNotRev, 0)}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* <div className="level">
                            <div className="level-item has-text-centered">
                                <div className="columns">
                                    <div className="column is-4">
                                        <label className="subtitle">Tracking No:</label>
                                    </div>
                                    <div className="column is-8">
                                        <input type="text" name="trackingno" className="input has-text-centered" style={{ width: '20em' }}
                                            onChange={this.onTrackingChange} value={this.state.tracking} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="level">
                            <div className="level-item has-text-centered">

                                <button className="button is-info"><FaSearch />ค้นหา</button>
                            </div>
                        </div> */}
                    </div>
                </div >
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
    auth: state.auth,
    cods: state.cods.sort((a, b) => a.tracking > b.tracking ? 1 : -1)
});
const mapDispatchToProps = (dispatch, props) => ({
    startAddCods: (qrcodes) => dispatch(startAddCods(qrcodes)),
    startClearCods: () => dispatch(startClearCods()),
    startGetCods: (date) => dispatch(startGetCods(date)),
    startUpdateCod: (cod) => dispatch(startUpdateCod(cod))
});
export default connect(mapStateToProps, mapDispatchToProps)(CodPage);