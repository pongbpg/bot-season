import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import MdAlarmOn from 'react-icons/lib/md/alarm-on';
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
    render() {
        return (
            <div className="columns">
                <div className="column">
                    {
                        this.state.orders.length === 0 ? (
                            <nav className="level">
                                <p className="level-item has-text-centered">
                                    <button className="button is-info is-centered"><MdAlarmOn /> ตัดรอบ {moment(new Date()).format('ll')}</button>
                                </p>
                            </nav>
                        ) : (
                                <table className="table is-bordered is-striped is-fullwidth">
                                    <thead>
                                        <tr>
                                            <th>รหัสสั่งซื้อ</th>
                                            <th>ชื่อลูกค้า</th>
                                            <th>เพจ</th>
                                            <th>จำนวนเงิน</th>
                                            <th>แอดมิน</th>
                                            <th>เลขพัสดุ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.orders.map((order) => {
                                            return <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.customer}</td>
                                                <td>{order.page}</td>
                                                <td>{order.price}</td>
                                                <td>{order.admin}</td>
                                                <td>
                                                    <input type="text" />
                                                </td>
                                            </tr>;
                                        })
                                        }
                                    </tbody>
                                </table>
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

});
export default connect(mapStateToProps, mapDispatchToProps)(ListPage);