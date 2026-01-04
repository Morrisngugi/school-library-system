const cron = require('node-cron');
const Transaction = require('../models/Transaction.model');
const Reservation = require('../models/Reservation.model');
const { sendNotification } = require('./notification');

// Check and update overdue transactions
const checkOverdueBooks = cron.schedule('0 0 * * *', async () => {
  console.log('Running daily overdue check...');
  
  try {
    const transactions = await Transaction.find({
      status: 'active',
      dueDate: { $lt: new Date() }
    }).populate('user book');

    for (const transaction of transactions) {
      transaction.checkOverdue();
      await transaction.save();
      
      // Send overdue notification
      await sendNotification(transaction.user, 'overdue', {
        book: transaction.book,
        fine: transaction.fineAmount
      });
    }

    console.log(`Processed ${transactions.length} overdue transactions`);
  } catch (error) {
    console.error('Error in overdue check:', error);
  }
}, {
  scheduled: false
});

// Send due date reminders (2 days before)
const sendDueReminders = cron.schedule('0 9 * * *', async () => {
  console.log('Sending due date reminders...');
  
  try {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    twoDaysFromNow.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(twoDaysFromNow);
    nextDay.setDate(nextDay.getDate() + 1);

    const transactions = await Transaction.find({
      status: 'active',
      dueDate: { $gte: twoDaysFromNow, $lt: nextDay }
    }).populate('user book');

    for (const transaction of transactions) {
      await sendNotification(transaction.user, 'due_reminder', {
        book: transaction.book,
        dueDate: transaction.dueDate
      });
    }

    console.log(`Sent ${transactions.length} due date reminders`);
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
}, {
  scheduled: false
});

// Check and expire old reservations
const checkExpiredReservations = cron.schedule('0 1 * * *', async () => {
  console.log('Checking expired reservations...');
  
  try {
    const reservations = await Reservation.find({
      status: { $in: ['pending', 'available'] },
      expiryDate: { $lt: new Date() }
    });

    for (const reservation of reservations) {
      reservation.status = 'expired';
      await reservation.save();
    }

    console.log(`Expired ${reservations.length} reservations`);
  } catch (error) {
    console.error('Error checking reservations:', error);
  }
}, {
  scheduled: false
});

// Start all cron jobs
const start = () => {
  checkOverdueBooks.start();
  sendDueReminders.start();
  checkExpiredReservations.start();
  console.log('Cron jobs started');
};

// Stop all cron jobs
const stop = () => {
  checkOverdueBooks.stop();
  sendDueReminders.stop();
  checkExpiredReservations.stop();
  console.log('Cron jobs stopped');
};

module.exports = {
  start,
  stop,
  checkOverdueBooks,
  sendDueReminders,
  checkExpiredReservations
};
