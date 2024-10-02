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
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export const defaultFilter = [
  { field: 'deleted', condition: '==', value: false },
  { field: 'isActive', condition: '==', value: true },
];

/**
 * Fetches data from a Firestore collection with optional filters, ordering, and pagination.
 * @param {Object} params - The parameters for fetching data.
 * @param {string} params.collectionName - The name of the Firestore collection.
 * @param {Array} [params.filterBy] - An array of filter objects.
 * @param {string} [params.docId] - The document ID to fetch.
 * @param {string} [params.orderByField] - The field to order the documents by.
 * @param {string} [params.orderDirection='desc'] - The direction to order the documents.
 * @param {number} [params.limit] - The number of documents per page.
 * @param {DocumentSnapshot} [params.lastVisible] - The last visible document from the previous page.
 * @param {number} [params.currentPage=1] - The current page number.
 * @returns {Object} - The paginated response.
 */
async function getDataFrom({
  collectionName,
  filterBy = [],
  docId,
  orderByField,
  orderDirection = 'DESC',
  limit,
  lastVisible,
  currentPage = 1,
  nonReferenceField = '', // Clave específica que no debe tratarse como referencia
}) {
  try {
    let data = [];
    let totalItems = 0;

    // Agrega la condición por defecto para no incluir elementos "deleted"
    filterBy.push({ field: 'deleted', condition: '==', value: false });

    // Resolver referencias en filtros
    const resolveFilterReferences = async () => {
      const filterPromises = filterBy.map(async (filter) => {
        if (
          filter.field !== nonReferenceField &&
          filter.field.startsWith('id_') &&
          typeof filter.value === 'string'
        ) {
          const refCollectionName = filter.field.replace('id_', '');
          const refDoc = await firestore
            .collection(refCollectionName)
            .doc(filter.value)
            .get();
          if (refDoc.exists) {
            filter.value = firestore
              .collection(refCollectionName)
              .doc(refDoc.id);
          }
        }
      });

      await Promise.all(filterPromises);
    };

    await resolveFilterReferences();

    const resolveReferences = async (docData) => {
      const resolvedData = { ...docData };
      const referenceFields = Object.keys(resolvedData).filter(
        (key) =>
          key !== nonReferenceField && // Do not resolve if it's the specific non-reference field
          key.startsWith('id_') &&
          typeof resolvedData[key] === 'object' &&
          resolvedData[key].path
      );

      const refDocs = await Promise.all(
        referenceFields.map((ref) => resolvedData[ref].get())
      );

      await Promise.all(
        referenceFields.map(async (ref, index) => {
          const refDoc = refDocs[index];
          if (refDoc.exists) {
            const data = await resolveReferences(refDoc.data());
            const collectionName = ref.replace('id_', '');
            //set data with the collection name
            resolvedData[collectionName] = data;
            //set the key value
            resolvedData[ref] = data[ref];
          }
        })
      );

      return resolvedData;
    };

    if (docId) {
      const docRef = firestore.collection(collectionName).doc(docId);
      const docSnapshot = await docRef.get();
      if (!docSnapshot.exists || docSnapshot.data().deleted !== false) {
        throw new Error('El documento no cumple con los criterios o no existe');
      }
      const resolvedData = await resolveReferences(docSnapshot.data());
      return { id: docSnapshot.id, ...resolvedData };
    } else {
      // Construye la consulta para obtener los datos
      let query = firestore.collection(collectionName);
      filterBy.forEach((filter) => {
        query = query.where(filter.field, filter.condition, filter.value);
      });

      if (orderByField) {
        query = query.orderBy(orderByField, orderDirection);
      }
      if (limit) {
        query = query.limit(limit);
      }
      if (lastVisible) {
        query = query.startAfter(lastVisible);
      }

      // Ejecuta la consulta y obtiene los datos
      const querySnapshot = await query.get();
      data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const totalPages = Math.ceil(totalItems / limit);

      // Resolver referencias en los documentos obtenidos
      data = await Promise.all(
        data.map(async (doc) => ({
          ...doc,
          ...(await resolveReferences(doc)),
        }))
      );

      return {
        data,
        pagination: {
          totalItems,
          totalPages,
          currentPage,
          itemsPerPage: limit,
          lastVisible: newLastVisible,
        },
      };
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return { data: [], pagination: {} };
  }
}

/**
 * Deletes documents in a Firestore collection by marking them as deleted, based on filter criteria.
 * @param {Object} params - The parameters for deleting the document.
 * @param {string} params.collectionName - The name of the Firestore collection.
 * @param {string} params.docId - The ID of the document to delete (optional if using filterBy).
 * @param {Array} params.filterBy - The filters to apply when selecting documents to delete.
 * @returns {Object|null} - The ID(s) of the deleted document(s), or null if an error occurred.
 */
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

/**
 * Downloads a file from a given URL.
 * @param {Object} params - The parameters for downloading the file.
 * @param {string} params.fileUrl - The URL of the file to download.
 * @param {string} [params.fileName] - The name to save the downloaded file as.
 * @throws {Error} - If there is an error during file download.
 */
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

/**
 * Uploads a file to Firebase Storage.
 * @param {Object} params - The parameters for uploading the file.
 * @param {File} params.file - The file to upload.
 * @param {string} [params.path='media'] - The path in Firebase Storage to upload the file to.
 * @returns {string} - The download URL of the uploaded file.
 * @throws {Error} - If there is an error during file upload.
 */
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

/**
 * Performs a massive update on all documents in a Firestore collection.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {Object} data - The data to update in each document.
 * @returns {Object[]} - An array of the updated data, or an empty array if an error occurred.
 */
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
      const res = await getDataFrom({
        collectionName: firebaseCollections.USER,
        filterBy: [
          { field: 'id_user', condition: '==', value: credential.user.uid },
          { field: 'isActive', condition: '==', value: true },
        ],
        nonReferenceField: 'id_user',
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

      if (userData?.branch) {
        const filters = [
          {
            field: 'id_branch',
            condition: '==',
            value: userData.id_branch,
          },
          {
            field: 'isActive',
            condition: '==',
            value: true,
          },
        ];

        const inventory = await getDataFrom({
          collectionName: firebaseCollections.INVENTORY,
          filterBy: filters,
          nonReferenceField: 'id_inventory',
        });

        userData.inventory = inventory.data[0] || [];
      }
    }
    if (userData?.id_user) {
      // Store the session in Firestore
      const sessionId = uuidv4();
      await insertInto({
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

async function insertInto({
  collectionName,
  reference,
  data,
  transaction = null,
  showAlert = true,
}) {
  try {
    const userData = sessionStorage.getItemWithDecryption(tokens.user);
    const defaultFields = {
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deleted: false,
      isActive: data?.isActive ?? true,
      createdBy: userData?.id_user ?? 999,
    };

    // Create a copy of the data
    const dataWithReferences = { ...data };

    // Automatically detect fields that should be references
    Object.keys(dataWithReferences).forEach((key) => {
      if (
        key.startsWith('id_') &&
        typeof dataWithReferences[key] === 'string'
      ) {
        const relatedCollectionName = key.replace('id_', '');

        // Si el campo `id_` apunta a la misma colección, no lo tratamos como referencia
        if (relatedCollectionName !== collectionName) {
          dataWithReferences[key] = doc(
            firestore,
            relatedCollectionName,
            dataWithReferences[key]
          );
        }
      }
    });

    // Handle additional references if necessary
    if (reference) {
      dataWithReferences[reference.field] = doc(
        firestore,
        reference.collection,
        reference.docId
      );
    }

    let docRef;
    if (transaction) {
      if (dataWithReferences?.id) {
        docRef = firestore
          .collection(collectionName)
          .doc(dataWithReferences.id);
        if (dataWithReferences.key) {
          dataWithReferences[dataWithReferences.key] = dataWithReferences.id;
        }
        transaction.set(docRef, { ...dataWithReferences, ...defaultFields });
      } else {
        docRef = firestore.collection(collectionName).doc();
        const customId = docRef.id;
        dataWithReferences.id = customId;

        if (dataWithReferences.key) {
          dataWithReferences[dataWithReferences.key] = customId;
        }

        transaction.set(docRef, { ...dataWithReferences, ...defaultFields });
      }
    } else {
      if (dataWithReferences?.id) {
        docRef = firestore
          .collection(collectionName)
          .doc(dataWithReferences.id);
        if (dataWithReferences.key) {
          dataWithReferences[dataWithReferences.key] = dataWithReferences.id;
        }
        await setDoc(docRef, { ...dataWithReferences, ...defaultFields });
      } else {
        docRef = firestore.collection(collectionName).doc();
        const customId = docRef.id;
        dataWithReferences.id = customId;

        if (dataWithReferences.key) {
          dataWithReferences[dataWithReferences.key] = customId;
        }

        await setDoc(docRef, { ...dataWithReferences, ...defaultFields });
      }
    }

    // Obtener y resolver las referencias del documento insertado
    const resolvedData = await getDataFrom({
      collectionName,
      docId: dataWithReferences.id,
    });
    showAlert && toastAlert.showToast();

    return resolvedData; // Devolver los datos con todas las referencias resueltas
  } catch (error) {
    console.error('Error inserting data:', error);
    toastAlert.showToast({
      variant: alertType.ERROR,
      message: toastAlert.MESSAGES.ERROR_PERSIST,
    });
    throw new Error('Error inserting data:', error);
  }
}

async function bulkInsertIntoReferences({
  collectionName,
  reference,
  dataArray,
}) {
  try {
    // Validar que dataArray sea un arreglo
    if (!Array.isArray(dataArray)) {
      throw new Error('dataArray must be an array');
    }

    const userData = sessionStorage.getItemWithDecryption(tokens.user);
    const defaultFields = {
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      deleted: false,
      isActive: dataArray[0]?.isActive ?? true,
      createdBy: userData?.id_user,
    };

    const insertAndResolve = async (data) => {
      const dataWithReferences = { ...data };

      // Detectar y manejar los campos que deben ser referencias
      Object.keys(dataWithReferences).forEach((key) => {
        if (
          key.startsWith('id_') &&
          typeof dataWithReferences[key] === 'string'
        ) {
          const relatedCollectionName = key.replace('id_', '');

          if (relatedCollectionName !== collectionName) {
            // Solo trata como referencia si no es la misma colección
            dataWithReferences[key] = firestore
              .collection(relatedCollectionName)
              .doc(dataWithReferences[key]);
          }
        }
      });

      // Manejar referencias adicionales si es necesario
      if (reference) {
        dataWithReferences[reference.field] = firestore
          .collection(reference.collection)
          .doc(reference.docId);
      }

      let docRef;
      if (dataWithReferences?.id) {
        docRef = firestore
          .collection(collectionName)
          .doc(dataWithReferences.id);
        await docRef.set({ ...dataWithReferences, ...defaultFields });
      } else {
        docRef = firestore.collection(collectionName).doc();
        const customId = docRef.id;
        dataWithReferences.id = customId;

        // Asegurar que el campo key esté configurado correctamente
        if (dataWithReferences.key) {
          dataWithReferences[dataWithReferences.key] = customId;
        }

        await docRef.set({ ...dataWithReferences, ...defaultFields });
      }

      return docRef.id; // Devolver el ID del documento insertado
    };

    // Insertar todos los documentos y obtener sus IDs
    const insertedDocIds = await Promise.all(dataArray.map(insertAndResolve));

    // Ahora obtener y resolver las referencias de los documentos insertados
    const resolvedDocs = await Promise.all(
      insertedDocIds.map(async (id) => {
        return getDataFrom({
          collectionName,
          docId: id,
        });
      })
    );
    toastAlert.showToast();

    return resolvedDocs;
  } catch (error) {
    console.error('Error inserting data:', error);
    toastAlert.showToast({
      variant: alertType.ERROR,
      message: toastAlert.MESSAGES.ERROR_PERSIST,
    });
    throw new Error('Error inserting data:', error);
  }
}

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
  bulkInsertIntoReferences,
  deleteRecordById,
  downloadFile,
  firestore,
  generateSearchTokens,
  getDataFrom,
  increment,
  insertInto,
  loginUser,
  massiveUpdate,
  updateRecordBy,
  uploadFile,
};
