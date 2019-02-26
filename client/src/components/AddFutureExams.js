import React, { Component } from 'react';
import '../App.css';
import { Icon, Card, Responsive } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import NewExamSelection from './NewExamSelection';

class AddFutureExams extends Component {

    constructor(props) {
        super(props);

        props.store.subscribe(store => {
            this.setState({ store: store });
        });
    }

    toggleNewExamSelection = () => {
        this.props.store.showAddContent = !this.props.store.showAddContent
        this.props.store.notify()
    }

    render() {
        return (
            <div>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    <Card id="addFutureExamsCard">
                        <Card.Content header="Hinzufügen" />
                        <Card.Content id="addFutureExams">
                            <p>Hier kannst du Module einfügen, die du vor hast zukünftig abzulegen und erwartete Noten
                                in deinen Schnitt einkalkulieren.</p>
                            <NewExamSelection store={this.props.store} />
                        </Card.Content>
                    </Card>
                </Responsive>
                <Responsive {...Responsive.onlyMobile}>
                    <Card id="addFutureExamsCard-mobile">
                        <Card.Content onClick={this.toggleNewExamSelection}>
                            <Card.Header>
                                Hinzufügen
                                <Icon name={this.props.store.showAddContent ? 'angle down' : 'angle up'} />
                            </Card.Header>
                        </Card.Content>
                        <Card.Content id='addFutureExams' style={{
                            display: this.props.store.showAddContent ? 'block' : 'none'
                        }}>
                            <NewExamSelection store={this.props.store} />
                        </Card.Content>
                    </Card>
                </Responsive>
            </div>
        )
    }
}

export default AddFutureExams;
