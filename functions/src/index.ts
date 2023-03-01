import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { UserRecord } from "firebase-admin/lib/auth";

admin.initializeApp();
const db = admin.firestore();

// eslint-disable-next-line import/prefer-default-export
export const createUserDocument = functions.auth
  .user()
  .onCreate(async ({ uid, email, displayName, providerData }: UserRecord) => {
    await db.collection("users").doc(uid).set({
      uid,
      email,
      displayName,
      providerData,
    });
  });
