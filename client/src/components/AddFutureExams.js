import React, { Component } from 'react';
import '../App.css';
import {Popup, Card, Responsive} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'
import NewExamSelection from './NewExamSelection';

class AddFutureExams extends Component {

    constructor(props) {
        super(props);

        props.store.subscribe(store => {
            this.setState({ store: store });
        });
    }

    render() {
        return (
            <div>
                <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    <Card id="addFutureExamsCard">
                        <Card.Content header="Hinzufügen" />
                        <Card.Content id="addFutureExams">
                            <p>Hier kannst du Module einfügen, die du vor hast zukünftig abzulegen und erwartete Noten in deinen
                                Schnitt einkalkulieren.</p>
                            <NewExamSelection store={this.props.store} />
                        </Card.Content>
                    </Card>
                </Responsive>
                <Responsive {...Responsive.onlyMobile}>
                    <Card id="addFutureExamsCard-mobile">
                        <Card.Content header="Hinzufügen" />
                        <Card.Content id="addFutureExams">
                            <NewExamSelection store={this.props.store} />
                        </Card.Content>
                    </Card>
                </Responsive>
            </div>
        )
    }
}

export default AddFutureExams;
