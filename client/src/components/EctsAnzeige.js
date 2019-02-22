import React, { Component } from 'react';
import '../App.css';
import {Popup, Card, Responsive} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

class EctsAnzeige extends Component {

    state = {
        ects: 0,
        angemeldeteEcts: 0,
        geplanteEcts: 0
    };

    constructor(props) {
        super(props);

        props.store.subscribe(store => {
            this.setState({ store: store });
            this.calculate(store.leistungen);
        });
    }

    componentDidMount() {
        this.calculate(this.props.store.leistungen)
    }

    calculate = (leistungen) => {
        let ects = 0
        for (const i in leistungen.bestanden) {
            ects += leistungen.bestanden[i].ects;
        }

        let angemeldeteEcts = 0
        for (const i in leistungen.angemeldet) {
            angemeldeteEcts += leistungen.angemeldet[i].ects;
        }

        let geplanteEcts = 0
        for (const i in leistungen.hinzugefuegt) {
            geplanteEcts += leistungen.hinzugefuegt[i].ects;
        }

        this.setState({
            ects: ects,
            angemeldeteEcts: angemeldeteEcts,
            geplanteEcts: geplanteEcts
        });
    }

    render() {
        return (
            <div>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    <Card id="ectsAnzeigeCard">
                        <Card.Content header="ECTS" />
                        <Card.Content id="ectsAnzeige">
                            <p>Fachsemester: {this.props.store.semester} (ideal {(this.props.store.semester - 1) * 30} ECTS)</p>
                            <p>{this.state.ects} / {7*30} ECTS</p>
                            <br/>
                            <p>Bei Bestehen aller angemeldeten Leistungen:</p>
                            <p>{this.state.ects + this.state.angemeldeteEcts} / {7*30} ECTS</p>
                            <br/>
                            <p>Mit geplanten Leistungen:</p>
                            <p>{this.state.ects + this.state.angemeldeteEcts + this.state.geplanteEcts} / {7*30} ECTS</p>
                        </Card.Content>
                    </Card>
                </Responsive>
                <Responsive {...Responsive.onlyMobile}>
                    <Card id='ectsAnzeigeCard-mobile'>
                        <Card.Content>
                            <Card.Header>
                                ECTS:
                                <span className='right floated'>{this.state.ects} / {7*30}</span>
                            </Card.Header>
                        </Card.Content>
                        <Card.Content id="ectsAnzeige">
                            <p>
                                Mit angemeldeten Leistungen:
                                <span className='right floated'>{this.state.ects + this.state.angemeldeteEcts} / {7*30} ECTS</span>
                            </p>
                            <p>
                                Mit geplanten Leistungen:
                                <span className='right floated'>{this.state.ects + this.state.angemeldeteEcts + this.state.geplanteEcts} / {7*30} ECTS</span>
                            </p>
                        </Card.Content>
                    </Card>
                </Responsive>
            </div>
        )
    }
}

export default EctsAnzeige;
