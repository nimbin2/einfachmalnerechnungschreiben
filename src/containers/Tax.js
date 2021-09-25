import React, { Component } from "react";
import "./Tax.sass";
import Api from "../Api";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import moment from 'moment';
import Table from "react-bootstrap/Table";
import InfoButton from "./components/InfoButton";

export default class Tax extends Component {
    state = {
        bills: this.props.bills,
        taxUstrCheck: this.props.taxUstrCheck,
        startYear: moment.min(this.props.bills.map((el) => moment(el.billDate))).format('YYYY') || "",
        dateRangeArr: [{name: 'pro Jahr', value: 'proJahr'}, {name: 'pro Quartal', value: 'proQuartal'}, {name: 'pro Monat', value: 'proMonat'}],
        dateRange: "proJahr",
        dateRangeName: "",
        taxCalcString: [],
        optionsMwSt: [ "19.0", "16.0", "7.0", "0.0"  ],
        taxData: [],
        setCheck: "true",
        toggleTr: "",
        checkDisabled: false,
        editUstrCheck: false,
        reloadInfo: false,
        taxLoaded: false
    }

    componentDidMount() {
        this.handleDateRange(this.state.taxUstrCheck);
        this.loadTaxData();
    };

    loadTaxData = () => {
        Api.getTaxData().then((response) => {
            this.setState({
                taxData: response.data,
            })
        });
    };

    handleDateRange = (getRange) => {
        let range = !getRange || getRange === "unwichtig" ? "proJahr" : getRange
        this.setState({
            dateRange: range,
            dateRangeName: this.state.dateRangeArr.find((element) => element.value === range).name
        })
        this.getTax(range);
    };

    getTax = (range) => {
        let taxCalcString = ""
        let dateRange = range
        taxCalcString = this.props.taxCalcStringJ
        if(dateRange === "proJahr") {
            taxCalcString = this.props.taxCalcStringJ
        }
        if(dateRange === "proQuartal") {
            taxCalcString = this.props.taxCalcStringQ
        }
        if(dateRange === "proMonat") {
            taxCalcString = this.props.taxCalcStringM
        }
        let startDate = moment("01.01."+this.state.startYear, "DD.MM.YYYY").toDate()

        let endDate = moment("01.01."+this.state.startYear, "DD.MM.YYYY").toDate()
        endDate.setFullYear(startDate.getFullYear() + 1)
        endDate.setDate(startDate.getDay() - 1)



        this.setState( {
            taxCalcString: taxCalcString,
            taxLoaded: true,
        })
    };

    copyCodeToClipboard = (copyText) => {
        function copyToClipboard(text) {
            let dummy = document.createElement("textarea");
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand("copy");
            document.body.removeChild(dummy);
        }
        copyToClipboard(copyText)
    }

    checkUstrAll = (event) => {
        this.setState({ checkDisabled: true, editUstrCheck: false })

        this.state.taxCalcString.forEach((item) => {
            let checkDate = item.startDate
            if (moment(moment(item.endDate)).diff() < 0) {
                if (this.state.taxData.find((pos) => pos.checkDate === checkDate)) {
                    if (this.state.taxData.find((pos) => pos.checkDate === checkDate).checkDateIs === false) {
                        Api.updateTaxData(this.state.taxData.find((pos) => pos.checkDate === checkDate).id, checkDate, true).then(() => {
                            event.disabled = false
                            this.setState({checkDisabled: false})
                            this.loadTaxData()
                        })
                    }
                } else {
                    Api.createTaxData(checkDate, true).then(() => {
                        event.disabled = false
                        this.setState({checkDisabled: false})
                        this.loadTaxData()
                    })
                }
            }
        });
    };

