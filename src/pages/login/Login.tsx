import React, {useState} from 'react';
import {Button, Col, Flex, Form, Input, notification, Row, theme} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {useAuth} from "../../hooks/AuthContext.tsx";
import {AxiosResponse} from "axios";
import useApi from "../../hooks/ApiContext.tsx";

export interface LoginResult {
  token: string;
}

export interface LoginPageProps {
  isSignUp?: boolean;
}

const LoginPage: React.FC<LoginPageProps> = (
  {
    isSignUp,
  }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const api = useApi();
  const [notificationApi, contextHolder] = notification.useNotification();

  React.useEffect(() => {
    if (auth && auth.token) {
      navigate('/main');
    }
  }, [navigate, auth])

  const loginMutation = useMutation({
    mutationFn: (login: unknown) => {
      setLoading(true);
      return api.post('/v1/auth/login', login);
    },
    onSuccess: (result: AxiosResponse<LoginResult>) => {
      setLoading(false);
      auth.updateToken(result.data.token);
      navigate('/main')
    },
    onError: (error) => {
      console.log('error', error);
      setLoading(false);
    }
  })

  const signUpMutation = useMutation({
    mutationFn: (login: unknown) => {
      setLoading(true);
      return api.post('/v1/auth/signup', login);
    },
    onSuccess: (_: AxiosResponse<LoginResult>) => {
      setLoading(false);
      notificationApi.info({message: 'Success! Check your email', placement: 'bottomRight'});
    },
    onError: (error) => {
      console.log('error', error);
      setLoading(false);
    }
  })

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const onFinish = (values: unknown) => {
    setLoading(true);
    console.log('Received values of form: ', values);
    // Here you can call your API to login the user with the values
    setLoading(false);
  };

  return (
    <div
      style={{
        background: colorBgContainer,
        minHeight: 280,
        padding: 24,
        borderRadius: borderRadiusLG,
      }}
    >
      {contextHolder}
      <Row>
        <Col xs={{span: 5, offset: 1}} lg={{span: 6, offset: 2}}>
        </Col>
        <Col xs={{span: 11, offset: 1}} lg={{span: 6, offset: 2}} style={{margin: 0}}>
          <Flex gap="middle" justify={"center"} align={"center"} flex={1} style={{width: '100%'}}>
            <Form
              form={form}
              name="normal_login"
              style={{maxWidth: '400px', margin: '0 auto'}}
              initialValues={{remember: true}}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[{required: true, message: 'Please input your Email!'}]}
              >
                <Input style={{width: '100%'}} prefix={<UserOutlined className="site-form-item-icon"/>}
                       placeholder="Email"/>
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{required: true, message: 'Please input your Password!'}]}
              >
                <Input
                  style={{width: '100%'}}
                  prefix={<LockOutlined className="site-form-item-icon"/>}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="button" style={{width: '100%'}} loading={loading}
                        onClick={() => {
                          if (isSignUp) {
                            signUpMutation.mutate({
                              "email": form.getFieldValue("email"),
                              "password": form.getFieldValue("password")
                            })
                          } else {
                            loginMutation.mutate({
                              "email": form.getFieldValue("email"),
                              "password": form.getFieldValue("password")
                            })
                          }
                        }}>
                  {isSignUp ? 'Sign Up' : 'Log in'}
                </Button>
              </Form.Item>
              <Form.Item>
                <Flex justify={"space-between"}>
                  <Link to={'/forgot'}>
                    Forgot password
                  </Link>
                  <Link to={isSignUp ? '/login' : '/signup'}>
                    {isSignUp ? 'Log in' : 'Sign Up'}
                  </Link>
                </Flex>
              </Form.Item>
            </Form>
          </Flex>
        </Col>
        <Col xs={{span: 5, offset: 1}} lg={{span: 6, offset: 2}}>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
