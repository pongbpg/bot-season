import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startListOrders, startSaveTracking, startUploadTracks } from '../actions/orders';
import filterOrders from '../selectors/orders';
import { FaSearch } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import Money from '../selectors/money';
import NumberFormat from 'react-number-format';
import readXlsxFile from 'read-excel-file'
import moment from 'moment';
moment.locale('th');
export class OrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: props.orders || [],
            search: '',
            tracks: [],
            expressName: '',
            expressLink: '',
            expresses: [
                { expressName: 'ALPHA FAST', expressLink: 'https://www.alphafast.com/th/track-alpha' },
                { expressName: 'EMS', expressLink: 'http://track.thailandpost.co.th/tracking/default.aspx' },
                { expressName: 'FLASH', expressLink: 'https://www.flashexpress.co.th/tracking/' },
                { expressName: 'KERRY', expressLink: 'https://th.kerryexpress.com/th/track/?track' }
            ]
        }
        this.props.startListOrders();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.orders.length != this.state.orders.length) {
            this.setState({ orders: nextProps.orders });
        }
    }
    onExpressChange = (e) => {
        const expressName = e.target.value;
        let expressLink = '';
        // console.log(expressName)
        if (expressName != "") {
            expressLink = this.state.expresses.find(f => f.expressName === expressName).expressLink
        }
        this.setState({ expressName, expressLink })
    }
    onTrackingChange = (e) => {
        if (this.state.expressName != "") {
            const index = this.state.orders.findIndex(f => f.id === e.target.name);
            const tracking = e.target.value.toUpperCase().replace(/\s/g, '');
            if (index === -1) {

            } else {
                let orders = this.state.orders.slice();
                orders[index] = { ...orders[index], tracking, expressName: this.state.expressName, expressLink: this.state.expressLink };
                this.setState({ orders })
            }
        } else {
            alert('กรุณาเลือกขนส่งก่อนครับ')
        }
    }
    onFreightChange = (e) => {
        if (this.state.expressName != "") {
            const index = this.state.orders.findIndex(f => f.id === e.target.name);
            const freight = Number(e.target.value);
            if (index === -1) {

            } else {
                let orders = this.state.orders.slice();
                orders[index] = { ...orders[index], freight, expressName: this.state.expressName, expressLink: this.state.expressLink };
                this.setState({ orders })

                // console.log({ ...orders[index] })
            }
        } else {
            alert('กรุณาเลือกขนส่งก่อนครับ')
        }
    }
    onFeeChange = (e) => {
        if (this.state.expressName != "") {
            const index = this.state.orders.findIndex(f => f.id === e.target.name);
            const codFee = Number(e.target.value);
            if (index === -1) {

            } else {
                let orders = this.state.orders.slice();
                orders[index] = { ...orders[index], codFee, expressName: this.state.expressName, expressLink: this.state.expressLink };
                this.setState({ orders })
            }
        } else {
            alert('กรุณาเลือกขนส่งก่อนครับ')
        }
    }
    onSaveTracking = () => {
        if (this.state.expressName != "") {
            const orders = this.state.orders.filter(f => f.tracking !== '' && f.freight >= 0);
            this.props.startSaveTracking(orders);
            // console.log(orders)
        } else {
            alert('กรุณาเลือกขนส่งก่อนครับ')
        }
    }
    onSearchChange = (e) => {
        // console.log(e.target.value)
        this.setState({ search: e.target.value })
    }
    onFileChange = (e) => {
        if (this.state.expressName != "") {
            readXlsxFile(e.target.files[0])
                .then((rows) => {
                    // console.log(rows)
                    let tracks = [];
                    const colId = rows[0].findIndex(f => f == 'Order No.');
                    const colTack = rows[0].findIndex(f => f == 'Tracking No.');
                    const colFreight = rows[0].findIndex(f => f == 'Freight');
                    const colCodFee = rows[0].findIndex(f => f == 'COD fee');
                    const colTotalCharge = rows[0].findIndex(f => f == 'Total charge');
                    const colCodAmt = rows[0].findIndex(f => f == 'COD Amt');
                    // console.log(colId, colTack)
                    if (rows.length > 0) {
                        for (var row in rows) {
                            if (rows[row][colId] != '' && rows[row][colId] != null && rows[row][colTack] != null) {
                                if (rows[row][colId].replace(/\s/g, '').length == 18)
                                    tracks.push({
                                        tracking: rows[row][colTack].replace(/\s/g, ''),
                                        id: rows[row][colId].replace(/\s/g, ''),
                                        expressName: this.state.expressName,
                                        expressLink: this.state.expressLink,
                                        freight: Number(rows[row][colFreight]),
                                        codFee: Number(rows[row][colCodFee]),
                                        totalFreight: Number(rows[row][colTotalCharge]),
                                        codAmount: Number(rows[row][colCodAmt])
                                    })
                            }
                        }
                    }
                    if (tracks.length == 0) {
                        alert('ไม่มีข้อมูล กรุณาตรวจสอบไฟล์ Excel')
                    }
                    this.setState({ tracks })
                    console.log(tracks)
                })
                .catch((errors) => {
                    console.log('upload file', errors)
                    alert('ไฟล์ที่อัพไม่ถูกต้อง กรุณาตรวจสอบต้องเป็น Excel เท่านั้น!')
                    this.setState({ tracks: [] })
                })
        } else {
            alert('กรุณาเลือกขนส่งก่อนครับ')
        }
    }
    onUploadClick = (e) => {
        if (this.state.expressName != "") {
            if (confirm('คุณยืนยันที่จะอัพโหลดไฟล์เลขพัสดุ?')) {
                if (this.state.tracks.length > 0) {
                    this.props.startUploadTracks(this.state.tracks)
                    this.setState({ tracks: [] })
                    // .then((res) => {
                    //     // alert('อัพโหลดเรียบร้อย^^')
                    //     console.log(res)
                    // })
                } else {
                    alert('ไม่มีข้อมูล! กรุณาตรวจสอบไฟล์ Excel')
                }
            }
        } else {
            alert('กรุณาเลือกขนส่งก่อนครับ')
        }
    }
    onCancelClick = (e) => {
        this.setState({ tracks: [] })
    }
    handleSelectAll = (e) => {
        e.target.select()
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">บันทึกเลขพัสดุ</h1>
                        {/* <h2 className="subtitle">Hero subtitle</h2> */}
                    </div>
                </div>

                <nav className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <Link to="/orders/edit" className="button"><h1 className="sub-title"><MdEdit />แก้ไข</h1></Link>
                        </div>
                        {this.state.tracks.length == 0
                            ? <input type="file" onChange={this.onFileChange} />
                            : <div className="level">
                                <div className="level-item">
                                    <h3 className="subtitle">
                                        เลขพัสดุจำนวน {this.state.tracks.length} รายการ
                                </h3>
                                </div>
                                <div className="level-item">
                                    <div className="field is-grouped is-grouped-centered">
                                        <div className="control">
                                            <button className="button is-link" onClick={this.onUploadClick}>อัพโหลด</button>
                                        </div>
                                        <div className="control">
                                            <button className="button is-text" onClick={this.onCancelClick}>ยกเลิก</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        }
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <div className="select">
                                <select selected={this.state.express} onChange={this.onExpressChange}>
                                    <option value="">เลือกขนส่ง</option>
                                    <option value="ALPHA FAST">ALPHA</option>
                                    <option value="EMS">EMS</option>
                                    <option value="FLASH">FLASH</option>
                                    <option value="KERRY">KERRY</option>
                                </select>
                            </div>
                        </div>
                        <div className="level-item">
                            <div className="control has-icons-right">
                                <input className="input" type="text" placeholder="ค้นหา"
                                    value={this.state.search}
                                    onChange={this.onSearchChange}
                                />
                                <span className="icon is-small is-right">
                                    <FaSearch />
                                </span>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="container">
                    <table className="table is-bordered is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th className="has-text-centered">ลำดับ</th>
                                <th className="has-text-centered">รหัสสั่งซื้อ</th>
                                <th className="has-text-centered">วันที่ปิดรอบ</th>
                                <th className="has-text-centered">ชื่อลูกค้า</th>
                                <th className="has-text-centered">เพจ</th>
                                <th className="has-text-right">ยอดโอน</th>
                                {/* <th className="has-text-centered">Admin</th> */}
                                <th className="has-text-centered">เลขพัสดุ</th>
                                <th className="has-text-centered">ค่าส่ง</th>
                                <th className="has-text-centered">3%</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.orders.length > 0 ?
                                filterOrders(this.state.orders, this.state.search).map((order, i) => {
                                    return <tr key={order.id}>
                                        <td className="has-text-centered">{++i}</td>
                                        <td className="has-text-centered">{order.id}</td>
                                        <td className="has-text-centered">{moment(order.cutoffDate).format('Do MMM YY')}</td>
                                        <td className="has-text-centered">{order.name.substr(0, 20)}</td>
                                        <td className="has-text-centered">{order.page}</td>
                                        <td className="has-text-right">{Money(order.price)}</td>
                                        {/* <td className="has-text-centered">{order.admin}</td> */}
                                        <td className="has-text-centered">
                                            <div className="field">
                                                <div className="control">
                                                    <input type="text" name={order.id}
                                                        className="input is-rounded is-small has-text-centered"
                                                        value={order.tracking}
                                                        onChange={this.onTrackingChange} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="has-text-centered">
                                            <div className="field">
                                                <div className="control">
                                                    {/* <input type="text" name={order.id}
                                                        className="input is-rounded is-small has-text-centered"
                                                        value={order.freight}
                                                        onChange={this.onFreightChange} /> */}
                                                    <NumberFormat className="input is-rounded has-text-right" thousandSeparator={true}
                                                        value={order.freight}
                                                        onFocus={this.handleSelectAll}
                                                        onValueChange={(values) => {
                                                            const { formattedValue, value, floatValue } = values;
                                                            let orders = this.state.orders.slice();
                                                            const index = orders.findIndex(f => f.id == order.id)
                                                            const freight = floatValue || 0;
                                                            if (index === -1) {

                                                            } else {
                                                                let orders = this.state.orders.slice();
                                                                orders[index] = {
                                                                    ...orders[index], freight,
                                                                    expressName: this.state.expressName,
                                                                    expressLink: this.state.expressLink
                                                                };
                                                                this.setState({ orders })
                                                            }
                                                        }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="has-text-centered">
                                            <div className="field">
                                                <div className="control">
                                                    {/* <input type="text" name={order.id}
                                                        className="input is-rounded is-small has-text-centered"
                                                        value={order.codFee}
                                                        onChange={this.onFeeChange} /> */}
                                                    <NumberFormat className="input is-rounded has-text-right" thousandSeparator={true}
                                                        value={order.codFee}
                                                        onFocus={this.handleSelectAll}
                                                        onValueChange={(values) => {
                                                            const { formattedValue, value, floatValue } = values;
                                                            let orders = this.state.orders.slice();
                                                            const index = orders.findIndex(f => f.id == order.id)
                                                            const codFee = floatValue || 0;
                                                            if (index === -1) {

                                                            } else {
                                                                let orders = this.state.orders.slice();
                                                                orders[index] = {
                                                                    ...orders[index], codFee,
                                                                    expressName: this.state.expressName,
                                                                    expressLink: this.state.expressLink
                                                                };
                                                                this.setState({ orders })
                                                            }
                                                        }} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>;
                                })
                                : (
                                    <tr>
                                        <td colSpan="10" className="has-text-centered"><Link to="/cutoff">ยังไม่ได้ปิดรอบ/บันทึกครบแล้ว</Link></td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
                <nav className="level">
                    <div className="level-item">
                        <button className="button is-info is-centered"
                            onClick={this.onSaveTracking}>
                            บันทึก
                                        </button>

                    </div>
                </nav>
            </section>
        )
    }
}
const mapStateToProps = (state, props) => ({
    orders: state.orders
});
const mapDispatchToProps = (dispatch, props) => ({
    startSaveTracking: (orders) => dispatch(startSaveTracking(orders)),
    startListOrders: () => dispatch(startListOrders()),
    startUploadTracks: (tracks) => dispatch(startUploadTracks(tracks))
});
export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);