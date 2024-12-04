const functions = require('firebase-functions');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');
const cors = require('cors');
const express = require('express');
const app = express();

const corsOptions = {
    origin: true, // Cho phép tất cả origin hoặc chỉ định các origin cụ thể
};

app.use(cors(corsOptions));

exports.api = functions.https.onRequest(app)
// APP INFO
// EXAMPLE DATA FROM ZALOPAY MERCHANT
const config = {
    app_id: '2553',
    key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
    key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
    endpoint: 'https://sb-openapi.zalopay.vn/v2/create',
};

// Tạo đơn hàng thanh toán
exports.createPayment = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*'); // Cho phép tất cả origin
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Cho phép các phương thức
    res.set('Access-Control-Allow-Headers', 'Content-Type'); // Cho phép các header cần thiết

    if (req.method === 'OPTIONS') {
        // Phản hồi cho preflight request
        res.status(204).send('');
        return;
    }
    const { amount, userid } = req.body;

    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_time: Date.now(),
        amount: amount,
        app_user: userid,
        item: [],
        embed_data: [],
        callback_url: 'https://paymentcallback-pvkrujnynq-uc.a.run.app',
        bank_code: '',
    };

    const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
        return res.status(200).json({...result.data, app_trans_id: order.app_trans_id });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating order', error });
    }
});

// Thanh toán thành công sẽ tự động gọi đến hàm này để sửa lại dữ liệu đơn hàng
exports.paymentCallback = functions.https.onRequest((req, res) => {
    let result = {};
    try {
        const { data: dataStr, mac: reqMac } = req.body;
        const mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();

        if (reqMac !== mac) {
            result.return_code = -1;
            result.return_message = 'mac not equal';
        } else {
            result.return_code = 1;
            result.return_message = 'success';
        }
    } catch (ex) {
        result.return_code = 0;
        result.return_message = ex.message;
        res.json(result);
    }
});