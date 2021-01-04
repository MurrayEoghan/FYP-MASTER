import axios from "axios"
import React, {useState, useEffect} from "react"
import {Container, Grid, Input, Button, Icon} from "semantic-ui-react"
import {connect} from "react-redux"
import "../style.css"

function Login(){
    const headers = {
        
        "Content-Type":"application/json"
    }


    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    let [responseCode, setResponseCode] = useState(0)
    const data = {
        "username":username,
        "password":password
    }
    function handlePassword(e){
        setPassword(e.target.value)
    }
    function handleUsername(e){
        setUsername(e.target.value)
    }
    async function fetchData(){
        
        await axios.post("http://localhost:8080/api/v1/login",data, {headers: headers})
        .then(res => {
            setResponseCode(res.status)
        })
        
    }

    const handleSubmit = (e) =>{
        e.preventDefault()
        fetchData()
    }
    // useEffect(() => {

    // }, [username, password])

    return (
        <Container id="container" textAlign="center">
            <Grid  id="login-grid" >
                <Grid.Column >
                    <Grid.Row className="grid-row" centered>
                        <Icon name="users" size="massive" className="generic-form-header-icon"/>
                    </Grid.Row>
                    <Grid.Row className="grid-row" >
                        <Input fluid placeholder="User name" icon="user" value={username} onChange={handleUsername}/>
                    </Grid.Row>
                    <Grid.Row className="grid-row">
                        <Input fluid placeholder="Password" value={password} icon="key" onChange={handlePassword} />
                    </Grid.Row>
                    <Grid.Row className="grid-row">
                        <Button id="submit-button" onClick={handleSubmit} fluid content="Submit"/>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        </Container>
    )
}

export default connect()(Login)