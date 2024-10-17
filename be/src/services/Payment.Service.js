import PayOS from "@payos/node";
import * as dotenv from 'dotenv'
dotenv.config();
const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECK_SUM_KEY } = process.env;

const PaymentService = {
    createPaymentLink: async (req) => {
        try {
            
            const payos = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECK_SUM_KEY);
    
            const requestData = {
                orderCode: 10005,
                amount: 10000,
                description: "testing",
                cancelUrl: "http://localhost:5173/",
                returnUrl: "http://localhost:5173/home",
                // signature?: "Nguyen",
                // items?: [{ name: "RMS", quantity: 1, price: 10000 }],
                // buyerName?: "Nguyen",
                // buyerEmail?: "trantrungnguyenad@gmail.com",
                // buyerPhone?: "0943895292",
                // buyerAddress?: "HN",
                // expiredAt?: "2h",            
              }
            const paymentLink = await payos.createPaymentLink(requestData);
            return paymentLink
        } catch (error) {
            throw error
        }
    },
    getPaymentLink : async(req) => {
        try {
            
            const {paymentLinkId} = req.params;
            const payos = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECK_SUM_KEY);
            const paymentLink = await payos.getPaymentLinkInformation(paymentLinkId)
            return paymentLink
        } catch (error) {
            throw error
        }
    },
    cancelPaymentLink: async(req) => {
        try {
            const {paymentLinkId} = req.params;
            const payos = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECK_SUM_KEY);
            const paymentLink = await payos.cancelPaymentLink(paymentLinkId)
            return paymentLink
        } catch (error) {
            throw error
            
        }
    }
}

export default PaymentService