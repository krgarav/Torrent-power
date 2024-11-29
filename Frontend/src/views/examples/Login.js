/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// reactstrap components
import Loader from "components/Loader/Loader";
import { login } from "helper/userManagment_helper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { setAccess } from "routes";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log(email)
    console.log(password)
  }, [email, password]);


  const handleLogin = async () => {
    try {
      setLoader(true);
      const data = await login({ email, password });
      setLoader(false);
      if (data?.success) {
        const token = data?.token;
        const userData = data?.data;
        localStorage.setItem('auth', JSON.stringify({ token, userData }));
        toast.success(data?.message);
        // setAccess();
        navigate("/");
        window.location.reload();

      }
      console.log(data);
    } catch (error) {
      setLoader(false);
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <>
      {loader ? (
        <Loader />
      ) : ("")}
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <div className="text-center text-muted mt-4">
            <img
              alt="..."
              src={require("../../assets/img/brand/ios.png")}
              height={"30rem"}
            />
          </div>
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">

              <h1>Sign in </h1>
            </div>
            <Form role="form" onKeyDown={(e) => e.key === "Enter" && handleLogin()}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="primary" type="button" onClick={handleLogin}>
                  Sign in
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
