import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private readonly firebaseAdmin: admin.app.App;

  constructor() {
    const serviceAccount = require('../famfund-def53-firebase-adminsdk-dgnjy-044c4a7040.json');
    this.firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
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

  public sendNotificationToUser(deviceToken: string, title: string, body: string) {
    const message = {
      data: {
        title,
        body,
      },
      token: deviceToken,
    };
    return this.firebaseAdmin.messaging().send(message)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }
}