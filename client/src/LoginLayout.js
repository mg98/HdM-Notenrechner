import React, {Component} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import logo from './hdm-logo.jpg'
import axios from "axios";

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
        axios.get('http://localhost:8080', {
            params: {
                username: this.state.username,
                password: this.state.password
            }
        }).then(res => {
            this.props.store.loggedIn = true;
            this.props.store.leistungen = res.data;
            this.props.store.notify();
            this.setState({
                loading: false
            });
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
            <div className='login-form'>
                <style>{`
                  body > div,
                  body > div > div,
                  body > div > div > div.login-form {
                    height: 100%;
                  }
                `}</style>
                <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <Header as='h2' color='teal' textAlign='center'>
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

                                <Button color='teal' fluid size='large' onClick={this.login}>
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