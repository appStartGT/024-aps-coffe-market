import {
  alertType,
  firebaseCollections,
  firebaseCollectionsKey,
  sessionStorage,
  toastAlert,
} from '@utils';
import Firebase, {
  firestore,
  storage,
  FieldValue,
  increment,
} from '../@config/firebaseConfig'; // Import the Firestore and Storage instances
import tokens from '@config/authConfig/tokens';
import { v4 as uuidv4 } from 'uuid';

export const defaultFilter = [
  { field: 'deleted', condition: '==', value: false },
  { field: 'isActive', condition: '==', value: true },
];

const insertDocument = async ({
  collectionName,
  data,
  excludeReferences = [],
  showAlert = true,
}) => {
  try {
    const userData = sessionStorage.getItemWithDecryption(tokens.user);
    const createdBy = userData?.id_user || 99999;
    const idField = `id_${collectionName.toLowerCase()}`;
    const collectionRef = firestore.collection(collectionName);
    const newId = data.id || collectionRef.doc().id;
    const newDocRef = collectionRef.doc(newId);

    const processedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (key.startsWith('id_') && typeof value === 'string') {
        const refCollectionName = key.replace('id_', '');
        acc[key] = firestore.doc(`${refCollectionName}/${value}`);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

    await newDocRef.set({
      ...processedData,
      [idField]: newId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deleted: false,
      isActive: true,
      createdBy,
    });

    if (showAlert) {
      toastAlert.showToast();
    }

    return await getDocumentById({
      collectionName,
      docId: newId,
      excludeReferences,
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    if (showAlert) {
      toastAlert.showToast({
        variant: alertType.ERROR,
        message: toastAlert.MESSAGES.ERROR_PERSIST,
      });
    }
    throw error;
  }
};

const getDocumentById = async ({
  collectionName,
  docId,
  includeReferences = true,
  excludeReferences = [],
}) => {
  try {
    const docRef = firestore.collection(collectionName).doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.warn('Document not found');
      // throw new Error('Document not found');
    }

    const data = doc.data();
    const result = { id: doc.id, ...data };

    if (includeReferences) {
      const referenceFields = Object.entries(data).filter(
        ([key, _]) =>
          key.startsWith('id_') &&
          key !== `id_${collectionName.toLowerCase()}` &&
          !excludeReferences.includes(key)
      );

      const safeReferenceFields = referenceFields.filter(
        ([_, value]) => value !== null && value !== undefined
      );

      if (safeReferenceFields.length === 0) {
        console.warn('No valid reference fields found in the document.');
      }

      const referencePromises = referenceFields.map(async ([key, value]) => {
        let refDoc;
        if (value && typeof value === 'object') {
          refDoc = await value.get();
        } else {
          const refCollectionName = key.replace('id_', '');
          const refDocRef = firestore.collection(refCollectionName).doc(value);
          refDoc = await refDocRef.get();
        }

        if (refDoc.exists) {
          const refData = refDoc.data();
          result[key] = value && typeof value === 'object' ? value : refDoc.ref;
          result[key.replace('id_', '')] = refData;
        }
      });

      await Promise.all(referencePromises);
    }
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('id_')) {
        result[key] = value;
      } else {
        result[key] = value;
      }
    });

    Object.keys(result).forEach((key) => {
      if (
        key.startsWith('id_') &&
        result[key] &&
        typeof result[key] === 'object'
      ) {
        if (excludeReferences.includes(key)) {
          result[key] = result[key].id;
        } else {
          result[key] = result[key].id;
        }
      }
    });
    return result;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

async function getAllDocuments({
  collectionName,
  filterBy = [],
  orderByField,
  orderDirection = 'DESC',
  limit,
  excludeReferences = [],
}) {
  try {
    let data = [];
    filterBy.push({ field: 'deleted', condition: '==', value: false });

    let query = firestore.collection(collectionName);

    filterBy = await Promise.all(
      filterBy.map(async (filter) => {
        if (filter.reference) {
          const fieldName = filter.field;
          if (fieldName.startsWith('id_')) {
            const refCollectionName = fieldName.substring(3);
            const refDoc = await firestore
              .collection(refCollectionName)
              .doc(filter.value)
              .get();
            filter.value = firestore
              .collection(refCollectionName)
              .doc(refDoc.id);
          }
        }
        return filter;
      })
    );

    filterBy.forEach((filter) => {
      query = query.where(filter.field, filter.condition, filter.value);
    });

    if (orderByField) {
      query = query.orderBy(orderByField, orderDirection);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const snapshot = await query.get();
    const totalItems = snapshot.size;

    const resolveReferences = async (docData) => {
      let resolvedData = { ...docData };
      const referenceFields = Object.keys(resolvedData).filter(
        (key) =>
          key.startsWith('id_') &&
          resolvedData[key] &&
          (typeof resolvedData[key] === 'string' ||
            typeof resolvedData[key] === 'object') &&
          key.replace('id_', '') !== collectionName &&
          !excludeReferences.includes(key)
      );

      const referencePromises = referenceFields.map(async (key) => {
        const refCollectionName = key.replace('id_', '');
        const refDocData = await getDocumentById({
          collectionName: refCollectionName,
          docId:
            typeof resolvedData[key] === 'object'
              ? resolvedData[key].id
              : resolvedData[key],
          includeReferences: false,
        }).catch((error) => {
          console.error(error, key, refCollectionName);
        });

        resolvedData[key] = refDocData.id;
        resolvedData[key.replace('id_', '')] = refDocData;
      });
      excludeReferences.forEach((key) => {
        if (resolvedData[key] && typeof resolvedData[key] === 'object') {
          resolvedData[key] = resolvedData[key].id;
        }
      });

      await Promise.all(referencePromises);

      return resolvedData;
    };

    const documents = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const docData = doc.data();
        const resolvedData = await resolveReferences(docData);
        return { id: doc.id, ...resolvedData };
      })
    );

    data = documents;

    return { data, totalItems };
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
}

