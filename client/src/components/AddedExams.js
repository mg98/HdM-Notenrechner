import React, { Component } from 'react';
import { Table, Icon, Header, Dropdown } from 'semantic-ui-react';
import * as Constants from '../constants'
import 'semantic-ui-css/semantic.min.css'
import '../App.css';

class AddedExams extends Component {

    state = {
        visible: true
    }

    constructor(props) {
        super(props);

        props.store.subscribe(store => {
            this.setState({ store: store });
        })
    }

    toggle = () => {
        this.setState({
            visible: !this.state.visible
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
                <React.Fragment>
                    <Header as='h4' className='left floated'>Geplante Leistungen</Header>
                    <Icon name={this.state.visible ? 'angle down' : 'angle up'}
                          className='toggleExamTable' onClick={this.toggle} />

                    <Table className={'notentabelle unstackable' +
                        (this.state.visible ? '' : ' hiddenTable')} celled style={{marginBottom: '30px'}}>
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
                                            <Icon name='remove'
                                                  title='Entfernen'
                                                  onClick={this.removeAdded.bind(this, index)} />
                                            {leistung.name}
                                        </Table.Cell>
                                        <Table.Cell>{leistung.ects}</Table.Cell>
                                        <Table.Cell>
                                            <Dropdown fluid search selection placeholder='Note'
                                                      options={Constants.notenOptions}
                                                      value={leistung.note}
                                                      onChange={this.handleNoteChange.bind(this, index)} />
                                        </Table.Cell>
                                    </Table.Row>
                                )
                            })}
                        </Table.Body>
                    </Table>
                </React.Fragment>
            )
        } else {
            return null
        }
    }
}

export default AddedExams;
