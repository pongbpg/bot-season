import React from 'react';
import { connect } from 'react-redux';
// import MdHome from 'react-icons/lib/md/home';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        Home
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
