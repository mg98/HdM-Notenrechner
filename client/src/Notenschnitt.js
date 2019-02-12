import React, { Component } from 'react';
import './App.css';
import { Popup, Card } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

class App extends Component {

    state = {
        notenschnitt: 0,
        detailView: false
    };

    constructor(props) {
        console.log("notenschnitt constructor");
        super(props);

        this.calculate(this.props.store.leistungen);

        props.store.subscribe(store => {
            this.setState({ store: store });
            this.calculate(store.leistungen);
        });
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
        )
    }
}

export default App;
