import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startSearchTracking } from '../actions/search';
import { startSaveTracking } from '../actions/orders';
import FaSearch from 'react-icons/lib/fa/search';
import Money from '../selectors/money';
import moment from 'moment';
moment.locale('th');
export class TrackEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenu: false,
      isBurger: false,
      search: '',
      orders: props.orders,
      alert: false,
      isLoading: false,
      isSave: true
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.orders != this.state.orders) {
      this.setState({ orders: nextProps.orders });
    }
  }
  toggleIsMenu = () => {
    this.setState(() => ({
      isMenu: !this.state.isMenu
    }))
  }
  toggleIsBurger = () => {
    this.setState(() => ({
      isBurger: !this.state.isBurger
    }))
  }
  onSearchChange = (e) => {
    this.setState({ search: e.target.value })
  }
  onSearchClick = () => {
    if (this.state.search.length > 0) {
      this.setState({ isLoading: true })
      this.props.startSearchTracking(this.state.search)
        .then(result => {
          this.setState({ isLoading: false })
          if (result.search.length == 0) {
            this.setState({ alert: this.state.search })
          } else {
            this.setState({ alert: false })
            this.setState({ isSave: false })
          }
        })
    }
  }
  onAlertCloseClick = () => {
    this.setState({ alert: false })
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
    this.setState({ isSave: true })
  }
  render() {
    // console.log(this.state.orders)
    const style = {
      // alignItems: 'center',
      backgroundImage: 'url("/images/tracking.jpg")',
      // backgroundSize: 'cover',
      // display: 'flex',
      // justifyContent: 'center',
      height: 100 + 'vh',
      width: 100 + 'vw',
    }
    return (
      <section className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">แก้ไขเลขพัสดุ</h1>
          </div>
        </div>
        <div className="columns">
          <div className="column is-8 is-offset-2">
            {/* <h4 className="pretitol" style={{ marginBottom: 1 + 'rem' }}>CRYPTOCURRENCY INDEX FUND</h4> */}
            {/* <h1 className="title"><FaSearch />ค้นหาเลขพัสดุ</h1> */}
            <div className="field is-grouped">
              <p className="control has-icons-left is-expanded">
                <input className="input is-large" type="text" placeholder="รหัสสั่งซื้อ/เบอร์โทรศัพท์"
                  value={this.state.search}
                  onChange={this.onSearchChange} />
                <span className="icon is-small is-left">
                  <FaSearch />
                </span>
              </p>
              <p className="control">
                <button className={`button is-success is-large is-rounded ${this.state.isLoading ? 'is-loading' : ''}`}
                  onClick={this.onSearchClick}>
                  ค้นหา</button>
              </p>
            </div>
          </div>
        </div>
        {this.state.orders.length > 0 && (
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <table className="table is-fullwidth is-striped is-narrow">
                <thead>
                  <tr>
                    <th className="has-text-centered">รหัสสั่งซื้อ</th>
                    <th className="has-text-centered">ชื่อลูกค้า</th>
                    <th className="has-text-centered">วันที่ปิดรอบ</th>
                    <th className="has-text-centered">เพจ</th>
                    <th className="has-text-right">ยอดโอน</th>
                    <th className="has-text-centered">เลขพัสดุ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.orders.map((order, i) => {
                    const d = order.cutoffDate.substr(0, 4) + '-' + order.cutoffDate.substr(4, 2) + '-' + order.cutoffDate.substr(6, 2);

                    return <tr key={order.id}>
                      <td className="has-text-centered">{order.id}</td>
                      <td className="has-text-centered">{order.name}</td>
                      <td className="has-text-centered">{moment(d).format('ll')}</td>
                      <td className="has-text-centered">{order.page}</td>
                      <td className="has-text-right">{Money(order.price)}</td>
                      <td className="has-text-centered">
                        <div className="field">
                          <div className="control">
                            <input type="text" name={order.id}
                              className="input is-rounded has-text-centered"
                              disabled={this.state.isSave}
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
          </div>
        )}
        {(this.state.orders.length > 0 && this.state.isSave === false) && (
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <nav className="level">
                <div className="level-item">
                  <button className="button is-info is-centered"
                    onClick={this.onSaveTracking}>บันทึก</button>
                </div>
              </nav>
            </div>
          </div>
        )}
        {
          this.state.alert && (
            <div className="columns">
              <div className="column is-4 is-offset-4">
                <div className="notification is-danger">
                  <button className="delete" onClick={this.onAlertCloseClick}></button>
                  <h2>ไม่พบข้อมูล <strong>{this.state.alert}</strong></h2>
                  กรุณาตรวจสอบรหัสสั่งซื้อ/เบอร์โทรศัพท์
                </div>
              </div>
            </div>
          )
        }
      </section >
    )
  }
}
const mapStateToProps = (state, props) => ({
  orders: state.search
});
const mapDispatchToProps = (dispatch, props) => ({
  startSearchTracking: (search) => dispatch(startSearchTracking(search)),
  startSaveTracking: (orders) => dispatch(startSaveTracking(orders)),
});
export default connect(mapStateToProps, mapDispatchToProps)(TrackEditPage);