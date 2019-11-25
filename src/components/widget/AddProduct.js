import React from 'react';
import { connect } from 'react-redux';
import { startAddProduct, startGetProductType } from '../../actions/widget/product';
import Money from '../../selectors/money';
import NumberFormat from 'react-number-format';
export class AddProduct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            amount: '',
            amount2: '',
            cost: '',
            alert: '',
            unit: '',
            sale: '',
            isLoading: '',
            types: props.types || [],
            typeId: '',
            typeName: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.types != this.state.types) {
            this.setState({ types: nextProps.types });
        }
    }
    onIDChange = (e) => {
        this.setState({ id: e.target.value.toUpperCase() })
    }
    onNameChange = (e) => {
        this.setState({ name: e.target.value })
    }
    onUnitChange = (e) => {
        this.setState({ unit: e.target.value })
    }
    onAmountChange = (e) => {
        const amount = e.target.value.replace(/\D/g, '');
        if (!isNaN(amount)) {
            this.setState({
                amount: Number(amount)
            })
        }
    }
    onAmount2Change = (e) => {
        const amount2 = e.target.value.replace(/\D/g, '');
        if (!isNaN(amount2)) {
            this.setState({
                amount2: Number(amount2)
            })
        }
    }
    onSaleChange = (e) => {
        const sale = e.target.value.replace(/\D/g, '');
        if (!isNaN(sale)) {
            this.setState({
                sale: Number(sale)
            })
        }
    }
    onAlertChange = (e) => {
        const alert = e.target.value.replace(/\D/g, '');
        if (!isNaN(alert)) {
            this.setState({
                alert: Number(alert)
            })
        }
    }
    onCostChange = (e) => {
        const cost = e.target.value.replace(/\D/g, '');
        if (!isNaN(cost)) {
            this.setState({
                cost: Number(cost)
            })
        }
    }
    onAddClick = (e) => {
        if (this.state.id == '') {
            alert('กรุณาใส่รหัสสินค้า')
        } else if (this.state.name == '') {
            alert('กรุณาใส่ชือสินค้า')
        } else if (this.state.unit == '') {
            alert('กรุณาใส่หน่วยนับ')
        } else {
            this.setState({ isLoading: 'is-loading' })
            this.props.startAddProduct({
                id: this.state.id,
                name: this.state.name,
                unit: this.state.unit,
                amount: this.state.amount == '' ? 0 : this.state.amount,
                amount2: this.state.amount2 == '' ? 0 : this.state.amount2,
                sale: this.state.sale == '' ? 0 : this.state.sale,
                alert: this.state.alert == '' ? 0 : this.state.alert,
                cost: this.state.cost == '' ? 0 : this.state.cost,
                typeId: this.state.typeId,
                typeName: this.state.typeName
            }).then((msg) => {
                this.setState({ isLoading: '' })
                if (msg == 'no') {
                    alert('กรุณาตรวจสอบรหัสสินค้านี้มีแล้ว')
                } else {
                    this.setState({ id: '', name: '', unit: '', amount: '', amount2: '', cost: '', alert: '', sale: '' })
                }
            })
        }
    }
    onHandleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onAddClick();
        }
    }
    handleSelectAll = (e) => {
        e.target.select()
    }
    handleTypeChange = (e) => {
        const typeId = e.target.value;
        const type = this.state.types.find(f => f.typeId == typeId)
        this.setState({ typeId, id: e.target.value, typeName: type ? type.typeName : '' })
    }
    render() {
        return (
            <section className="hero">
                <div className="hero-head">
                    <div className="container">
                        <h2 className="title">เพิ่มสินค้า</h2>
                    </div>
                </div>
                <div className="hero-body">
                    <div className="columns">
                        <div className="column is-2">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        <div className="select">
                                            <select className="input"
                                                onChange={this.handleTypeChange}
                                                value={this.state.typeId}>
                                                <option value="">ไม่มี</option>
                                                {this.state.types.length > 0 &&
                                                    this.state.types.map(type => {
                                                        return <option key={type.typeId} value={type.typeId}>{type.typeId + ' : ' + type.typeName}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="column is-2">
                            <div className="field">
                                <div className="control">
                                    <input className="input" type="text" placeholder="รหัสสินค้า"
                                        value={this.state.id}
                                        onKeyPress={this.onHandleKeyPress}
                                        onChange={this.onIDChange} />
                                </div>
                            </div>
                        </div>
                        <div className="column is-5">
                            <div className="field">
                                <div className="control">
                                    <input className="input" type="text" placeholder="ชื่อสินค้า"
                                        value={this.state.name}
                                        onKeyPress={this.onHandleKeyPress}
                                        onChange={this.onNameChange} />
                                </div>
                            </div>
                        </div>
                        <div className="column is-3">
                            <div className="field">
                                <div className="control">
                                    <input className="input" type="text" placeholder="หน่วยนับ"
                                        value={this.state.unit}
                                        onKeyPress={this.onHandleKeyPress}
                                        onChange={this.onUnitChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-2">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        {/* <input className="input" type="text" placeholder="ต้นทุน"
                                            value={this.state.cost == '' ? '' : Money(this.state.cost, 2)}
                                            onKeyPress={this.onHandleKeyPress}
                                            onChange={this.onCostChange} /> */}
                                        <NumberFormat className="input is-rounded has-text-right" thousandSeparator={true}
                                            placeholder="ต้นทุน"
                                            value={this.state.cost}
                                            onFocus={this.handleSelectAll}
                                            onValueChange={(values) => {
                                                const { formattedValue, value, floatValue } = values;
                                                const cost = floatValue;
                                                this.setState({ cost })
                                            }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-2">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        {/* <input className="input" type="text" placeholder="ยืม"
                                            value={this.state.alert == '' ? '' : Money(this.state.alert, 0)}
                                            onKeyPress={this.onHandleKeyPress}
                                            onChange={this.onAlertChange} /> */}
                                        <NumberFormat className="input is-rounded has-text-right" thousandSeparator={true}
                                            placeholder="ยืม"
                                            decimalScale={0}
                                            value={this.state.alert}
                                            onFocus={this.handleSelectAll}
                                            onValueChange={(values) => {
                                                const { formattedValue, value, floatValue } = values;
                                                const alert = floatValue;
                                                this.setState({ alert })
                                            }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-2">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        {/* <input className="input" type="text" placeholder="ราคาขาย"
                                            value={this.state.sale == '' ? '' : Money(this.state.sale, 2)}
                                            onKeyPress={this.onHandleKeyPress}
                                            onChange={this.onSaleChange} /> */}
                                        <NumberFormat className="input is-rounded has-text-right" thousandSeparator={true}
                                            placeholder="ราคาขาย"
                                            value={this.state.sale}
                                            onFocus={this.handleSelectAll}
                                            onValueChange={(values) => {
                                                const { formattedValue, value, floatValue } = values;
                                                const sale = floatValue;
                                                this.setState({ sale })
                                            }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3">
                            <div className="field-body">
                                <div className="field">
                                    <div className="control">
                                        {/* <input className="input" type="text" placeholder="จำนวน"
                                            value={this.state.amount == '' ? '' : Money(this.state.amount, 0)}
                                            onKeyPress={this.onHandleKeyPress}
                                            onChange={this.onAmountChange} /> */}
                                        <NumberFormat className="input is-rounded has-text-right" thousandSeparator={true}
                                            placeholder="จำนวน"
                                            decimalScale={0}
                                            value={this.state.amount}
                                            onFocus={this.handleSelectAll}
                                            onValueChange={(values) => {
                                                const { formattedValue, value, floatValue } = values;
                                                const amount = floatValue;
                                                this.setState({ amount })
                                            }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3">
                            <div className="field-body">
                                <div className="field">
                                    <p className="control">
                                        <button className={`button is-success is-fullwidth ${this.state.isLoading ? 'is-loading' : ''}`}
                                            onClick={this.onAddClick}>
                                            เพิ่ม</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="field is-grouped">
                        <p className="control is-expanded">
                            <input className="input is-large" type="text" placeholder="ชื่อสินค้า"
                                value={this.state.name}
                                onChange={this.onNameChange} />

                        </p>
                        <p>
                            <input className="input is-large" type="text" placeholder="ต้นทุน"
                                value={this.state.cost}
                                onChange={this.onCostChange} />
                        </p>
                        <p>
                            <input className="input is-large" type="text" placeholder="จำนวน"
                                value={this.state.amount}
                                onChange={this.onAmountChange} />
                        </p>

                        <p className="control">
                            <button className={`button is-success is-large is-rounded ${this.state.isLoading ? 'is-loading' : ''}`}
                                onClick={this.onAddClick}>
                                เพิ่ม</button>
                        </p>
                    </div> */}
                </div >
            </section >
        )
    }
}
const mapStateToProps = (state, props) => ({
});
const mapDispatchToProps = (dispatch, props) => ({
    startAddProduct: (product) => dispatch(startAddProduct(product)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);