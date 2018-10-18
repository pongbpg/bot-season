import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startCutOff } from '../../actions/orders';
import MdAlarmOn from 'react-icons/lib/md/alarm-on';
import Money from '../../selectors/money';
import moment from 'moment';
moment.locale('th');
export class ListPage extends React.Component {
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
    onCutOffClick = () => {
        this.props.startCutOff()
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
        console.log(this.state.orders)
    }
    render() {
        return (
            <div className="columns">
                <div className="column">
                    {
                        this.state.orders.length === 0 ? (
                            <section className="hero">
                                <div className="hero-body">
                                    <div className="container">
                                        <h1 className="title">ตัดรอบจ้า</h1>
                                        {/* <h2 className="subtitle">Hero subtitle</h2> */}
                                    </div>
                                </div>
                                <nav className="level">
                                    <p className="level-item has-text-centered">
                                        <button className="button is-info is-centered"
                                            onClick={this.onCutOffClick}>
                                            <MdAlarmOn /> ตัดรอบ {moment(new Date()).format('ll')}
                                        </button>
                                    </p>
                                </nav>
                            </section>
                        ) : (
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
                                                {this.state.orders.map((order, i) => {
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
                                                                        className="input is-rounded"
                                                                        value={order.tracking}
                                                                        onChange={this.onTrackingChange} />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>;
                                                })
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
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, props) => ({
    orders: state.orders
});
const mapDispatchToProps = (dispatch, props) => ({
    startCutOff: () => dispatch(startCutOff())
});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);