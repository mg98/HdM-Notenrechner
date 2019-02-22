import React, { Component } from 'react';
import { Table, Icon, Header, Input, Dropdown } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import '../App.css';

class AddedExams extends Component {

    constructor(props) {
        super(props);

        props.store.subscribe(store => {
            this.setState({ store: store });
        })
    }

    handleNoteChange = (index, event, { value }) => {
        this.props.store.leistungen.hinzugefuegt[index].note = value
        this.props.store.notify()
    };

    removeAdded = (index) => {
        this.props.store.leistungen.hinzugefuegt.splice(index, 1)
        this.props.store.notify()
    }

    render() {
        if (this.props.store.leistungen.hinzugefuegt.length > 0) {
            return (
                <div>
                    <Header as='h3'>Geplante Leistungen</Header>
                    <Table className='notentabelle unstackable' celled>
                        <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell>Modul</Table.HeaderCell>
                        <Table.HeaderCell>ECTS</Table.HeaderCell>
                        <Table.HeaderCell>Note</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                        <Table.Body>
                            {this.props.store.leistungen.hinzugefuegt.map((leistung, index) => {
                                return (
                                    <Table.Row key={index}>
                                        <Table.Cell>
                                            <Icon name='remove' onClick={this.removeAdded.bind(this, index)} />
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

export default AddedExams;
