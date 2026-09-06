import React, { useContext, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons';

const Register = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register({
        email: values.email,
        password: values.password,
        public_name: values.public_name,
      });
      message.success('Inscription réussie, vous pouvez maintenant vous connecter');
      form.resetFields();
    } catch (error) {
      const responseData = error.response?.data;
      const errorMessage = responseData
        ? Object.values(responseData).flat().join(' ')
        : "Échec de l'inscription, veuillez réessayer";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
          name="public_name"
          rules={[
            {
              required: true,
              message: "Veuillez saisir un pseudonyme",
              whitespace: true,
            },
          ]}
        >
          <Input prefix={<IdcardOutlined className="site-form-item-icon" />} placeholder="Pseudonyme" />
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
          <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
            S'inscrire
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Register;
