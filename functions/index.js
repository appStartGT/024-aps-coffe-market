const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.onPurchaseDetailChange = functions.firestore
  .document('purchase_detail/{id_purchase_detail}')
  .onWrite(async (change, context) => {
    const newValue = change.after.exists ? change.after.data() : null;
    const oldValue = change.before.exists ? change.before.data() : null;
    let id_purchase = oldValue ? oldValue.id_purchase : null; //reference field

    if (!id_purchase || !id_purchase.id) {
      console.log(
        'id_purchase is undefined, empty, or not a valid reference. Attempting to fetch from purchase_detail.'
      );
      const id_purchase_detail = context.params.id_purchase_detail;
      try {
        const purchaseDetailDoc = await admin
          .firestore()
          .collection('purchase_detail')
          .doc(id_purchase_detail)
          .get();
        if (purchaseDetailDoc.exists) {
          id_purchase = purchaseDetailDoc.data().id_purchase;
        } else {
          console.error(
            `Purchase detail document with id ${id_purchase_detail} does not exist!`
          );
          return null;
        }
      } catch (error) {
        console.error('Error fetching purchase detail:', error);
        return null;
      }
    }

    if (!id_purchase || !id_purchase.id) {
      console.error('Unable to retrieve a valid id_purchase');
      return null;
    }

    console.log(newValue, oldValue, {
      id_purchase: id_purchase.id,
    });

    try {
      await admin.firestore().runTransaction(async (transaction) => {
        const purchaseDoc = await transaction.get(id_purchase);

        if (!purchaseDoc.exists) {
          throw new Error(
            `Purchase document with id ${id_purchase.id} does not exist!`
          );
        }

        const purchaseData = purchaseDoc.data();
        let totalLbPriced = Number(purchaseData.totalLbPriced || 0);
        let totalLbPriceless = Number(purchaseData.totalLbPriceless || 0);
        let totalAmount = Number(purchaseData.totalAmount || 0);
        let totalAdvancePayments = Number(
          purchaseData.totalAdvancePayments || 0
        );
        let totalLbRemate = Number(purchaseData.totalLbRemate || 0);

        if (!change.before.exists) {
          // New document created
          if (!newValue.isPriceless) {
            totalLbPriced += Number(newValue.quantity || 0);
            const amount =
              Number(newValue.price || 0) * Number(newValue.quantity || 0);
            totalAmount += amount;
            if (newValue.isRemate) {
              totalLbRemate += Number(newValue.quantity || 0);
            }
          } else {
            totalLbPriceless += Number(newValue.quantity || 0);
          }
        } else if (change.before.exists && change.after.exists) {
          // Document updated
          if (newValue.deleted === true) {
            // Treat as if the document was deleted
            if (!oldValue.isPriceless) {
              totalLbPriced -= Number(oldValue.quantity || 0);
              const amount =
                Number(oldValue.price || 0) * Number(oldValue.quantity || 0);
              totalAmount -= amount;
              if (oldValue.isRemate) {
                totalLbRemate -= Number(oldValue.quantity || 0);
              }
            } else {
              totalLbPriceless -= Number(oldValue.quantity || 0);
            }
          } else {
            // Normal update
            if (!oldValue.isPriceless) {
              totalLbPriced -= Number(oldValue.quantity || 0);
              const oldAmount =
                Number(oldValue.price || 0) * Number(oldValue.quantity || 0);
              totalAmount -= oldAmount;
              if (oldValue.isRemate) {
                totalLbRemate -= Number(oldValue.quantity || 0);
              }
            } else {
              totalLbPriceless -= Number(oldValue.quantity || 0);
            }
            if (!newValue.isPriceless) {
              totalLbPriced += Number(newValue.quantity || 0);
              const newAmount =
                Number(newValue.price || 0) * Number(newValue.quantity || 0);
              totalAmount += newAmount;
              if (newValue.isRemate) {
                totalLbRemate += Number(newValue.quantity || 0);
              }
            } else {
              totalLbPriceless += Number(newValue.quantity || 0);
            }
          }
        } else if (!change.after.exists) {
          // Document deleted
          if (!oldValue.isPriceless) {
            totalLbPriced -= Number(oldValue.quantity || 0);
            const amount =
              Number(oldValue.price || 0) * Number(oldValue.quantity || 0);
            totalAmount -= amount;
            if (oldValue.isRemate) {
              totalLbRemate -= Number(oldValue.quantity || 0);
            }
          } else {
            totalLbPriceless -= Number(oldValue.quantity || 0);
          }
        }
        // Calculate total advance payments
        if (newValue && newValue.advancePayments && !newValue.deleted) {
          const advancePaymentsTotal = newValue.advancePayments.reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
          );
          totalAdvancePayments += Number(advancePaymentsTotal);
        }
        if (oldValue && oldValue.advancePayments) {
          const oldAdvancePaymentsTotal = oldValue.advancePayments.reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
          );
          totalAdvancePayments -= Number(oldAdvancePaymentsTotal);
        }

        // Calculate average price
        const averagePrice =
          totalLbPriced > 0 ? Number(totalAmount / totalLbPriced) : 0;

        transaction.update(id_purchase, {
          totalLbPriced,
          totalLbPriceless,
          totalAmount,
          averagePrice,
          totalAdvancePayments,
          totalLbRemate,
        });
      });
      console.log(`Updated purchase ${id_purchase.id}`);
    } catch (error) {
      console.error('Error updating purchase:', error);
    }

    // Return null to indicate success
    return null;
  });
