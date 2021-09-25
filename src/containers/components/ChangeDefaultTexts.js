import React, {Component} from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Api from "../../Api";
import EscapeOutside from "react-escape-outside";
import InfoButton from "./InfoButton";

export default class ChangeDefaultTexts extends Component {

    state = {
        editMode: false,
        defaultTexts: [],
        text1: "",
        text2: ""
    }

    componentDidMount() {
        this.loadDefaultTexts();
    }

    loadDefaultTexts = () => {
        Api.getDefaultTexts().then((response) => {
            this.setState({
                defaultTexts: response.data,
            })
        });
    };

    handleDefaultTextsInputChange = (name, value) => {
        this.setState({
            defaultTexts: {
                ...this.state.defaultTexts,
                [name]: value
            }
        });
    }
    handleUpdateDefaultTexts = () => {
        document.body.classList.remove('blur-page')
        this.setState({editMode: false})
        Api.updateDefaultTexts(this.state.defaultTexts.text1, this.state.defaultTexts.text2);
    };

    toggleAccordion = () => {
        if (!this.state.editMode) {
            this.setState({editMode: true})
            document.body.classList.add('blur-page')
        } else {
            this.setState({editMode: false})
            document.body.classList.remove('blur-page')
            this.loadDefaultTexts()
        }
    }

    render() {
        return (
            <div className="setAccordion"  style={{zIndex: this.state.editMode ? 110 : 1, width: this.state.editMode ? "max-content" : "185px", marginRight: this.state.editMode ?"-1px" : "0"}}>
                <EscapeOutside onEscapeOutside={ () => this.state.editMode && this.toggleAccordion()}
                               style={{zIndex: this.state.editMode ? 110 : 1 }}
                               className={`mAccordion ${this.props.positonLeft ? "mAccordion-left" :""}`}>
                    <React.Fragment>
                        <Button onClick={() => this.toggleAccordion()}
                                className={`btn-openAccordion btn-tDefault ${this.props.positonLeft ? "select-left" : "select-right"} ${this.props.isActive ? !this.state.editMode ? "btn-semiActive" :"btn-active" : !this.state.editMode ? "btn-inActive" :"btn-inActive-on"}`}>
                            <div className="d-none d-md-inline">standard</div>&nbsp;Texte ändern</Button>
                        <div>
                            {this.state.editMode ? (
                                <InfoButton infoClass="infoDefaultText" reload={this.state.editMode} hide={!this.state.editMode} setLeft={true} dontBlur={true}/>
                            ) : null}
                            <div id="infoDefaultText" className={`mAccordion-container ${this.state.editMode ? "show" : ""}`}>
                                <Card className={this.state.editMode ? "show" : ""}>
                                    <Card.Body>
                                        <Form>
                                            <Form.Row className="pr-1">
                                                <Form.Group as={Col} md={6} sm={12}>
                                                    {this.state.editMode === true ? (
                                                        <Form.Control type="text" as="textarea" title="Company name" placeholder={`Liebe $UNTERNEHMEN,\nwie vereinbart nun die Rechnung:`}
                                                                      value={this.state.defaultTexts.text1}
                                                                      style={{minHeight: "200px"}}
                                                                      onChange={(e) => {this.handleDefaultTextsInputChange( "text1", e.target.value);}}/>
                                                    ) : (
                                                        <Form.Label title="text 1">{this.state.defaultTexts.text1}</Form.Label>
                                                    )}
                                                </Form.Group>
                                                <Form.Group as={Col} md={6} sm={12}>
                                                    {this.state.editMode === true ? (
                                                        <Form.Control type="text" as="textarea" title="Company name" placeholder={`Ich bitte um Zahlung innerhalb von 14 Tagen ab Rechnungseingang an die unten angegebene Bankverbindung.\n\nMit freundlichen Grüßen,`}
                                                                      value={this.state.defaultTexts.text2}
                                                                      style={{minHeight: "200px"}}
                                                                      onChange={(e) => {this.handleDefaultTextsInputChange( "text2", e.target.value);}}/>
                                                    ) : (
                                                        <Form.Label title="text 2">{this.state.defaultTexts.text2}</Form.Label>
                                                    )}
                                                </Form.Group>
                                            </Form.Row>


                                            {this.state.editMode === true ? (
                                                <Form.Row>
                                                    <Form.Group as={Col} className="saveDefaultText text-right mb-0">
                                                        <Button type="submit" className="accordion-save-button btn-tDefault btn-tSubmit" onClick={(event) => {event.preventDefault(); this.handleUpdateDefaultTexts();}}>speichern</Button>
                                                    </Form.Group>
                                                </Form.Row>
                                            ) : null}
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </React.Fragment>
                </EscapeOutside>
            </div>
        );
    }
}
