import React from 'react';
import { Button, Col, Form, Input, notification, Row } from 'antd';
import { forgotPasswordApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        const res = await forgotPasswordApi(values.email, values.newPassword);
        if (res && res.EC === 0) {
            notification.success({ message: "SUCCESS", description: res.EM });
            navigate("/login");
        } else {
            notification.error({ message: "ERROR", description: res?.EM ?? "Lỗi" });
        }
    };
    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{ padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
                    <legend>Khôi Phục Mật Khẩu</legend>
                    <Form onFinish={onFinish} layout='vertical'>
                        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true }]}>
                            <Input.Password />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Cập nhật</Button>
                    </Form>
                    <div style={{ marginTop: 15, textAlign: "center" }}>
                        <Link to={"/login"}>Quay lại đăng nhập</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    );
};
export default ForgotPasswordPage;