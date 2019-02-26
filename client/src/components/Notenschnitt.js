import React, { Component } from 'react';
import '../App.css';
import {Popup, Card, Responsive} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import EctsAnzeige from "../App";
import {Grid} from "semantic-ui-react/dist/commonjs/collections/Grid";

class Notenschnitt extends Component {

    state = {
        notenschnitt: 0,
        detailView: false
    };

    constructor(props) {
        super(props);

        props.store.subscribe(store => {
            this.setState({ store: store });
            this.calculate(store.leistungen);
        });
    }

    componentDidMount() {
        this.calculate(this.props.store.leistungen);
    }

    calculate = (leistungen) => {
        let notenSumme = 0;
        let ectsSumme = 0;

        for (const i in leistungen.bestanden) {
            const leistung = leistungen.bestanden[i];
            notenSumme += leistung.ects * leistung.note;
            ectsSumme += leistung.ects;
        }

        for (const i in leistungen.angemeldet) {
            const leistung = leistungen.angemeldet[i];
            if (leistung.note && leistung.note !== '') {
                const note = parseInt(leistung.note.replace(',', '.'));
                if (!isNaN(note)) {
                    notenSumme += leistung.ects * leistung.note;
                    ectsSumme += leistung.ects;
                }
            }
        }

        for (const i in leistungen.hinzugefuegt) {
            const leistung = leistungen.hinzugefuegt[i];
            if (leistung.note && leistung.note !== '') {
                const note = parseInt(leistung.note.replace(',', '.'));
                if (!isNaN(note)) {
                    notenSumme += leistung.ects * leistung.note;
                    ectsSumme += leistung.ects;
                }
            }
        }

        this.setState({
            notenschnitt: notenSumme / ectsSumme
        });
    };

    toggleDetailView = () => {
        this.setState({
            detailView: !this.state.detailView
        })
    };

    render() {
        let notenschnitt = <span>{this.state.notenschnitt.toFixed(2)}</span>;
        if (this.state.detailView) {
            const detail = this.state.notenschnitt.toFixed(10)
            notenschnitt = (
                <span>
                    <span className="notenschnitt-begin">{detail.substring(0, 4)}</span>
                    <span className="notenschnitt-end">{detail.substring(4)}</span>
                </span>
            )
        }

        const style = {
            borderRadius: 0,
            opacity: 0.7,
            padding: '8px',
        };

        return (
            <div>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    <Card id="notenschnittCard">
                        <Card.Content header="Durchschnitt" />
                        <Card.Content id="notenschnitt" onClick={this.toggleDetailView}>
                            <Popup
                                trigger={notenschnitt}
                                content='Genauer'
                                position='bottom left'
                                style={style}
                                inverted
                            />
                        </Card.Content>
                    </Card>
                </Responsive>
                <Responsive {...Responsive.onlyMobile}>
                    <Card id='notenschnittCard-mobile' className={this.props.store.showAddContent ? 'pushup' : ''}>
                        <Card.Content>
                            <Card.Header>
                                Durchschnitt:
                                <span className="right floated">{this.state.notenschnitt.toFixed(2)}</span>
                            </Card.Header>
                        </Card.Content>
                    </Card>
                </Responsive>
            </div>
        )
    }
}

export default Notenschnitt;
