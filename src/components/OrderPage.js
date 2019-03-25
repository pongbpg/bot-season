import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startListOrders, startSaveTracking, startUploadTracks } from '../actions/orders';
import filterOrders from '../selectors/orders';
import FaSearch from 'react-icons/lib/fa/search';
import MdEdit from 'react-icons/lib/md/edit';
import Money from '../selectors/money';
import readXlsxFile from 'read-excel-file'
import moment from 'moment';
moment.locale('th');
export class OrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: props.orders || [],
            search: '',
            tracks: []
        }
        this.props.startListOrders();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.orders.length != this.state.orders.length) {
            this.setState({ orders: nextProps.orders });
        }
    }
    onTrackingChange = (e) => {
        const index = this.state.orders.findIndex(f => f.id === e.target.name);
        const tracking = e.target.value.toUpperCase();
        if (index === -1) {

        } else {
            let orders = this.state.orders.slice();
            orders[index] = { ...orders[index], tracking };
            this.setState({ orders })
        }
    }
    onSaveTracking = () => {
        const orders = this.state.orders.filter(f => f.tracking !== '');
        this.props.startSaveTracking(orders);
    }
    onSearchChange = (e) => {
        // console.log(e.target.value)
        this.setState({ search: e.target.value })
    }
    onFileChange = (e) => {
        // console.log(e.target.id);
        // console.log(e.target.files)
        readXlsxFile(e.target.files[0])
            .then((rows) => {
                // console.log(rows)
                let tracks = [];
                const colId = rows[0].findIndex(f => f == 'Order No.') || 2;
                const colTack = rows[0].findIndex(f => f == 'Tracking No.') || 3;
                console.log(colId, colTack)
                if (rows.length > 0) {
                    for (var row in rows) {
                        // console.log(row, rows[row][colTack], rows[row][colTack].length)
                        if (rows[row][colTack] != null)
                            if (rows[row][colTack].length == 12 && rows[row][colId] != '' && rows[row][colId] != 'Order No.') {
                                tracks.push({
                                    tracking: rows[row][colTack],
                                    id: rows[row][colId]
                                })
                            }
                    }
                }
                if (tracks.length == 0) {
                    alert('ไม่มีข้อมูล กรุณาตรวจสอบไฟล์ Excel')
                }
                this.setState({ tracks })

            })
            .catch((errors) => {
                console.log('upload file', errors)
                alert('ไฟล์ที่อัพไม่ถูกต้อง กรุณาตรวจสอบต้องเป็น Excel เท่านั้น!')
                this.setState({ tracks: [] })
            })
    }
    onUploadClick = (e) => {
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
    }
    onCancelClick = (e) => {
        this.setState({ tracks: [] })
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
                                <th className="has-text-centered">Admin</th>
                                <th className="has-text-centered">เลขพัสดุ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.orders.length > 0 ?
                                filterOrders(this.state.orders, this.state.search).map((order, i) => {
                                    return <tr key={order.id}>
                                        <td className="has-text-centered">{++i}</td>
                                        <td className="has-text-centered">{order.id}</td>
                                        <td className="has-text-centered">{moment(order.cutoffDate).format('Do MMM YY')}</td>
                                        <td className="has-text-centered">{order.name}</td>
                                        <td className="has-text-centered">{order.page}</td>
                                        <td className="has-text-right">{Money(order.price)}</td>
                                        <td className="has-text-centered">{order.admin}</td>
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
                                    </tr>;
                                })
                                : (
                                    <tr>
                                        <td colSpan="8" className="has-text-centered"><Link to="/cutoff">ยังไม่ได้ปิดรอบ/บันทึกครบแล้ว</Link></td>
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