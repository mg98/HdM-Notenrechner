import React, { Component } from 'react';
import '../App.css';
import { Popup, Card } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

class EctsAnzeige extends Component {

    state = {
        ects: 0,
        angemeldeteEcts: 0,
        geplanteEcts: 0
    };

    constructor(props) {
        super(props);

        this.calculate(props.store.leistungen)

        props.store.subscribe(store => {
            this.setState({ store: store });
            this.calculate(store.leistungen);
        });
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
            angemeldeteEcts: angemeldeteEcts
        });
    }

    render() {
        return (
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
        )
    }
}

export default EctsAnzeige;