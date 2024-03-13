
const vnpayConfig = {
    vnp_TmnCode: "U4EYG2S0",
    vnp_HashSecret: "ROVRCDEONFOLXOSZUULGXWRXXPDUVHID",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
    vnp_ReturnUrl: `http://localhost:8080/payment/vnpay_return?order_id=`,
  };
  
  export default vnpayConfig;
    