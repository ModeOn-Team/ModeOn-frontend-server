import { loadTossPayments } from "@tosspayments/payment-sdk";

const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;

export const paymentService = {
  requestPayment: async ({ orderId, amount, productName }) => {
    const toss = await loadTossPayments(clientKey);

    await toss.requestPayment("카드", {
      amount,
      orderId,
      orderName: productName,
      successUrl: `${window.location.origin}/success`,
      failUrl: `${window.location.origin}/fail`,
    });
  },
};
