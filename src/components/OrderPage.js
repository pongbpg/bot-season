import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startSaveTracking, startListOrders } from '../actions/orders';
import Money from '../selectors/money';
import moment from 'moment';
moment.locale('th');
export class OrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: props.orders || []
        }
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
    render() {
        return (
            <section className="hero">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title">บันทึกเลขพัสดุ</h1>
                        {/* <h2 className="subtitle">Hero subtitle</h2> */}
                    </div>
                </div>
                <div className="container">
                    <table className="table is-bordered is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th className="has-text-centered">ลำดับ</th>
                                <th className="has-text-centered">รหัสสั่งซื้อ</th>
                                <th className="has-text-centered">ชื่อลูกค้า</th>
                                <th className="has-text-centered">เพจ</th>
                                <th className="has-text-right">จำนวนเงิน</th>
                                <th className="has-text-centered">Admin</th>
                                <th className="has-text-centered">เลขพัสดุ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.orders.length > 0 ?
                                this.state.orders.map((order, i) => {
                                    return <tr key={order.id}>
                                        <td className="has-text-centered">{++i}</td>
                                        <td className="has-text-centered">{order.id}</td>
                                        <td className="has-text-centered">{order.name}</td>
                                        <td className="has-text-centered">{order.page}</td>
                                        <td className="has-text-right">{Money(order.price)}</td>
                                        <td className="has-text-centered">{order.admin}</td>
                                        <td className="has-text-centered">
                                            <div className="field">
                                                <div className="control">
                                                    <input type="text" name={order.id}
                                                        className="input is-rounded is-small"
                                                        value={order.tracking}
                                                        onChange={this.onTrackingChange} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>;
                                })
                                : (
                                    <tr>
                                        <td colSpan="7" className="has-text-centered"><Link to="/cutoff">ยังไม่ได้ปิดรอบ/บันทึกครบแล้ว</Link></td>
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
    // startListOrders:()
});
export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);