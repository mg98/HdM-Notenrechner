import React, { Component } from 'react';
import './App.css';
import {Responsive, Container, Grid, Table, Header, Dropdown} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import Notenschnitt from './components/Notenschnitt'
import AddFutureExams from './components/AddFutureExams'
import LoginForm from './components/LoginLayout';
import EctsAnzeige from "./components/EctsAnzeige";
import AddedExams from "./components/AddedExams";
import MandatoryExams from "./components/MandatoryExams";
import * as Constants from './constants'

class App extends Component {

    constructor(props) {
        super(props);

        props.store.subscribe(store => this.setState({ store: store }));
    }

    handleNoteChange = (index, event, { value }) => {
        this.props.store.leistungen.angemeldet[index].note = value;
        this.props.store.notify();
    };

    render() {
        if (this.props.store.loggedIn === false) {
            return <LoginForm store={this.props.store} />
        } else {
            return (
                <Container>
                    <Grid>
                        <Grid.Column mobile={16} tablet={10} computer={10}>
                            <AddedExams store={this.props.store} />
                            <MandatoryExams store={this.props.store} />
                            <Header as='h4'>Angemeldete aber noch nicht bewertete Leistungen</Header>
                            <Table className='notentabelle unstackable' celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Modul</Table.HeaderCell>
                                        <Table.HeaderCell>ECTS</Table.HeaderCell>
                                        <Table.HeaderCell>Note</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.props.store.leistungen.angemeldet.map((leistung, index) => {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell>{leistung.name}</Table.Cell>
                                                <Table.Cell>{leistung.ects}</Table.Cell>
                                                <Table.Cell>
                                                    {!Constants.examsWithoutGrade.includes(leistung.name) &&
                                                        <Dropdown fluid search selection placeholder='Note'
                                                              options={Constants.notenOptions}
                                                              onChange={this.handleNoteChange.bind(this, index)}
                                                              value={leistung.note} />
                                                    }
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table>
                            <Header as='h4'>Bestandene Leistungen</Header>
                            <Table className='notentabelle unstackable' celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Modul</Table.HeaderCell>
                                        <Table.HeaderCell>ECTS</Table.HeaderCell>
                                        <Table.HeaderCell>Note</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.props.store.leistungen.bestanden.map(function(leistung, index) {
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell>{leistung.name}</Table.Cell>
                                                <Table.Cell>{leistung.ects}</Table.Cell>
                                                <Table.Cell>{leistung.note ? leistung.note.toFixed(1) : ''}</Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table>

                            <Responsive id='mobile-scroll-fix' {...Responsive.onlyMobile} />
                        </Grid.Column>
                        <Grid.Column id='sidebar' width={6}>
                            <Notenschnitt store={this.props.store} />
                            <EctsAnzeige store={this.props.store} />
                            <AddFutureExams store={this.props.store} />
                        </Grid.Column>
                    </Grid>
                </Container>
            )
        }

    }
}

export default App;
