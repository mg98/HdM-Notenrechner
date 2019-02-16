import React, {Component} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import logo from './hdm-logo.jpg'

const API_URL = process.env.REACT_APP_API_URL || '/api/';

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorMessage: null,
            loading: false
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
        .then(res => res.json())
        .then(res => {
            this.props.store.loggedIn = true
            this.props.store.studies = res.studies
            this.props.store.alleModule = res.alleModule
            this.props.store.leistungen = res.leistungen
            this.props.store.notify()
            this.setState({
                loading: false
            })
        }).catch(err => {
            console.log("error zurueckgeworfen");
            console.log(err);
            this.setState({
                errorMessage: err.response ? err.response.statusText : 'Unbekannter Fehler',
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
                  body > div,
                  body > div > div,
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
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default LoginForm