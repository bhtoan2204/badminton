import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly firebaseAdmin: admin.app.App;

  constructor() {
    const serviceAccount = require('./famfund-def53-firebase-adminsdk-dgnjy-044c4a7040.json');
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL:
        'https://famfund-def53-default-rtdb.asia-southeast1.firebasedatabase.app',
    });
  }

  private isValidFCMToken(token: string): boolean {
    const fcmTokenRegex = /^[a-zA-Z0-9\-_:.]+$/;
    return fcmTokenRegex.test(token);
  }

  public isConnected(): boolean {
    try {
      this.firebaseAdmin.database().goOnline();
      return true;
    } catch (error) {
      return false;
    }
  }

  public getAdmin(): admin.app.App {
    return this.firebaseAdmin;
  }

  public async saveFCMToken(userId: string, fcmToken: string) {
    if (!userId || !fcmToken || !this.isValidFCMToken(fcmToken)) {
      throw new Error('Invalid userId or fcmToken');
    }

    try {
      const tokensRef = this.firebaseAdmin
        .database()
        .ref(`fcmTokens/${userId}`);
      const snapshot = await tokensRef.once('value');
      let tokens = snapshot.val();

      if (!tokens) {
        tokens = [];
      }

      if (!tokens.includes(fcmToken)) {
        tokens.push(fcmToken);
        await tokensRef.set(tokens);
      }

      return { success: true, message: 'FCM token saved successfully' };
    } catch (error) {
      console.error('Error saving FCM token:', error);
      throw new Error('Error saving FCM token');
    }
  }

  public async deleteFCMToken(userId: string, fcmToken: string) {
    if (!userId || !fcmToken || !this.isValidFCMToken(fcmToken)) {
      throw new Error('Invalid userId or fcmToken');
    }

    try {
      const tokensRef = this.firebaseAdmin
        .database()
        .ref(`fcmTokens/${userId}`);
      const snapshot = await tokensRef.once('value');

      if (!snapshot.exists()) {
        return {
          success: false,
          message: 'FCM token does not exist for this user',
        };
      }

      let tokens = snapshot.val();

      if (tokens.includes(fcmToken)) {
        tokens = tokens.filter((token) => token !== fcmToken);
        await tokensRef.set(tokens);
      }

      return { success: true, message: 'FCM token deleted successfully' };
    } catch (error) {
      console.error('Error deleting FCM token:', error);
      throw new Error('Error deleting FCM token');
    }
  }

  public async sendNotificationToUser(
    fcmToken: string,
    title: string,
    body: string,
  ) {
    if (!this.isValidFCMToken(fcmToken)) {
      throw new Error('Invalid FCM token');
    }

    const message = {
      token: fcmToken,
      notification: {
        title: title,
        body: body,
      },
    };

    try {
      const response = await this.firebaseAdmin.messaging().send(message);
      return {
        success: true,
        message: 'Notification sent successfully',
        response,
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Error sending notification');
    }
  }

  public async sendNotificationByUserId(
    userId: string,
    title: string,
    body: string,
  ) {
    try {
      const tokensRef = this.firebaseAdmin
        .database()
        .ref(`fcmTokens/${userId}`);
      const snapshot = await tokensRef.once('value');

      if (!snapshot.exists()) {
        throw new Error('No FCM tokens found for this user');
      }

      const fcmTokens = snapshot.val();
      const results = [];

      for (const fcmToken of fcmTokens) {
        if (this.isValidFCMToken(fcmToken)) {
          const result = await this.sendNotificationToUser(
            fcmToken,
            title,
            body,
          );
          results.push(result);
        }
      }

      return { success: true, message: 'Notifications sent', results };
    } catch (error) {
      console.error('Error sending notifications:', error);
      throw new Error('Error sending notifications');
    }
  }
}
