import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Razorpay from 'razorpay';
// require('dotenv').config();
// import {} from 'dotenv/config'
// import { isCurrency } from 'validator';
// import payments from 'razorpay/dist/types/payments';

const app = express();
const PORT = 3001;
// import paymentRoutes from './PaymentRoutes.js';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// app.use('/api', paymentRoutes);
// app.get('/', (req, res)=>{
//     res.send("hello world");
// })

app.post('/', async(req, res)=>{
    const razorpay = new Razorpay({
        key_id: "rzp_test_AKQrFFfawGK0t5",
        key_secret: "pdfzdKYE1rOkGaaW2MISmHU2"
    })
    
    const options = {
    amount: req.body.amount,
    currency: req.body.currency,
    receipt: "receipt#1",
    payment_capture: 1
}

try{
    const response =  await razorpay.orders.create(options)
    
    res.json({
        order_id: response.id,
        currency: response.currency,
        amount: response.amount
    })
} catch(error){
    res.status(500).send("server errror")
}
})

app.get("/payment/:paymentId", async(req, res)=>{
    const {paymentId} = req.params;
    const razorpay = new Razorpay({
        key_id: "rzp_test_AKQrFFfawGK0t5",
        key_secret: "pdfzdKYE1rOkGaaW2MISmHU2"
    })
    try{
        const payment = await razorpay.payments.fetch(paymentId)

        if(!payment){
            return res.status(500).json("error at razorpay loading");
        }
        res.json({
            status: payment.status,
            method: payment.method,
            amount: payment.amount,
            currency: payment.currency
        })
    }catch(error){
        res.status(500).json("failed to fetch");
    }
})
// const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
