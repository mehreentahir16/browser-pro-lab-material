import { DollarOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Divider, Form, InputNumber, Select, Table } from 'antd';
import Text from 'antd/lib/typography/Text';
import { orderList } from 'atoms/order-list.atom';
import axios from 'axios';
import { Title, ViewWrapper } from 'components/common';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';

const Payments = () => {
  const [orderListState, setOrderListState] = useRecoilState(orderList);
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { Option } = Select;

  const handleOrderSending = async (payload) => {
    await axios.post('/api/order', payload);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  const handleFinish = () => {
    handleOrderSending(orderListState);
    setOrderListState([]);
    navigate('/thank-you');
  };

  return (
    <ViewWrapper>
      <Title>Payment</Title>
      <p>
        <HomeOutlined style={{ marginRight: '10px' }} />
        Delivery Address: {localStorage.getItem('address')}
      </p>
      <Text type="danger">
        <DollarOutlined style={{ marginRight: '10px' }} />
        Total cost: {totalCost.toFixed(2)}
      </Text>
      <Divider />
      <Form layout={'inline'} form={form} onFinish={handleFinish}>
        <Form.Item name="card">
          <Select
            defaultValue={'visa'}
            label="card"
            placeholder="Choose your card type"
            style={{ width: '300px' }}
          >
            <Option value="visa">Visa</Option>
            <Option value="mastercard">MasterCard</Option>
            <Option value="citybank">CityBank</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="cardNumber"
          rules={[
            {
              required: true,
              message: 'Is required',
            },
          ]}
        >
          <InputNumber
            placeholder="Card number"
            controls={false}
            style={{ width: '300px' }}
          />
        </Form.Item>
        <Form.Item
          name="csv"
          rules={[
            {
              required: true,
              message: 'Is required',
            },
          ]}
        >
          <InputNumber placeholder="CVS" controls={false} max={999} />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Finish payment
          </Button>
        </Form.Item>
      </Form>

      <Divider />
      <Table
        style={{ width: '100%' }}
        dataSource={orderListState}
        columns={columns}
        pagination={false}
        summary={(pageData) => {
          let totalPrice = 0;

          pageData.forEach(({ price, count }) => (totalPrice += price * count));
          setTotalCost(totalPrice);

          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell />
                <Table.Summary.Cell>Total</Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text type="danger">{totalPrice.toFixed(2)}</Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
    </ViewWrapper>
  );
};

export default Payments;
