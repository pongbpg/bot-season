import React from 'react';
import { connect } from 'react-redux';
import StockWidget from './widget/StockPage';
export class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="hero-body">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <StockWidget />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
