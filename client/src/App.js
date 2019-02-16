import React, { Component } from 'react';
import axios from 'axios';
import loading from './loading.gif';
import './App.css';
import { Container, Grid, Table, Label, Input, Header } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import Notenschnitt from './Notenschnitt'
import AddFutureExams from './AddFutureExams'
import LoginForm from './LoginLayout';

class App extends Component {

    constructor(props) {
        super(props);

        props.store.subscribe(store => this.setState({ store: store }));
    }

    handleNoteChange = (index, e) => {
        this.props.store.leistungen.angemeldet[index].note = e.target.value;
        this.props.store.notify();
    };

    render() {
        if (this.props.store.loggedIn === false) {
            return <LoginForm store={this.props.store} />
        } else {
            return (
                <Container>
                    <Grid>
                        <Grid.Column width={10}>
                            <Header as='h3'>Angemeldete aber noch nicht bewertete Leistungen</Header>
                            <Table className='notentabelle' celled>
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
                                                    <Input className="noteInput" type="number" steps="0.3"
                                                       onChange={this.handleNoteChange.bind(this, index)}
                                                       value={leistung.note}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })}
                                </Table.Body>
                            </Table>
                            <Header as='h3'>Bestandene Leistungen</Header>
                            <Table className='notentabelle' celled>
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
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Notenschnitt store={this.props.store} />
                            <AddFutureExams store={this.props.store} />
                        </Grid.Column>
                    </Grid>
                </Container>
            )
        }

    }
}

export default App;
