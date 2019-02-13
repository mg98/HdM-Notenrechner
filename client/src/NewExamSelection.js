import React, { Component } from 'react';
import './App.css';
import { Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

class NewExamSelection extends Component {

    constructor(props) {
        super(props);


        props.store.subscribe(store => {
            this.setState({ store: store });
        });
    }

    render() {
        return (
            <Table>
                <Table.Head>
                    <Table.Row>
                        <Table.HeaderCell>Studieng.</Table.HeaderCell>
                        <Table.HeaderCell>Modul</Table.HeaderCell>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>


                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        )
    }
}

export default NewExamSelection;
