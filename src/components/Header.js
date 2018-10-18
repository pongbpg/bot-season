import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { startLogout } from '../actions/auth';
import MdMailOutline from 'react-icons/lib/md/mail-outline';
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

  };
  render() {
    const color = { color: '#333' };
    const borderRadius = { borderRadius: '25px' }
    // console.log(this.state.isAdmin)
    return (
      <div>
        <nav className="navbar is-dark">
          <div className="container">
            <div className="navbar-brand">
              <Link className="navbar-item brand-text" to="/">Order System Management</Link>
              <div data-target="navMenu" onClick={this.toggleIsBurger}
                className={this.state.isBurger === true ? "navbar-burger burger is-active" : "navbar-burger burger"}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div id="navMenu" className={this.state.isBurger === true ? "navbar-menu is-active" : "navbar-menu"}>
              <div className="navbar-start">
                {/* <Link className="navbar-item" to="/authen">ยืนยันตัวตน</Link> */}
                <Link className="navbar-item" to="/users">
                  <span className="icon"><MdMailOutline /></span>เลขพัสดุ
                    </Link>
                <a className="navbar-item is-hidden-desktop" onClick={this.props.startLogout}>
                  Logout
                    </a>
              </div>
              <div className="navbar-end is-hidden-touch">
                <div className={this.state.isMenu === true ? "navbar-item has-dropdown is-active" : "navbar-item has-dropdown"}>
                  <a className="navbar-link" onClick={this.toggleIsMenu}>
                    &nbsp;{this.props.auth.email}
                  </a>
                  <div className="navbar-dropdown">
                    {/* <hr className="navbar-divider" /> */}
                    <a className="navbar-item" onClick={this.props.startLogout}>
                      Logout
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
