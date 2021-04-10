import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import { MdMailOutline, MdAlarmOn, MdPanTool, MdPayment, MdEmail, MdPeople, MdExitToApp, MdAccountCircle } from 'react-icons/md';
import { FaSearch, FaFileAlt, FaFacebook, FaShippingFast, FaLine, FaLayerGroup } from 'react-icons/fa';
import {GiPriceTag} from 'react-icons/gi';
import {GrTarget} from 'react-icons/gr'
import {BsGraphUp} from 'react-icons/bs'
export class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenu: false,
      isBurger: false,
      auth: props.auth
    };
  }
  toggleIsMenu = () => {
    this.setState(() => ({
      isMenu: !this.state.isMenu
    }))
  };
  toggleIsBurger = () => {
    this.setState(() => ({
      isBurger: !this.state.isBurger
    }))
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
  };
  render() {
    const color = { color: '#333' };
    const borderRadius = { borderRadius: '25px' }
    // console.log(this.state.isAdmin)
    const yyyymmdd = () => {
      function twoDigit(n) { return (n < 10 ? '0' : '') + n; }
      var now = new Date();
      return '' + now.getFullYear() + twoDigit(now.getMonth() + 1) + twoDigit(now.getDate());
    }

    return (
      <div>
        <nav className="navbar is-dark">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item brand-text" to="/home">TOPSLIM STORE</Link>
              <div data-target="navMenu" onClick={this.toggleIsBurger}
                className={this.state.isBurger === true ? "navbar-burger burger is-active" : "navbar-burger burger"}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div id="navMenu" className={this.state.isBurger === true ? "navbar-menu is-active" : "navbar-menu"}>
              <div className="navbar-start">
                <Link className="navbar-item" to="/">
                  <span className="icon"><FaSearch /></span>ค้นหาพัสดุ
                </Link>
                {['stock', 'owner'].indexOf(this.state.auth.role) > -1 && (
                  <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">สต็อก</a>
                    <div className="navbar-dropdown">
                      < Link className="navbar-item" to="/cutoff">
                        <span className="icon"><MdAlarmOn /></span>ปิดรอบ
                    </Link>
                      <Link className="navbar-item" to="/orders">
                        <span className="icon"><MdMailOutline /></span>เลขพัสดุ
                  </Link>
                    </div>
                  </div>
                )}
                {['admin', 'owner'].indexOf(this.state.auth.role) > -1 && (
                  <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">แอดมิน</a>
                    <div className="navbar-dropdown">
                      <Link className="navbar-item" to="/admins/sayhi">
                        <span className="icon"><MdPanTool /></span>ยอดทัก
                  </Link>
                  <Link className="navbar-item" to="/admins/pivotTb">
                        <span className="icon"><BsGraphUp /></span>Pivot Table
                  </Link>
                    </div>
                  </div>
                )}
                {['owner'].indexOf(this.state.auth.role) > -1 && (
                  <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">บัญชี</a>
                    <div className="navbar-dropdown">
                      <Link className="navbar-item" to="/finances/cost">
                        <span className="icon"><MdPayment /></span>ค่าใช้จ่าย
                  </Link>
                      <Link className="navbar-item" to="/finances/cod">
                        <span className="icon"><FaShippingFast /></span>COD
                  </Link>
                      <Link className="navbar-item" to="/widget/posts">
                        <span className="icon"><FaFacebook /></span>ยอดโพสต์
                  </Link>
                  <Link className="navbar-item" to="/finances/promotion">
                        <span className="icon"><GiPriceTag /></span>Promotion
                  </Link>
                  <Link className="navbar-item" to="/finances/topdays">
                        <span className="icon"><GiPriceTag /></span>Topdays
                  </Link>
                    </div>
                  </div>
                )}
                {['owner'].indexOf(this.state.auth.role) > -1 && (
                  <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link">จัดการ</a>
                    <div className="navbar-dropdown">
                      <Link className="navbar-item" to="/manage/teams">
                        <span className="icon"><MdPeople /></span>Team
                      </Link>
                      <Link className="navbar-item" to="/manage/admins">
                        <span className="icon"><FaLine /></span>Line
                      </Link>
                      <Link className="navbar-item" to="/manage/emails">
                        <span className="icon"><MdEmail /></span>Email
                      </Link>
                      <Link className="navbar-item" to="/manage/product/types">
                        <span className="icon"><FaLayerGroup /></span>Types
                      </Link>
                       <Link className="navbar-item" to="/manage/targets">
                        <span className="icon"><GrTarget /></span>Targets
                      </Link>
                    </div>
                  </div>
                )}
                <Link className="navbar-item" to="/report">
                  <span className="icon"><FaFileAlt /></span>รายงาน
                  </Link>
                {/*  */}
                {/* <div className="navbar-item has-dropdown is-hoverable">
                  <a className="navbar-link">อื่นๆ</a>
                  <div className="navbar-dropdown">
                    <Link className="navbar-item" to="/votes">
                      <span className="icon"><MdPanTool /></span>เลือกตั้ง
                  </Link>
                  </div>
                </div> */}
                <Link className="navbar-item  is-hidden-desktop" to="/profile">
                  <span className="icon"><MdAccountCircle /></span> ข้อมูลส่วนตัว
                    </Link>
                <a className="navbar-item is-hidden-desktop" onClick={this.props.startLogout}>
                  ออกจากระบบ
                </a>
              </div>
              <div className="navbar-end is-hidden-touch">
                <div className={this.state.isMenu === true ? "navbar-item has-dropdown is-active" : "navbar-item has-dropdown"}>
                  <a className="navbar-link" onClick={this.toggleIsMenu}>
                    <img src={this.props.auth.imgUrl} />
                    &nbsp;{this.props.auth.email}
                  </a>
                  <div className="navbar-dropdown">
                    <Link className="navbar-item" to="/profile">
                      <span className="icon"><MdAccountCircle /></span> ข้อมูลส่วนตัว
                    </Link>
                    {/* <hr className="navbar-divider" /> */}
                    <a className="navbar-item" onClick={this.props.startLogout}>
                      <span className="icon"><MdExitToApp /></span> ออกจากระบบ
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav >
        {/* <section className="hero">
          <div className="hero-body is-marginless is-bold">
            <div className="container">
              <h1 className="title">{this.state.title}</h1>
            </div>
          </div>
        </section> */}
      </div >
    );
  }
}
const mapStateToProps = (state) => ({
  auth: state.auth
});
const mapDispatchToProps = (dispatch) => {
  return {
    startLogout: () => dispatch(startLogout())
  }
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
