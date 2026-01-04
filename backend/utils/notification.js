const { sendEmail } = require('./email');
const { sendSMS } = require('./sms');

/**
 * Universal notification function
 * Handles sending notifications based on type
 */
const sendNotification = async (user, type, data) => {
  try {
    let subject, message;

    switch (type) {
      case 'checkout':
        subject = 'Book Checked Out Successfully';
        message = `Dear ${user.firstName}, you have successfully checked out "${data.book.title}". Due date: ${data.transaction.dueDate.toDateString()}`;
        break;

      case 'return':
        subject = 'Book Returned Successfully';
        message = `Dear ${user.firstName}, you have successfully returned "${data.book.title}". Thank you!`;
        break;

      case 'due_reminder':
        subject = 'Book Due Reminder';
        message = `Dear ${user.firstName}, your book "${data.book.title}" is due on ${data.dueDate.toDateString()}. Please return it on time.`;
        break;

      case 'overdue':
        subject = 'Book Overdue Notice';
        message = `Dear ${user.firstName}, your book "${data.book.title}" is overdue. Fine: KSH ${data.fine}. Please return immediately.`;
        break;

      case 'reservation_available':
        subject = 'Reserved Book Available';
        message = `Dear ${user.firstName}, your reserved book "${data.book.title}" is now available. Please collect within 2 days.`;
        break;

      case 'fine_paid':
        subject = 'Fine Payment Confirmation';
        message = `Dear ${user.firstName}, your fine of KSH ${data.amount} has been received. Thank you!`;
        break;

      default:
        subject = 'Library Notification';
        message = data.message;
    }

    // Send email
    await sendEmail({
      to: user.email,
      subject: subject,
      text: message,
      html: `<p>${message}</p>`
    });

    // Send SMS for critical notifications
    if (['overdue', 'reservation_available'].includes(type)) {
      await sendSMS({
        to: user.phone,
        message: message.substring(0, 160)
      });
    }

    return true;
  } catch (error) {
    console.error('Notification error:', error);
    return false;
  }
};

module.exports = { sendNotification };
