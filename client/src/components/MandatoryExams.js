import React, { Component } from 'react';
import { Table, Header, Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import '../App.css';

class MandatoryExams extends Component {

    constructor(props) {
        super(props);

        props.store.subscribe(store => {
            this.setState({ store: store });
        })
    }

    handleNoteChange = (index, event, { value }) => {
        this.props.store.leistungen.mandatoryExams[index].note = value
        this.props.store.notify()
    };

    render() {
        if (this.props.store.leistungen.mandatoryExams.length > 0) {
            return (
                <div>
                    <Header as='h4' title='Aus Grundstudium und Wahlpflicht'>Übrige Pflichtmodule</Header>
                    <Table className='notentabelle unstackable' celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Modul</Table.HeaderCell>
                                <Table.HeaderCell>ECTS</Table.HeaderCell>
                                <Table.HeaderCell>Note</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {this.props.store.leistungen.mandatoryExams.map((leistung, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>
                                            {leistung.name}
                                        </Table.Cell>
                                        <Table.Cell>{leistung.ects}</Table.Cell>
                                        <Table.Cell>
                                            <Dropdown fluid search selection placeholder='Note'
                                                      options={this.props.notenOptions}
                                                      value={leistung.note}
                                                      onChange={this.handleNoteChange.bind(this, index)} />
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </div>
            )
        } else {
            return null
        }
    }
}

export default MandatoryExams;