// backend/services/calendarService.js
const { google } = require('googleapis');

const createDeliveryEvent = async (order) => {
  // Yêu cầu lấy credentials.json từ Google Cloud Console
  const auth = new google.auth.GoogleAuth({
    keyFile: './config/google-credentials.json',
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary: `Giao hoa cho ${order.deliveryDetails.receiverName}`,
    description: `SĐT: ${order.deliveryDetails.receiverPhone} - Thiệp: ${order.deliveryDetails.messageCard}`,
    start: { dateTime: order.deliveryDetails.deliveryDate, timeZone: 'Asia/Ho_Chi_Minh' },
    end: { dateTime: new Date(new Date(order.deliveryDetails.deliveryDate).getTime() + 60 * 60 * 1000) }, // +1 tiếng
  };

  await calendar.events.insert({ calendarId: 'primary', resource: event });
};