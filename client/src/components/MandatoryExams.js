import React, { Component } from 'react';
import { Icon, Table, Header, Dropdown } from 'semantic-ui-react';
import * as Constants from '../constants'
import 'semantic-ui-css/semantic.min.css'
import '../App.css';

class MandatoryExams extends Component {

    state = {
        visible: true
    }

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

    toggle = () => {
        this.setState({
            visible: !this.state.visible
        })
    }

    render() {
        if (this.props.store.leistungen.mandatoryExams.length > 0) {
            return (
                <div>
                    <Header as='h4' title='Aus Grundstudium und Wahlpflicht' className='left floated'>
                        Übrige Pflichtmodule
                    </Header>
                    <Icon name={this.state.visible ? 'angle down' : 'angle up'}
                          className='toggleExamTable' onClick={this.toggle} />

                    <Table className={'notentabelle unstackable' +
                        (this.state.visible ? '' : ' hiddenTable')} celled>
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
                </div>
            )
        } else {
            return null
        }
    }
}

export default MandatoryExams;
