import React from 'react';
import { connect } from 'react-redux';
import { startGetStock } from '../../actions/widget/stock';
import Money from '../../selectors/money';
export class StockPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stock: props.stock
        }
        this.props.startGetStock();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.stock != this.state.stock) {
            this.setState({ stock: nextProps.stock });
        }
    }

    render() {
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="container">
                        <h2 className="title">สินค้าคงคลัง</h2>
                    </div>
                </div>
                <div className="hero-body">
                    <table className="table is-fullwidth is-striped is-narrow">
                        <thead>
                            <tr>
                                <th className="has-text-centered">ลำดับ</th>
                                <th className="has-text-left">รหัส</th>
                                <th className="has-text-left">ชื่อสินค้า</th>
                                <th className="has-text-right">คงเหลือ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.stock.map((st, i) => {
                                return <tr key={st.id}>
                                    <td className="has-text-centered">{++i}</td>
                                    <td className="has-text-left">{st.id}</td>
                                    <td className="has-text-left">{st.name}</td>
                                    <td className="has-text-right">{Money(st.amount, 0)}</td>
                                </tr>;
                            })
                            }
                        </tbody>
                    </table>
                </div>
            </section>
        )
    }
}
const mapStateToProps = (state, props) => ({
    stock: state.stock
});
const mapDispatchToProps = (dispatch, props) => ({
    startGetStock: () => dispatch(startGetStock())

});
export default connect(mapStateToProps, mapDispatchToProps)(StockPage);