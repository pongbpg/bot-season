import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { startSearchTracking } from '../actions/search';
import { FaSearch } from 'react-icons/fa';
import Money from '../selectors/money';
import moment from 'moment';
import ReactPixel from 'react-facebook-pixel';
ReactPixel.init('845900452590266');
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
      isLoading: false,
      sumPrice: 0
    };
    this.calcSumPrice = this.calcSumPrice.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.searchList != this.state.searchList) {
      this.setState({ searchList: nextProps.searchList });
    }
  }
  calcSumPrice = (lists) => {
    let sumPrice = 0;
    lists.map(l => {
      sumPrice += l.price
    })
    this.setState({ sumPrice })
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
    this.setState({ search: e.target.value.replace(/\D/g, '') })
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
            this.calcSumPrice(result.search)
            this.setState({ alert: false })
            if (result.search[0].price > 0) {
              ReactPixel.trackCustom('Purchase', {
                content_ids: result.search[0].product.map(m => m.code),
                content_type: result.search[0].product.map(m => m.typeId),
                contents: result.search[0].product.map(p => {
                  return {
                    product: p.code,
                    productType: p.typeId == "" ? p.code : p.typeId,
                    amount: p.amount
                  }
                }),
                currency: "THB",
                value: result.search[0].price,
                search_string: this.state.search,
                status: true
              })
            }
          }
        })
    }
  }
  onAlertCloseClick = () => {
    this.setState({ alert: false })
  }
  render() {
    // console.log(this.state.searchList)
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
              {/* <span className="navbar-item title">TOPSLIM STORE</span> */}
              <Link className="navbar-item title" to="/home">TOPSLIM STORE</Link>
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
                <h1 className="title has-text-white">ค้นหาเลขพัสดุ</h1>
                {/* <div className="columns"> */}
                <div className="column is-12">
                  <p className="control has-icons-left is-expanded">
                    <input className="input is-large" type="text" placeholder="เบอร์โทรศัพท์"
                      value={this.state.search}
                      onChange={this.onSearchChange} />
                    <span className="icon is-small is-left">
                      <FaSearch />
                    </span>
                  </p>
                </div>
                {/* </div> */}
                {/* <div className="field is-grouped"> */}
                <div className="level">
                  <div className="level-item">
                    <p className="control">
                      <button className={`button is-success is-large is-rounded ${this.state.isLoading ? 'is-loading' : ''}`}
                        onClick={this.onSearchClick}>
                        ค้นหา</button>
                    </p>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>

            {/* <div className="columns is-hidden-tablet">
              <div className="column is-8 is-offset-2">
                <h1 className="title has-text-white">ค้นหาเลขพัสดุ</h1>
                <div className="field">
                  <p className="control has-icons-left is-expanded">
                    <input className="input is-large" type="text" placeholder="เบอร์โทรศัพท์"
                      value={this.state.search}
                      onChange={this.onSearchChange} />
                    <span className="icon is-small is-left">
                      <FaSearch />
                    </span>
                  </p>
                </div>
                <div className="field">
                  <p className="control has-text-centered">
                    <button className={`button is-success is-large is-rounded ${this.state.isLoading ? 'is-loading' : ''}`}
                      onClick={this.onSearchClick}>
                      ค้นหา</button>
                  </p>
                </div>
              </div>
            </div> */}
            <div className="columns is-hidden-mobile">
              <div className="column is-12">
                {this.state.searchList.length > 0 &&
                  (
                    <table className="table is-fullwidth is-striped is-narrow">
                      <thead>
                        <tr>
                          <th className="has-text-centered">รหัสสั่งซื้อ</th>
                          <th className="has-text-centered">ชื่อผู้สั่งซื้อ</th>
                          <th className="has-text-centered">เพจ</th>
                          <th className="has-text-centered">สินค้า</th>
                          <th className="has-text-centered">วันที่ส่งสินค้า</th>
                          <th className="has-text-right">ยอดเงิน</th>
                          <th className="has-text-centered">เลขพัสดุ</th>
                          <th className="has-text-centered">ส่งโดย</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.searchList.map((order, i) => {
                          const d = order.cutoffDate.substr(0, 4) + '-' + order.cutoffDate.substr(4, 2) + '-' + order.cutoffDate.substr(6, 2);
                          return <tr key={order.id}>
                            <td className="has-text-centered">{order.id}</td>
                            <td className="has-text-centered">{order.name}</td>
                            <td className="has-text-centered">{order.page}</td>
                            <td className="has-text-centered">{order.product.map(p => p.code + '=' + p.amount).reduce((a, b) => a + ',' + b)}</td>
                            <td className="has-text-centered">{moment(d).format('ll')}</td>
                            <td className="has-text-right">{order.banks[0].name + ' ' + Money(order.price)}</td>
                            <td className="has-text-centered">{order.tracking == '' ? (order.cutoff ? 'กำลังนำเลขพัสดุเข้าสู่ระบบ' : 'กำลังจัดเตรียมสินค้า') : order.tracking}</td>
                            <td className="has-text-centered">
                              <a className='is-link'
                                href={(order.expressName == 'KERRY' || order.expressName == 'NINJA' ? order.expressLink + '=' + order.tracking :
                                  (order.expressName == 'EMS' ? 'http://emsbot.com/#/?s=' + order.tracking : order.expressLink))} target="_blank">
                                {!order.expressName ?
                                  (order.cutoff ? 'จัดส่งแล้ว' : 'ยังไม่ได้จัดส่ง')
                                  : 'คลิกเพื่อตรวจสอบพัสดุ'} {/* + order.expressName}*/}
                              </a>
                            </td>
                          </tr>;
                        })
                        }
                        <tr>
                          <th className="has-text-centered" colSpan="5">ยอดรวม</th>
                          <th className="has-text-right">{Money(this.state.sumPrice)}</th>
                          <th colSpan="2"></th>
                        </tr>
                      </tbody>
                    </table>
                  )
                }
              </div>
            </div>
            <div className="columns is-hidden-tablet">
              <div className="column is-10 is-offset-1">
                {this.state.searchList.map((order, i) => {
                  const d = order.cutoffDate.substr(0, 4) + '-' + order.cutoffDate.substr(4, 2) + '-' + order.cutoffDate.substr(6, 2);
                  const color = (
                    order.expressName == 'KERRY' ? 'warning' : (
                      order.expressName == 'EMS' ? 'danger' : 'success'
                    )
                  )
                  return <div key={order.id} className="box content">
                    <article className="post">
                      <h3>
                        <a className={`button is-link is-${color}`}
                          href={(order.expressName == 'KERRY' || order.expressName == 'NINJA' ? order.expressLink + '=' + order.tracking :
                            (order.expressName == 'EMS' ? 'http://emsbot.com/#/?s=' + order.tracking : order.expressLink))} target="_blank">
                          {!order.expressName ?
                            (order.cutoff ? 'จัดส่งแล้ว' : 'ยังไม่ได้จัดส่ง')
                            : 'คลิกปุ่มนี้เพื่อตรวจสอบพัสดุ'} {/* + order.expressName}*/}
                        </a>
                        {order.tracking == '' && (
                          <span className="tag is-medium">
                            {order.cutoff ? 'กำลังนำเลขพัสดุเข้าสู่ระบบ' : 'กำลังจัดเตรียมสินค้า'}
                          </span>
                        )}
                        {order.tracking != '' && (
                          <span className="tag is-medium">
                            เลขพัสดุ: {order.tracking}
                          </span>

                        )}
                      </h3>
                      <h4>{order.name}</h4>

                      <div className="level">
                        <div className="level-left">
                          <p className="has-text-grey-light">{order.id + order.page}</p>
                        </div>
                        <div className="level-content">
                          <div className="content">
                            <span className="has-text-grey">{order.product.map(p => p.code + '=' + p.amount).reduce((a, b) => a + ',' + b)}</span>
                          </div>
                        </div>
                        <div className="level-right">
                          <span className="has-text-weight-bold">{moment(d).format('Do MMM YY') + ' ' + order.banks[0].name + ' ฿' + Money(order.price, 0)}</span>
                        </div>
                      </div>
                    </article>
                  </div>;
                })}
              </div>
            </div>
            {
              this.state.alert && (
                <div className="columns">
                  <div className="column is-4 is-offset-4">
                    <div className="notification is-danger">
                      <button className="delete" onClick={this.onAlertCloseClick}></button>
                      <h2>ไม่พบเบอร์โทร <strong>{this.state.alert}</strong> ในระบบ</h2>
                      กรุณาตรวจสอบเบอร์โทรศัพท์ให้ถูกต้อง
                </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div >
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