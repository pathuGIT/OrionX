import React, { useState } from 'react';

const Pay = () => {
    const [amount, setAmount] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handlePayment = () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        // Simulate payment processing
        setPaymentStatus('Processing...');
        setTimeout(() => {
            setPaymentStatus('Payment Successful!');
        }, 2000);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Payment Page</h1>
            <div style={{ marginBottom: '10px' }}>
                <label htmlFor="amount">Enter Amount: </label>
                <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                />
            </div>
            <button onClick={handlePayment}>Pay Now</button>
            {paymentStatus && <p>{paymentStatus}</p>}
        </div>
    );
};

export default Pay;