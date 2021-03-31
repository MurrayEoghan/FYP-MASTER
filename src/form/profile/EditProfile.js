import React, { useState, useEffect } from "react";
import { Form, Button, Container, Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import "../style.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditUserProfile(props) {
  let {
    firstname,
    lastname,
    userAge,
    userAddr1,
    userAddr2,
    userAddr3,
    userCountry,
    userCounty,
    profileId,
    disableEditing,
    saveToast,
  } = props;
  const genders = [
    { key: "m", text: "Male", value: "Male" },
    { key: "f", text: "Female", value: "Female" },
    { key: "o", text: "Other", value: "Other" },
  ];
  let [fname, setFname] = useState("");
  let [lname, setLname] = useState("");
  let [age, setAge] = useState(0);
  let [gender, setGender] = useState("");
  let [add1, setAdd1] = useState("");
  let [add2, setAdd2] = useState("");
  let [add3, setAdd3] = useState("");
  let [county, setCounty] = useState("");
  let [country, setCountry] = useState("");

  useEffect(() => {
    setFname(firstname);
    setLname(lastname);
    setAge(userAge);
    setAdd1(userAddr1);
    setAdd2(userAddr2);
    setAdd3(userAddr3);
    setCounty(userCounty);
    setCountry(userCountry);
  }, [
    firstname,
    lastname,
    userAddr1,
    userAddr2,
    userAddr3,
    userAge,
    userCountry,
    userCounty,
  ]);

  const headers = {
    "Content-Type": "application/json",
  };

  const data = {
    id: parseInt(profileId),
    fname: fname,
    lname: lname,
    age: parseInt(age),
    gender: gender.value,
    addr1: add1,
    addr2: add2 || " ",
    addr3: add3 || " ",
    county: county,
    country: country,
  };

  const handleDropdown = (e, { value }) => {
    setGender({ value });
  };

  async function submitForm() {
    try {
      await axios
        .post("http://localhost:8080/api/v1/update/profile", data, {
          headers: headers,
        })
        .then((res) => {
          disableEditing();
          saveToast();
        });
    } catch (err) {
      toast.error("Update Failed", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.log(err);
    }
  }

  return (
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <span className="tab-headers-text-edit">Edit Profile</span>

            <Container id="form-container">
              <Form widths="equal">
                <Form.Group>
                  <Form.Field inline>
                    <label>First Name</label>
                    <Form.Input
                      placeholder="First Name"
                      value={fname}
                      fluid
                      onChange={(e) => setFname(e.target.value)}
                    />
                  </Form.Field>
                  <Form.Field inline>
                    <label>Last Name</label>
                    <Form.Input
                      placeholder="Last Name"
                      value={lname}
                      fluid
                      onChange={(e) => setLname(e.target.value)}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Group>
                  <Form.Field inline>
                    <Form.Input
                      placeholder="Age"
                      label="Age"
                      value={age}
                      fluid
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </Form.Field>
                  <Form.Select
                    fluid
                    label="Gender"
                    options={genders}
                    onChange={handleDropdown}
                    placeholder="Gender"
                  />
                </Form.Group>
                <Form.Field>
                  <label>Address Line 1</label>
                  <Form.Input
                    placeholder="Address Line 1"
                    value={add1}
                    fluid
                    onChange={(e) => setAdd1(e.target.value)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Address Line 2</label>
                  <Form.Input
                    placeholder="Address Line 2 (Optional)"
                    fluid
                    value={add2}
                    onChange={(e) => setAdd2(e.target.value)}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Address Line 3</label>
                  <Form.Input
                    placeholder="Address Line 3 (Optional)"
                    fluid
                    value={add3}
                    onChange={(e) => setAdd3(e.target.value)}
                  />
                </Form.Field>
                <Form.Group>
                  <Form.Field inline>
                    <label>County</label>
                    <Form.Input
                      placeholder="County"
                      fluid
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                    />
                  </Form.Field>
                  <Form.Field inline>
                    <label>Country</label>
                    <Form.Input
                      placeholder="Country"
                      fluid
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Field>
                  <Button.Group>
                    <Button
                      primary
                      disabled={
                        fname !== "" && lname !== ""
                          ? age > 0
                            ? gender.value != null
                              ? add1 !== ""
                                ? county !== "" &&
                                  country !== "" &&
                                  county.indexOf(" ") < 0 &&
                                  country.indexOf(" ") < 0
                                  ? false
                                  : true
                                : true
                              : true
                            : true
                          : true
                      }
                      content="Save"
                      onClick={submitForm}
                    />
                    <Button.Or />
                    <Button onClick={disableEditing}>Cancel</Button>
                  </Button.Group>
                </Form.Field>
              </Form>
              <ToastContainer />
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
export default connect()(EditUserProfile);
