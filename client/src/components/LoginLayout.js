import React, {Component} from 'react'
import { Modal, List, Icon, Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import logo from '../hdm-logo.jpg'

const API_URL = process.env.REACT_APP_API_URL || '/api/';
const githubUrl = 'https://github.com/mg98/HdM-Notenrechner'

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: null,
            loading: false,
            showDatenschutz: false,
            showImpressum: false
        };
    }

    changeUsername = (event, target) => {
        this.setState({ username: target.value })
    };

    changePassword = (event, target) => {
        this.setState({ password: target.value })
    };

    login = () => {
        this.setState({
            loading: true
        });

        fetch(API_URL, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify({username: this.state.username, password: this.state.password}), // body data type must match "Content-Type" header
        })
        .then(res => {
            if (!res.ok) {
                throw Error(res.statusText);
            }
            return res;
        })
        .then(res => res.json())
        .then(res => {
            this.props.store.loggedIn = true
            this.props.store.semester = res.semester
            this.props.store.studies = res.studies
            this.props.store.alleModule = res.alleModule
            this.props.store.leistungen = res.leistungen
            this.props.store.leistungen.hinzugefuegt = []
            this.props.store.notify()
            this.setState({
                loading: false
            })
        }).catch(err => {
            console.log("halloo", err);
            this.setState({
                errorMessage: err ? err.message : 'Unbekannter Fehler',
                loading: false
            });
        })
    };

    render() {
        let message;
        if (this.state.errorMessage) {
            message = (
                <Message negative>
                    {this.state.errorMessage}
                </Message>
            )
        }

        return (
            <div id='login-form'>
                <style>{`
                  body > div:not(.modal),
                  body > div > div:not(.modal),
                  body > div > div > div.login-form {
                    height: 100%;
                  }
                `}</style>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' textAlign='center'>
                            <Image src={logo} /> Log dich ein
                        </Header>
                        <Form size='large' loading={this.state.loading}>
                            <Segment stacked>
                                <Form.Input
                                    fluid
                                    icon='user'
                                    iconPosition='left'
                                    placeholder='HdM-Kürzel'
                                    onChange={this.changeUsername}
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='Passwort'
                                    type='password'
                                    onChange={this.changePassword}
                                />

                                <Button fluid size='large' onClick={this.login}>
                                    Login
                                </Button>
                            </Segment>
                        </Form>
                        {message}

                        <List id='footer-links' bulleted horizontal>

                            <List.Item as='a' href='{githubUrl}' target='_blank'>
                                <Icon name='github' /> GitHub
                            </List.Item>

                            <Modal basic size='small' closeIcon trigger={<List.Item as='a'>Datenschutz</List.Item>}>
                                <Header icon='browser' content='Hinweise zur Sicherheit und zum Datenschutz' />
                                <Modal.Content>
                                    <Modal.Description>
                                        <p>Ist es sicher meine HdM-Daten hier einzugeben?</p>
                                        <p>Sehr sicher!</p>
                                        <List bulleted>
                                            <List.Item>
                                                Notenrechner.io verarbeitet deine Daten nur im Moment der Verbindung
                                                mit dem Server von hdm-stuttgart.de. Deine Login-Daten werden zu keinem
                                                Zeitpunkt weder client- noch serverseitig gespeichert!
                                            </List.Item>
                                            <List.Item>Alle Verbindungen sind mit SSL verschlüsselt!</List.Item>
                                            <List.Item>
                                                100% Transparenz - Der originale auf notenrechner.io zum Einsatz
                                                kommende Source Code ist auf <a href="{githubUrl}" target='_blank'>GitHub</a> einsehbar!
                                            </List.Item>
                                            <List.Item>
                                                Hoher Sicherheitsstandard bei der Server-Konfiguration
                                            </List.Item>
                                        </List>
                                        <br/>
                                        <p>Welche Daten werden gespeichert?</p>
                                        <p>
                                            Aus Sicherheitsgründen wird in unseren Server-Log-Dateien ein notwendiges
                                            Minimum an Daten aufgezeichnet. Diese beinhalten:
                                        </p>
                                        <List bulleted>
                                            <List.Item>Datum und Uhrzeit der Server-Anfrage</List.Item>
                                            <List.Item>Browsertyp und Browserversion (User Agent)</List.Item>
                                            <List.Item>Deine IP-Adresse</List.Item>
                                        </List>
                                        <p>
                                            Diese Daten werden nicht und können auch nachträglich nicht in Verbindung
                                            gebracht werden mit den auf der Webseite verwendeten HdM-Nutzerdaten!
                                        </p>
                                        <p>Wir speichern auch keine Cookies!</p>
                                    </Modal.Description>
                                </Modal.Content>
                            </Modal>

                            <List.Item as='a' href='http://gregoriadis.de/' target='_blank'>Impressum</List.Item>

                        </List>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default LoginForm