async function deleteRecordById({ collectionName, docId, filterBy = [] }) {
  try {
    const userData = sessionStorage.getItemWithDecryption(tokens.user);
    const deletedBy = userData?.id_user;
    const collectionRef = firestore.collection(collectionName);

    if (docId) {
      const documentRef = collectionRef.doc(docId);
      await documentRef.update({
        deletedAt: FieldValue.serverTimestamp(),
        deleted: true,
        isActive: false,
        deletedBy,
      });
      return { id: docId };
    } else if (filterBy.length > 0) {
      let query = collectionRef;

      filterBy.forEach((filter) => {
        query = query.where(filter.field, filter.condition, filter.value);
      });

      const querySnapshot = await query.get();
      const batch = firestore.batch();

      querySnapshot.forEach((doc) => {
        const docRef = collectionRef.doc(doc.id);
        batch.update(docRef, {
          deletedAt: FieldValue.serverTimestamp(),
          deleted: true,
          isActive: false,
          deletedBy,
        });
      });

      await batch.commit();

      const deletedIds = querySnapshot.docs.map((doc) => doc.id);
      return { ids: deletedIds };
    } else {
      throw new Error('Either docId or filterBy must be provided.');
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    throw new Error('Error deleting record:', error);
  }
}

async function downloadFile({ fileUrl, fileName }) {
  try {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

async function uploadFile({ file, path = 'media' }) {
  try {
    const storageRef = storage.ref(`/${path}/${Date.now()}_${file.name}`);
    const snapshot = await storageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

async function massiveUpdate(collectionName, data) {
  try {
    const querySnapshot = await firestore.collection(collectionName).get();
    const updatePromises = querySnapshot.docs.map((docSnapshot) => {
      const docRef = docSnapshot.ref;
      return docRef.update({ ...data });
    });
    await Promise.all(updatePromises);
    console.log('All documents have been updated.');
    return data;
  } catch (error) {
    console.error('Error updating data:', error);
    return [];
  }
}

async function invalidateOldSessions(id_user, currentSessionId) {
  const sessionsRef = firestore.collection(firebaseCollections.USER_SESSIONS);
  const q = sessionsRef
    .where('user', '==', id_user)
    .where('isActive', '==', true)
    .where('sessionId', '!=', currentSessionId);

  try {
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.log('No old sessions to invalidate.');
      return;
    }

    const batch = firestore.batch();

    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        isActive: false,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error invalidating old sessions:', error.message);
  }
}

const loginUser = async (email, password) => {
  try {
    let userData;
    const credential = await Firebase.auth().signInWithEmailAndPassword(
      email,
      password
    );

    if (!credential) throw new Error('Usuario invalido');

    if (credential) {
      const res = await getAllDocuments({
        collectionName: firebaseCollections.USER,
        filterBy: [
          { field: 'id_user', condition: '==', value: credential.user.uid },
          { field: 'isActive', condition: '==', value: true },
        ],
      });
      userData = res.data[0];

      if (userData?.role) {
        userData.permissions = userData.role?.permissions?.reduce(
          (acc, per) => {
            const subject = per.subject;
            const actions = per.actions;
            actions.forEach((action) => {
              acc.push({
                subject,
                action,
              });
            });
            return acc;
          },
          []
        );
      }
    }
    if (userData?.id_user) {
      // Store the session in Firestore
      const sessionId = uuidv4();
      await insertDocument({
        collectionName: firebaseCollections.USER_SESSIONS,
        data: {
          id_user: userData?.id_user,
          user: userData?.id_user,
          key: firebaseCollectionsKey.user_sessions,
          sessionId: sessionId,
        },
        showAlert: false,
      }).then(async () => {
        // Invalidate Old Sessions
        userData = { ...userData, sessionId };
        await invalidateOldSessions(userData?.id_user, sessionId);
      });
    }

    return { ...userData, credential };
  } catch (error) {
    console.error(error);
    toastAlert.showToast({
      variant: alertType.ERROR,
      message: toastAlert.MESSAGES.LOGIN_ERROR,
    });
    return undefined;
  }
};

async function updateRecordBy({
  collectionName,
  docId,
  data,
  filterBy = [],
  showAlert = true,
}) {
  try {
    const userData = sessionStorage.getItemWithDecryption(tokens.user);
    const updatedBy = userData?.id_user;
    const collectionRef = firestore.collection(collectionName);
    filterBy.push({ field: 'deleted', condition: '==', value: false });

    // Crear una copia de los datos y convertir referencias si es necesario
    const dataWithReferences = { ...data };

    Object.keys(dataWithReferences).forEach((key) => {
      if (
        key.startsWith('id_') &&
        typeof dataWithReferences[key] === 'string' &&
        !filterBy.some((filter) => filter.field === key)
      ) {
        const refCollectionName = key.replace('id_', '');
        try {
          dataWithReferences[key] = firestore
            .collection(refCollectionName)
            .doc(dataWithReferences[key]);
        } catch (error) {
          console.warn(
            `Unable to resolve reference for ${key}: ${error.message}`
          );
        }
      }
    });

    let documentIds = [];
    let query;

    if (filterBy.length > 0) {
      query = collectionRef;
      filterBy.forEach((filter) => {
        query = query.where(filter.field, filter.condition, filter.value);
      });
    }

    if (!docId) {
      if (!query) {
        throw new Error('Query not defined. Provide filters or a docId.');
      }

      const querySnapshot = await query.get();

      if (querySnapshot.empty) {
        throw new Error('No documents meet the criteria or exist');
      }

      const batch = firestore.batch();
      querySnapshot.forEach((doc) => {
        const docRef = collectionRef.doc(doc.id);
        const updatedData = {
          ...dataWithReferences,
          updatedAt: FieldValue.serverTimestamp(),
          updatedBy,
        };
        batch.update(docRef, updatedData);
        documentIds.push(doc.id);
      });

      await batch.commit();
    } else if (docId) {
      const documentRef = collectionRef.doc(docId);
      const docSnapshot = await documentRef.get();

      if (!docSnapshot.exists) {
        throw new Error('Document does not exist');
      }

      const docData = docSnapshot.data();
      if (docData.deleted !== false || docData.isActive !== true) {
        throw new Error('Document does not meet the criteria');
      }

      delete dataWithReferences.createdAt;

      await documentRef.update({
        ...dataWithReferences,
        updatedAt: FieldValue.serverTimestamp(),
        updatedBy,
      });

      documentIds.push(docId);
    } else {
      throw new Error('Either docId or filterBy must be provided.');
    }

    // Función para resolver referencias recursivamente
    const resolveReferences = async (docData) => {
      const resolvedData = { ...docData };
      const referenceFields = Object.keys(resolvedData).filter(
        (key) => key.startsWith('id_') && resolvedData[key].path
      );

      const promises = referenceFields.map(async (ref) => {
        if (resolvedData[ref]) {
          const refDoc = await resolvedData[ref].get();
          if (refDoc.exists) {
            const data = await resolveReferences(refDoc.data());
            const referenceName = ref.replace('id_', '');
            resolvedData[referenceName] = data;
            resolvedData[ref] = data[ref];
          }
        }
      });

      await Promise.all(promises);
      return resolvedData;
    };

    // Obtener y resolver referencias de los documentos actualizados
    const updatedDocs = await Promise.all(
      documentIds.map(async (id) => {
        const updatedDocRef = collectionRef.doc(id);
        const updatedDocSnapshot = await updatedDocRef.get();
        const updatedDocData = await resolveReferences(
          updatedDocSnapshot.data()
        );
        return { id: id, ...updatedDocData };
      })
    );
    showAlert && toastAlert.showToast();

    return updatedDocs.length === 1 ? updatedDocs[0] : updatedDocs;
  } catch (error) {
    console.error('Error updating record:', error.message);
    toastAlert.showToast({
      variant: alertType.ERROR,
      message: toastAlert.MESSAGES.ERROR_PERSIST,
    });
    throw new Error('Error updating record:', error.message);
  }
}

function generateSearchTokens(text) {
  if (!text) return [];
  const tokens = text.toLowerCase().split(' ');
  const allTokens = new Set(tokens);

  tokens.forEach((token) => {
    for (let i = 1; i < token.length; i++) {
      allTokens.add(token.substring(0, i));
    }
  });

  return Array.from(allTokens);
}

export {
  deleteRecordById,
  downloadFile,
  firestore,
  generateSearchTokens,
  getAllDocuments,
  increment,
  insertDocument,
  loginUser,
  massiveUpdate,
  updateRecordBy,
  uploadFile,
};
