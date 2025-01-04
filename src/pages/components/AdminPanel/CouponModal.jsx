import React, { useState } from 'react';
import { Modal, Button, Input, Select, notification } from 'antd';
import { useEffect } from 'react';
import axiost from '../../../axiosConfig';
import { auth } from '../firebase/firebase';

// Helper function to calculate future dates based on duration
const calculateEndDate = (duration) => {
  const today = new Date();
  switch (duration) {
    case '1 Month':
      today.setMonth(today.getMonth() + 1);
      break;
    case '3 Months':
      today.setMonth(today.getMonth() + 3);
      break;
    case '6 Months':
      today.setMonth(today.getMonth() + 6);
      break;
    case '1 Year':
      today.setFullYear(today.getFullYear() + 1);
      break;
    default:
      return null; // No valid selection
  }
  return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
};

const CouponModal = ({ users, visible, onCancel }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(5);
  const [endDate, setEndDate] = useState(calculateEndDate('1 Month'));

  // Handle changes in discount percentage
  const handleDiscountChange = (value) => {
    setDiscountPercentage(value);
  };

  // Handle form submission to create the coupon
  const handleCreateCoupon = async () => {
    if (!selectedUserId) {
      notification.error({
        message: 'Invalid Input',
        description: 'Please select a user and set a valid discount percentage.',
      });
      return;
    }

    if (!Number.isInteger(discountPercentage) || discountPercentage < 5 || discountPercentage > 100) {
        notification.error({
          message: 'Invalid Discount Percentage',
          description: 'Discount percentage must be an integer between 5 and 100.',
        });
        return;
    }

    const payload = {
      userId: selectedUserId,
      discountPercentage,
      endDate: new Date(endDate), // Ensure the endDate is properly formatted
    };

    const crntUser = auth.currentUser;
    const token = await crntUser.getIdToken();

    const requestUrl = `${process.env.REACT_APP_API_BASE_URL}/coupon/add-coupon`;
    try {
      const response = await axiost.post(requestUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        notification.success({
          message: 'Coupon Created',
          description: 'The coupon is successfully created.',
        });
        onCancel(); // Close the modal on successful creation
      } else {
        notification.error({
          message: 'Coupon Creation Failed',
          description: 'There was an error creating the coupon.',
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: 'Error',
        description: 'An error occurred while creating the coupon.',
      });
    }
  };

  return (
    <Modal
      title="Create Coupon"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
    >
      <div>
        {/* User Selection with Search by Name or Email and Scroll */}
        <div style={{ marginBottom: 16 }}>
          <label>Select User</label>
          <Select
            style={{ width: '100%' }}
            value={selectedUserId}
            onChange={(value) => setSelectedUserId(value)}
            placeholder="Select a user"
            showSearch // Enable search functionality
            filterOption={(input, option) => {
              // Accessing value directly from option
              const userName = option.children[0]; // Name
              const userEmail = option.email; // Email
              return userName.toLowerCase().includes(input.toLowerCase()) || userEmail.toLowerCase().includes(input.toLowerCase());
            }}
            dropdownRender={(menu) => (
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {menu}
              </div>
            )}
          >
            {users.map((user) => (
              <Select.Option key={user.id} value={user.id} email={user.email}>
                {user.name} ({user.email})
              </Select.Option>
            ))}
          </Select>
        </div>

        {/* Discount Percentage */}
        <div style={{ marginBottom: 16 }}>
          <label>Discount Percentage (5-100)</label>
          <Input
            type="number"
            min="5"
            max="100"
            value={discountPercentage}
            onChange={(e) => handleDiscountChange(Number(e.target.value))}
            placeholder="Enter discount percentage"
          />
        </div>

        {/* End Date Selection */}
        <div style={{ marginBottom: 16 }}>
          <label>Coupon End Date</label>
          <Select
            value={endDate}
            onChange={(value) => setEndDate(value)} // Update directly with string date
            style={{ width: '100%' }}
          >
            <Select.Option value={calculateEndDate('1 Month')}>1 Month</Select.Option>
            <Select.Option value={calculateEndDate('3 Months')}>3 Months</Select.Option>
            <Select.Option value={calculateEndDate('6 Months')}>6 Months</Select.Option>
            <Select.Option value={calculateEndDate('1 Year')}>1 Year</Select.Option>
          </Select>
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={handleCreateCoupon}
          disabled={!Number.isInteger(discountPercentage) || discountPercentage < 5 || discountPercentage > 100 || !selectedUserId}
          
        >
          Create Coupon
        </Button>
      </div>
    </Modal>
  );
};

export default CouponModal;
