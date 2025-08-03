import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const Register = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // Here you would typically handle the registration logic
  };

  return (
    <Card title="Inscription" style={{ width: 300, margin: '20px auto' }}>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: 'email',
              message: "L'email saisi n'est pas valide",
            },
            {
              required: true,
              message: "Veuillez saisir un email",
            },
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Veuillez saisir un nom d'utilisateur",
              whitespace: true,
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nom d'utilisateur" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Veuillez saisir un mot de passe",
            },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Mot de passe" />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Veuillez confirmer votre mot de passe",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Les mots de passe saisis ne correspondent pas'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Confirmer le mot de passe" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            S'inscrire
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Register;