const axios = require('axios');

const sendWhatsAppMessage = async (phone, name, queueNumber) => {
  const url = `${process.env.EVOLUTION_API_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`;
  
  const data = {
    number: phone, // Patient ka number
    options: { delay: 1200, presence: "composing" },
    textMessage: {
      text: `Hello *${name}*! \n\nWelcome to our clinic. Aapka Queue Number hai: *${queueNumber}*.\n\nHum aapko call karenge jab aapki baari aayegi. Thank you!`
    }
  };

  try {
    await axios.post(url, data, {
      headers: { 'apikey': process.env.EVOLUTION_API_KEY }
    });
    console.log(`WhatsApp sent to ${name}`);
  } catch (error) {
    console.error("WhatsApp Error:", error.response?.data || error.message);
  }
};

module.exports = { sendWhatsAppMessage };