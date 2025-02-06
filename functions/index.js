/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { onCall } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

initializeApp();
const db = getFirestore();

// Görev oluşturma
exports.createTask = onCall(async (request) => {
  const { title, description, status, dueDate } = request.data;
  const userId = request.auth.uid;

  const task = {
    title,
    description,
    status,
    dueDate: new Date(dueDate),
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await db.collection("tasks").add(task);
  return { id: docRef.id, ...task };
});

// Görev güncelleme
exports.updateTask = onCall(async (request) => {
  const { id, status } = request.data;
  const userId = request.auth.uid;

  const taskRef = db.collection("tasks").doc(id);
  const task = await taskRef.get();

  if (!task.exists) {
    throw new Error("Görev bulunamadı");
  }

  if (task.data().userId !== userId) {
    throw new Error("Bu görevi güncelleme yetkiniz yok");
  }

  await taskRef.update({
    status,
    updatedAt: new Date(),
  });

  return { id, status };
});

// Görev silme
exports.deleteTask = onCall(async (request) => {
  const { id } = request.data;
  const userId = request.auth.uid;

  const taskRef = db.collection("tasks").doc(id);
  const task = await taskRef.get();

  if (!task.exists) {
    throw new Error("Görev bulunamadı");
  }

  if (task.data().userId !== userId) {
    throw new Error("Bu görevi silme yetkiniz yok");
  }

  await taskRef.delete();
  return { id };
});

// Görevleri listeleme
exports.listTasks = onCall(async (request) => {
  const userId = request.auth.uid;
  const { status } = request.data || {};

  let query = db.collection("tasks").where("userId", "==", userId);

  if (status) {
    query = query.where("status", "==", status);
  }

  const snapshot = await query.orderBy("createdAt", "desc").get();
  const tasks = [];

  snapshot.forEach((doc) => {
    tasks.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return tasks;
});
