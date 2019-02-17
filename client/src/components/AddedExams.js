import React, { Component } from 'react';
import {Table, Grid, Header, Input} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import '../App.css';

class AddedExams extends Component {

    constructor(props) {
        super(props);

        props.store.subscribe(store => {
            this.setState({ store: store });
        });
    }

    handleNoteChange = (index, e) => {
        this.props.store.leistungen.hinzugefuegt[index].note = e.target.value;
        this.props.store.notify();
    };

    render() {
        if (this.props.store.leistungen.hinzugefuegt.length > 0) {
            return (
                <div>
                    <Header as='h3'>Geplante Leistungen</Header>
                    <Table className='notentabelle' celled>
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
                </div>
            )
        } else {
            return null
        }
    }
}

export default AddedExams;