    toggleUstrCheck = (checkDate, event) => {
        this.setState({reloadInfo: true})
        event.disabled = true
        if (this.state.taxData.find((pos) => pos.checkDate === checkDate)) {
            if (this.state.taxData.find((pos) => pos.checkDate === checkDate).checkDateIs) {
                Api.updateTaxData(this.state.taxData.find((pos) => pos.checkDate === checkDate).id, checkDate, false).then(() => {
                    this.loadTaxData()
                    event.disabled = false
                })
            }else {
                Api.updateTaxData(this.state.taxData.find((pos) => pos.checkDate === checkDate).id, checkDate, true).then(() => {
                    this.loadTaxData()
                    event.disabled = false
                })
            }
        } else {
            Api.createTaxData(checkDate, true).then(() => {
                this.loadTaxData()
                event.disabled = false
            })
        }

        window.setTimeout(() => {
            this.setState({reloadInfo: false})}, 550)
    };

    render() {
        return (
            <div id="tax" className="Tax page-content">
                <div className="select-umstr">
                    <Form.Control as="select" title="date range" name="dateRange" value={this.state.dateRange}
                                  className="btn-semiActive"
                                  onChange={(e) => this.handleDateRange(e.target.value)}>
                        {this.state.dateRangeArr.map((sitem, ii) => (
                            <option key={ii} value={sitem.value}>
                                {sitem.name}
                            </option>
                        ))}
                    </Form.Control>
                </div>
                <div className="col-pageHeader"><h2 className="pageHeader">Steuer</h2></div>
                <br/>
                <br/>
                <Table hover className={`fix-table-noScroll scroll-content ${this.state.taxUstrCheck === this.state.dateRange ? "table-ustrcheck" : ""}`}>
                    <thead className="thead-style noMax">
                        <tr>
                            <th><div>Zeitintervall</div></th>
                            <th><div>MwSt<div className="d-none d-lg-inline">&nbsp;(%)</div></div></th>
                            <th className="th-netto"><div>Netto</div></th>
                            <th className="th-mwst"><div>MwSt<div className="d-none d-lg-inline">&nbsp;(€)</div></div></th>
                            <th className="th-brutto"><div>Brutto</div></th>
                            {this.state.taxUstrCheck === this.state.dateRange ? (
                                <th>
                                    <div id="checkUstrInfo">
                                        <InfoButton infoClass="checkUstrInfo" setLeft={true} dontBlur={true}/>
                                        <Button className={`btn-noStyle btn-Ustr ${!this.state.taxLoaded && "d-none" } ${this.state.taxData.length < this.state.taxCalcString.filter(item => item.netto !== 0).length && "active"} ${Object.values(this.state.taxData).every(item => item.checkDateIs) ? "" : "active"}`}
                                                onClick={() => this.setState({editUstrCheck: !this.state.editUstrCheck})}>
                                            USt.<div className={`d-none d-lg-inline d-xl-inline-block  ${this.state.taxData.length < this.state.taxCalcString.filter(item => item.netto !== 0).length && "d-lg-block"} ${Object.values(this.state.taxData).every(item => item.checkDateIs) ? "" : "d-lg-block"}`}>&nbsp;check</div>
                                        </Button>
                                        <React.Fragment>
                                            {Object.values(this.state.taxData).every(item => item.checkDateIs) ? null : (
                                                <Form.Check type="checkbox" title="check all"
                                                            onChange={(e) => this.checkUstrAll(e)}/>
                                            )}
                                        </React.Fragment>
                                    </div>
                                </th>
                            ) : null }
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.taxCalcString.map((item, i) => (
                            <React.Fragment key={i}>
                                { item.netto !== 0 ? (
                                    <React.Fragment>
                                        <tr className={`${this.state.taxData && this.state.taxData.find((pos) => pos.checkDate === item.startDate && pos.checkDateIs ) ? "isChecked" : "isUnchecked"} ${this.state.taxUstrCheck !== this.state.dateRange ? "noColor" : ""} ${moment(moment(item.endDate)).diff() > 0 ? " noColor" : ""} ${moment(moment(item.endDate)).diff() < 0 ? "" : ""}`}
                                            style={ this.state.taxUstrCheck === this.state.dateRange && moment(moment(item.endDate)).diff() > 0  ? {backgroundImage: "linear-gradient(to right, #f4f2de "+Math.round(((moment(moment(item.startDate)).diff()*-1)*100)/(moment(moment(item.endDate)).diff()+(moment(moment(item.startDate)).diff()*-1)))+"%, #f1f7ff "+Math.round(((moment(moment(item.startDate)).diff()*-1)*100)/(moment(moment(item.endDate)).diff()+(moment(moment(item.startDate)).diff()*-1)))+"%)"} : null}>
                                            <td className="position-relative">
                                                {Object.keys(item).length > 5 ? (
                                                    <button className="toggleTr position-absolute btn-noStyle" onClick={() => this.state.toggleTr === "" ? this.setState({toggleTr: i}) : this.setState({toggleTr: ""})}/>
                                                ) : null}
                                                {this.state.dateRange === "proJahr" ? (
                                                    <div aria-label={moment(item.startDate).format('DD.MM.YYYY')}>
                                                        {moment(item.startDate).format('YYYY')}
                                                    </div>
                                                ) : this.state.dateRange === "proMonat" ? (
                                                    <div aria-label={moment(item.startDate).format('DD.MM.YYYY')}>
                                                        {moment(item.startDate).format('MMMM YYYY')}
                                                    </div>
                                                ) : this.state.dateRange === "proQuartal" ? (
                                                    <div aria-label={moment(item.startDate).format('DD.MM.YYYY')}>
                                                        {moment(item.startDate).format('MM') >= "01" && moment(item.endDate).format('MM') <= "03" ? "1. Quartal " + moment(item.startDate).format('YYYY') : null}
                                                        {moment(item.startDate).format('MM') >= "04" && moment(item.endDate).format('MM') <= "06" ? "2. Quartal " + moment(item.startDate).format('YYYY') : null}
                                                        {moment(item.startDate).format('MM') >= "07" && moment(item.endDate).format('MM') <= "09" ? "3. Quartal " + moment(item.startDate).format('YYYY') : null}
                                                        {moment(item.startDate).format('MM') >= "10" && moment(item.endDate).format('MM') <= "12" ? "4. Quartal " + moment(item.startDate).format('YYYY') : null}
                                                    </div>
                                                ) : (
                                                    <React.Fragment>
                                                        {moment(item.startDate).format('DD.MM.YY') + " - " + moment(item.endDate).format('DD.MM.YY')}
                                                    </React.Fragment>
                                                )}
                                            </td>
                                            <td className="position-relative">
                                                {Object.keys(item).length > 5 ? (
                                                    <button className="toggleTr position-absolute btn-noStyle" onClick={() => this.state.toggleTr === "" ? this.setState({toggleTr: i}) : this.setState({toggleTr: ""})}/>
                                                ) : null}
                                                {this.state.optionsMwSt.map((mwst, k) =>
                                                    <React.Fragment key={k}>
                                                        {item[mwst] ? (
                                                            <div className="ml-1 px-0 d-inline-block">
                                                                {parseInt(mwst)}%
                                                            </div>
                                                        ) : null }
                                                    </React.Fragment>
                                                )}
                                            </td>
                                            <td>
                                                <div className="cursorCopy btn-copyLink td-netto" onClick={() => this.copyCodeToClipboard(item.netto.toFixed(2).replace(".", ","))}>
                                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.netto)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cursorCopy btn-copyLink td-mwst" onClick={() => this.copyCodeToClipboard(item.brutto-item.netto.toFixed(2).replace(".", ","))}>
                                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((item.brutto-item.netto))}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="cursorCopy btn-copyLink td-brutto" onClick={() => this.copyCodeToClipboard(item.brutto.toFixed(2).replace(".", ","))}>
                                                    <strong>{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.brutto)}</strong>
                                                </div>
                                            </td>
                                            {this.state.taxUstrCheck === this.state.dateRange ? (
                                                <td className="col-ust">
                                                    { moment(moment(item.endDate)).diff() < 0 ? (
                                                        <Form.Check type="checkbox" title="check ustr toggle editable"
                                                                    className={`${this.state.taxData.find((pos) => pos.checkDate === item.startDate && pos.checkDateIs ) ? 'd-none' : "" } ${this.state.editUstrCheck ? "d-inline-block" : ""}`}
                                                                    disabled={this.state.checkDisabled}
                                                                    checked={!!this.state.taxData.find((pos) => pos.checkDate === item.startDate && pos.checkDateIs)}
                                                                    onChange={(e) => this.toggleUstrCheck(item.startDate, e.target)}/>
                                                    ) : null}
                                                </td>
                                            ) : null}
                                        </tr>
                                        { Object.keys(item).length > 5 ? this.state.optionsMwSt.map((mwst, ky) =>
                                            <React.Fragment key={ky} >
                                                {mwst !== "0.0" && item[mwst] ? (
                                                    <tr className={`sub-tr ${this.state.toggleTr === i ? "" : "d-none"}`}>
                                                        <td/>
                                                        <td>
                                                    <span className="px-0">
                                                        {parseInt(mwst)}%
                                                    </span>
                                                        </td>
                                                        <td>
                                                            <div className="cursorCopy btn-copyLink" onClick={() => this.copyCodeToClipboard((((item[mwst] == null  ? 0 : item[mwst])*100)/mwst).toFixed(2).replace(".", ","))}>
                                                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((((item[mwst] == null  ? 0 : item[mwst])*100)/mwst))}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="cursorCopy btn-copyLink" onClick={() => this.copyCodeToClipboard((item[mwst] == null  ? 0 : item[mwst]).toFixed(2).replace(".", ","))}>
                                                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((item[mwst] == null  ? 0 : item[mwst]))}
                                                            </div>

                                                        </td>
                                                        <td>
                                                            <div className="cursorCopy btn-copyLink" onClick={() => this.copyCodeToClipboard(((((item[mwst] == null  ? 0 : item[mwst])*100)/mwst)+(item[mwst] == null  ? 0 : item[mwst])).toFixed(2).replace(".", ","))}>
                                                                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(((((item[mwst] == null  ? 0 : item[mwst])*100)/mwst)+(item[mwst] == null  ? 0 : item[mwst])))}
                                                            </div>
                                                        </td>
                                                        {this.state.taxUstrCheck === this.state.dateRange ? (
                                                            <td/>
                                                        ) : null}
                                                    </tr>
                                                ) : mwst === "0.0" && item[mwst] ? (
                                                    <tr>
                                                        <td/>
                                                        <text className="px-0">
                                                            0%
                                                        </text>
                                                        <td>
                                                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.brutto-(((( (item["7.0"] == null  ? 0 : item["7.0"])*100)/7)+ (item["7.0"] == null  ? 0 : item["7.0"]))+((((item["19.0"] == null  ? 0 : item["19.0"])*100)/19)+(item["19.0"] == null  ? 0 : item["19.0"]))))}
                                                        </td>
                                                        <td>
                                                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item["0.0"])}
                                                        </td>
                                                        <td>
                                                            {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.brutto-(((( (item["7.0"] == null  ? 0 : item["7.0"])*100)/7)+ (item["7.0"] == null  ? 0 : item["7.0"]))+((((item["19.0"] == null  ? 0 : item["19.0"])*100)/19)+(item["19.0"] == null  ? 0 : item["19.0"]))))}
                                                        </td>
                                                    </tr>
                                                ) : null }
                                            </React.Fragment>
                                        ) : null}
                                    </React.Fragment>
                                ) : (
                                    <tr className="tr-empty">
                                        <td colSpan={ this.state.taxUstrCheck === this.state.dateRange ? 6 : 5} className="text-center">...</td>
                                    </tr>
                                )
                                }
                            </React.Fragment>
                        ))}

                    </tbody>
                </Table>
                <div className="page-padding-bottom"/>
            </div>
        );
    }
}
