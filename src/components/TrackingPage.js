import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { startSearchTracking } from '../actions/search';
import FaSearch from 'react-icons/lib/fa/search';
import Money from '../selectors/money';
import moment from 'moment';
moment.locale('th');
export class TrackingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenu: false,
      isBurger: false,
      search: '',
      searchList: props.searchList,
      alert: false,
      isLoading: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.searchList != this.state.searchList) {
      this.setState({ searchList: nextProps.searchList });
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
          }
        })
    }
  }
  onAlertCloseClick = () => {
    this.setState({ alert: false })
  }
  render() {
    console.log(this.state.searchList)
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
      // <div style={style}>
      <div className="is-fullheight" style={style}>
        <nav className="navbar">
          <div className="container">
            <div className="navbar-brand">
              <span className="navbar-item title">TOPSLIM OFFICE</span>
              <span data-target="navbarMenu" onClick={this.toggleIsBurger}
                className={this.state.isBurger === true ? "navbar-burger burger is-active" : "navbar-burger burger"}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
            <div id="navbarMenu" className={this.state.isBurger === true ? "navbar-menu is-active" : "navbar-menu"}>
              <div className="navbar-end">
                <div className="navbar-item is-active">
                  <Link to="/home"><span className="button  is-info is-rounded is-outlined">สำหรับเจ้าหน้าที่</span></Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="hero-body">
          <div className="container">
            <div className="columns">
              <div className="column is-8 is-offset-2">
                {/* <h4 className="pretitol" style={{ marginBottom: 1 + 'rem' }}>CRYPTOCURRENCY INDEX FUND</h4> */}
                <h1 className="title has-text-white">ค้นหาเลขพัสดุ</h1>
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
            <div className="columns">
              <div className="column is-10 is-offset-1">
                {this.state.searchList.length > 0 &&
                  (
                    <table className="table is-fullwidth is-striped is-narrow">
                      <thead>
                        <tr>
                          <th className="has-text-centered">รหัสสั่งซื้อ</th>
                          <th className="has-text-centered">ชื่อผู้สั่งซื้อ</th>
                          <th className="has-text-centered">วันที่ส่งสินค้า</th>
                          <th className="has-text-right">ยอดโอน</th>
                          <th className="has-text-centered">เลขพัสดุ</th>
                          <th className="has-text-centered">ส่งโดย</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.searchList.map((order, i) => {
                          const d = order.cutoffDate.substr(0, 4) + '-' + order.cutoffDate.substr(4, 2) + '-' + order.cutoffDate.substr(6, 2);
                          // let deliver = '';
                          // let link = '';
                          // if (order.name.substr(0, 1).toUpperCase() == 'A') {
                          //   deliver = 'ALPHA FAST';
                          //   link = 'https://www.alphafast.com/th/track-alpha';
                          // } else if (order.name.substr(0, 1).toUpperCase() == 'K') {
                          //   deliver = 'KERRY';
                          //   link = 'https://th.kerryexpress.com/th/track/?track=' + order.tracking;
                          // } else if (order.name.substr(0, 1).toUpperCase() == 'M') {
                          //   deliver = 'EMS';
                          //   link = 'http://track.thailandpost.co.th/tracking/default.aspx';
                          // } else if (order.name.substr(0, 1).toUpperCase() == 'R') {
                          //   deliver = 'ลงทะเบียน';
                          //   link = 'http://track.thailandpost.co.th/tracking/default.aspx';
                          // }
                          return <tr key={order.id}>
                            <td className="has-text-centered">{order.id}</td>
                            <td className="has-text-centered">{order.name}</td>
                            <td className="has-text-centered">{moment(d).format('ll')}</td>
                            <td className="has-text-right">{Money(order.price)}</td>
                            <td className="has-text-centered">{order.tracking}</td>
                            <td className="has-text-centered">
                              <a href={order.expressLink} target="_blank">{order.expressName}</a>
                            </td>
                            {/* <td className="has-text-centered">
                              {deliver != '' ?
                                (
                                  <a href={link} target="_blank">{deliver}</a>
                                ) : deliver
                              }
                            </td> */}
                          </tr>;
                        })
                        }
                      </tbody>
                    </table>
                  )
                }
              </div>
            </div>
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
          </div>
        </div>
      </div>
      // </div>
    )
  }
}
const mapStateToProps = (state, props) => ({
  searchList: state.search
});
const mapDispatchToProps = (dispatch, props) => ({
  startSearchTracking: (search) => dispatch(startSearchTracking(search))
});
export default connect(mapStateToProps, mapDispatchToProps)(TrackingPage);