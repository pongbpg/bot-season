import React from 'react';
import { connect } from 'react-redux';
import StockWidget from './widget/StockPage';
import AddProduct from './widget/AddProduct';
import { startGetProductType } from '../actions/widget/stock';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      types: props.types
    }
    this.props.startGetProductType()
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth != this.state.auth) {
      this.setState({ auth: nextProps.auth });
    }
    if (nextProps.types != this.state.types) {
      this.setState({ types: nextProps.types });
    }
  }

  render() {
    return (
      <div className="hero-body">
        <div className="columns">
          <div className="column is-12">
            {this.state.auth.role == 'owner' && (<AddProduct types={this.state.types} />)}
            <StockWidget types={this.state.types} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  types: state.types
});

const mapDispatchToProps = (dispatch) => ({
  startGetProductType: () => dispatch(startGetProductType())
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
