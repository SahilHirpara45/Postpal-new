import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export const packageHistory = async (
  oldValue,
  newValue,
  agentName,
  packageCollectionName
) => {
  console.log("packageHistory log", oldValue, newValue, agentName);
  const docRef = doc(db, packageCollectionName, oldValue?.id);
  const updateData = (diff) => {
    getDoc(docRef).then((docSnapshot) => {
      console.log(docSnapshot.exists(), "docSnapshot>> 1111");
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (!data.history) {
          data.history = {
            preShopping: [],
            verification: [],
            postShopping: [],
            preShipping: [],
            postShipping: [],
            finalPrice: [],
            package: [],
          };
        }

        // Update package as an array of objects
        data.history.package = [...data.history.package, ...diff];

        // Now, update the Firestore document with the modified history data
        updateDoc(docRef, data)
          .then((res) => console.log())
          .catch((error) => console.error("Error updating document: ", error));
      }
    });
  };
  const changes = [];

  if (oldValue?.brand?.brandName !== newValue.brand?.brandName) {
    const diff = {
      sentence: `<strong>${oldValue?.packageTrackingId}</strong> Package Merchant of <strong>${oldValue?.brand?.brandName}</strong> was changed to <strong>${newValue?.brand?.brandName}</strong>`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
    };
    changes.push(diff);
  }

  if (
    oldValue?.merchantIndicator &&
    oldValue?.merchantIndicator !== newValue.merchantIndicator
  ) {
    const diff = {
      sentence: `<strong>${oldValue?.packageTrackingId}</strong> Package Merchant Indicator of <strong>${oldValue?.merchantIndicator}</strong> was changed to <strong>${newValue?.merchantIndicator}</strong>`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
    };
    changes.push(diff);
  }

  if (oldValue?.packageTotalWeight !== newValue.packageTotalWeight) {
    const diff = {
      sentence: `<strong>${oldValue?.packageTrackingId}</strong> Package Weight of <strong>${oldValue?.packageTotalWeight}</strong> was changed to <strong>${newValue?.packageTotalWeight}</strong>`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
    };
    changes.push(diff);
  }

  if (oldValue?.shelfId !== null && oldValue?.shelfId !== newValue.shelfId) {
    const diff = {
      sentence: `<strong>${oldValue?.packageTrackingId}</strong> Package Shelf ID of <strong>${oldValue?.shelfId}</strong> was changed to <strong>${newValue?.shelfId}</strong>`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
    };
    changes.push(diff);
  }

  if (
    oldValue.dimensionH &&
    oldValue.dimensionL &&
    oldValue.dimensionW &&
    (oldValue.dimensionH !== newValue.dimensionH ||
      oldValue.dimensionL !== newValue.dimensionL ||
      oldValue.dimensionW !== newValue.dimensionW)
  ) {
    const diff = {
      sentence: `Dimension of <strong>${oldValue?.packageTrackingId}</strong> package <strong>${oldValue.dimensionL}</strong>(Length) <strong>${oldValue.dimensionW}</strong>(Width) <strong>${oldValue.dimensionH}</strong>(Height) was changed to <strong>${newValue.dimensionL}</strong>(Length) <strong>${newValue.dimensionW}</strong>(Width) <strong>${newValue.dimensionH}</strong>(Height)`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
    };
    changes.push(diff);
  }

  // Update the Firestore document with all accumulated changes
  if (changes.length > 0) {
    updateData(changes);
  }
  console.log(changes, "changes");
};

export const preShoppingHistory = async (
  oldValue,
  newValue,
  agentName,
  packageActiveData,
  packageCollectionName
  // notSelectedItem,
  // manualSortFee
) => {
  console.log(
    oldValue,
    newValue,
    agentName,
    packageActiveData,
    // notSelectedItem,
    // manualSortFee,
    "values in preShoppingHistory"
  );

  const docRef = doc(db, packageCollectionName, packageActiveData?.id);
  console.log(docRef, "docRef");

  const updateData = (diff) => {
    getDoc(docRef).then((docSnapshot) => {
      console.log(docSnapshot.exists(), "docSnapshot>>");
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        console.log(data, "data>>");
        if (!data.history) {
          data.history = {
            preShopping: [],
            verification: [],
            postShopping: [],
            preShipping: [],
            postShipping: [],
            finalPrice: [],
            package: [],
          };
        }

        // Update preShopping as an array of objects
        data.history.preShopping = [...data.history.preShopping, ...diff];

        // Now, update the Firestore document with the modified history data
        updateDoc(docRef, data)
          .then((res) => console.log())
          .catch((error) => console.error("Error updating document: ", error));
      }
    });
  };
  const changes = [];

  if (oldValue.price !== newValue.preShopping.price) {
    const diff = {
      previousValue: oldValue.price,
      newValue: newValue.preShopping.price,
      sentence: `The price per item <strong>${oldValue.shortenedName}</strong> was updated from <strong>$${oldValue.price}</strong> to <strong>$${newValue.preShopping.price}</strong>`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  }

  if (oldValue.quantity !== newValue.preShopping.quantity) {
    const diff = {
      previousValue: oldValue.quantity,
      newValue: newValue.preShopping.quantity,
      sentence: `The Quantity <strong>${oldValue.shortenedName}</strong> was updated from <strong>${oldValue.quantity}</strong> to <strong>${newValue.preShopping.quantity}</strong>`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  }

  if (oldValue.tax !== newValue.preShopping.tax) {
    const diff = {
      previousValue: oldValue.tax,
      newValue: newValue.preShopping.tax,
      sentence: `Tax in the amount of <strong>$${newValue.preShopping.tax}</strong> was updated for <strong>${oldValue.shortenedName}</strong>.`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  }

  if (oldValue.weight !== newValue.preShopping.weight) {
    const diff = {
      previousValue: oldValue.weight,
      newValue: newValue.preShopping.weight,
      sentence: `The Weight per item <strong>${oldValue.shortenedName}</strong> was updated from <strong>${oldValue.weight}lb</strong> to <strong>${newValue.preShopping.weight}lb</strong>`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  }

  if (oldValue.preShoppingStatus !== newValue.preShopping.preShoppingStatus) {
    if (newValue.preShopping.preShoppingStatus === "Cancel Item") {
      const diff = {
        previousValue: oldValue.preShoppingStatus,
        newValue: newValue.preShopping.preShoppingStatus,
        sentence: `<strong>${oldValue.shortenedName}</strong> was canceled`,
        updatedBy: ` by <strong>${agentName}</strong>`,
        date: new Date(),
        isSeen: false,
      };
      changes.push(diff);
    } else if (newValue.preShopping.preShoppingStatus === "Out of Stock") {
      const diff = {
        previousValue: oldValue.preShoppingStatus,
        newValue: newValue.preShopping.preShoppingStatus,
        sentence: `<strong>${oldValue.shortenedName}</strong> is Out of Stock`,
        updatedBy: ` by <strong>${agentName}</strong>`,
        date: new Date(),
        isSeen: false,
      };
      changes.push(diff);
    }
    // else if (newValue.preShopping.preShoppingStatus === "Replaced") {
    //   const replacedItemName = notSelectedItem?.filter((item) =>
    //     newValue.preShopping.replacedWith?.includes(item?.id)
    //   );
    //   const diff = {
    //     previousValue: oldValue.replacedWith,
    //     newValue: newValue.preShopping.replacedWith,
    //     sentence: `<strong>Current ${oldValue.name}</strong> was replaced with New <strong>${replacedItemName[0].name}</strong>`,
    //     updatedBy: ` by <strong>${agentName}</strong>`,
    //     date: new Date(),
    //     isSeen: false,
    //   };
    //   changes.push(diff);
    // }
    else if (
      newValue.preShopping.preShoppingStatus === "Exporting Contraband"
    ) {
      const diff = {
        previousValue: oldValue.preShoppingStatus,
        newValue: newValue.preShopping.preShoppingStatus,
        sentence: `<strong>${oldValue.shortenedName}</strong> was marked as an Export contraband`,
        updatedBy: ` by <strong>${agentName}</strong>`,
        date: new Date(),
        isSeen: false,
      };
      changes.push(diff);
    } else if (
      newValue.preShopping.preShoppingStatus === "Importing Contraband"
    ) {
      const diff = {
        previousValue: oldValue.preShoppingStatus,
        newValue: newValue.preShopping.preShoppingStatus,
        sentence: `<strong>${oldValue.shortenedName}</strong> was marked as an Importing Contraband`,
        updatedBy: ` by <strong>${agentName}</strong>`,
        date: new Date(),
        isSeen: false,
      };
      changes.push(diff);
    }
  }

  // if (oldValue[0].isManualSort !== newValue.preShopping.isManualSort) {
  //   if (newValue.preShopping.isManualSort) {
  //     const diff = {
  //       sentence: `You were charged a manual sort fee of <strong>$${manualSortFee}</strong> as item <strong>${oldValue[0].name}</strong> arrived without an order started by you or package arrived without Bay number`,
  //       updatedBy: ` by <strong>${agentName}</strong>`,
  //       date: new Date(),
  //       isSeen: false,
  //     };
  //     changes.push(diff);
  //   } else {
  //     const diff = {
  //       sentence: `Manual sort fee of <strong>$${manualSortFee}</strong> which was previously added in item <strong>${oldValue[0].name}</strong> was removed`,
  //       updatedBy: ` by <strong>${agentName}</strong>`,
  //       date: new Date(),
  //       isSeen: false,
  //     };
  //     changes.push(diff);
  //   }
  // }

  // if (
  //   oldValue[0].merchantShippingCost !==
  //   newValue.preShopping.merchantShippingCost
  // ) {
  //   const diff = {
  //     sentence: `The Merchant Shipping cost for <strong>${oldValue[0].name}</strong> was updated from <strong>$${oldValue[0].merchantShippingCost}</strong> to <strong>$${newValue.preShopping.merchantShippingCost}`,
  //     // updatedBy: ` by <strong>${agentName}</strong>`,
  //     date: new Date(),
  //     isSeen: false,
  //   };
  //   changes.push(diff);
  // }

  if (oldValue.promoCode !== newValue.preShopping.promoCode) {
    if (oldValue.promoCode) {
      const diff = {
        sentence: `Promo code for <strong>${oldValue.shortenedName}</strong> was update with <strong>${newValue.preShopping.promoCode} from <strong>${oldValue.promoCode}</strong>`,
        // updatedBy: ` by <strong>${agentName}</strong>`,
        date: new Date(),
        isSeen: false,
      };
      changes.push(diff);
    } else {
      const diff = {
        sentence: `A new Promo code for <strong>${oldValue.shortenedName}</strong> was entered to help you save on this item.`,
        // updatedBy: ` by <strong>${agentName}</strong>`,
        date: new Date(),
        isSeen: false,
      };
      changes.push(diff);
    }
  }

  // Update the Firestore document with all accumulated changes
  if (changes.length > 0) {
    updateData(changes);
  }
  console.log(changes, "changes");
};

export const verificationHistory = (
  reason,
  packageActiveData,
  agentName,
  packageCollectionName
) => {
  const docRef = doc(db, packageCollectionName, packageActiveData?.id);

  const changes = [];
  const diff = {
    sentence: `Verification was requested due to <strong>${reason}</strong>`,
    updatedBy: ` by <strong>${agentName}</strong>`,
    date: new Date(),
    isSeen: false,
  };
  changes.push(diff);

  getDoc(docRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      // console.log(data, "data>>");
      if (!data.history) {
        data.history = {
          preShopping: [],
          verification: [],
          postShopping: [],
          preShipping: [],
          postShipping: [],
          finalPrice: [],
          package: [],
        };
      }

      // Update postShoppingStatus as an array of objects
      data.history.verification = [...data.history.verification, ...changes];

      // Now, update the Firestore document with the modified history data
      updateDoc(docRef, data)
        .then((res) => console.log())
        .catch((error) => console.error("Error updating document: ", error));
    }
  });
};

export const postShoppingHistory = (
  oldValue,
  value,
  agentName,
  packageActiveData,
  packageCollectionName
) => {
  // console.log(
  //   oldValue,
  //   value,
  //   agentName,
  //   packageActiveData,
  //   packageCollectionName,
  //   "old new value in post shopping history"
  // );
  const docRef = doc(db, packageCollectionName, packageActiveData?.id);

  const changes = [];

  // selectedItems.map((item, v) => {
  if (value.postShoppingStatus === "Placed order") {
    const diff = {
      sentence: `The Status <strong>${packageActiveData?.id}</strong> was updated to <strong>${value.postShoppingStatus}</strong><br />
        <strong>Order No.:</strong> ${value.orderNumber}`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  } else if (value.postShoppingStatus === "Order Received") {
    const diff = {
      sentence: `The Status <strong>${packageActiveData?.id}</strong> was updated to <strong>${value.postShoppingStatus}</strong><br />
        <strong>Tracing No.:</strong> ${value.tracingNumber}`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  } else if (value.postShoppingStatus === "Return by Admin") {
    const diff = {
      sentence: `Admin returned <strong>${packageActiveData?.id}</strong> to the shopping vendor. Please contact admin for more information.`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  } else if (value.postShoppingStatus === "Customer requested return") {
    const diff = {
      sentence: `Your request to return <strong>${packageActiveData?.id}</strong> was completed. Any eligible refund will be applied.`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  } else {
    const diff = {
      sentence: `The Status <strong>${packageActiveData?.id}</strong> was updated to <strong>${value.postShoppingStatus}</strong>`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  }
  // });
  getDoc(docRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      // console.log(data, "data>>");
      if (!data.history) {
        data.history = {
          preShopping: [],
          verification: [],
          postShopping: [],
          preShipping: [],
          postShipping: [],
          finalPrice: [],
          package: [],
        };
      }

      // Update postShoppingStatus as an array of objects
      data.history.postShopping = [...data.history.postShopping, ...changes];

      // Now, update the Firestore document with the modified history data
      updateDoc(docRef, data)
        .then((res) => console.log())
        .catch((error) => console.error("Error updating document: ", error));
    }
  });
};

export const preShippingHistory = (
  oldValue,
  value,
  agentName,
  packageActiveData,
  packageCollectionName
) => {
  console.log(
    oldValue,
    value,
    agentName,
    packageActiveData,
    packageCollectionName,
    "old new value in pre shipping history"
  );

  const docRef = doc(db, packageCollectionName, packageActiveData?.id);

  const changes = [];

  // selectedItems.map((item, v) => {
  const diff = {
    sentence: `The Status of <strong> ${packageActiveData?.id} </strong> was updated to <strong>${value.preShippingStatus}</strong>`,
    updatedBy: ` by <strong>${agentName}</strong>`,
    date: new Date(),
    isSeen: false,
  };
  changes.push(diff);

  // console.log(changes, ">>>ccchngessss");

  getDoc(docRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      if (!data.history) {
        data.history = {
          preShopping: [],
          verification: [],
          postShopping: [],
          preShipping: [],
          postShipping: [],
          finalPrice: [],
          package: [],
        };
      }

      data.history.preShipping = [...data.history.preShipping, ...changes];

      updateDoc(docRef, data)
        .then((res) => console.log())
        .catch((error) => console.error("Error updating document: ", error));
    }
  });
  // });
};

export const postShippingHistory = (
  itemData,
  value,
  agentName,
  packageActiveData,
  packageCollectionName
) => {
  const docRef = doc(db, packageCollectionName, packageActiveData?.id);

  const changes = [];

  // selectedItems.map((item, v) => {
  const diff = {
    sentence: `The Item <strong> ${packageActiveData?.id} </strong> was updated to <strong>${value}</strong><br />`,
    updatedBy: ` by <strong>${agentName}</strong>`,
    date: new Date(),
    isSeen: false,
  };
  changes.push(diff);

  getDoc(docRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      if (!data.history) {
        data.history = {
          preShopping: [],
          verification: [],
          postShopping: [],
          preShipping: [],
          postShipping: [],
          finalPrice: [],
          package: [],
        };
      }
      data.history.postShipping = [...data.history.postShipping, ...changes];

      updateDoc(docRef, data)
        .then((res) => console.log())
        .catch((error) => console.error("Error updating document: ", error));
    }
  });
  // });
};

export const finalPriceHistory = (
  orderactiveData,
  value,
  agentName,
  orderactive,
  Finalbalance
) => {
  // console.log(
  //   orderactiveData,
  //   value,
  //   agentName,
  //   orderactive,
  //   Finalbalance,
  //   "selectedItems,value, agentName,orderactive"
  // );

  const docRef = doc(db, "order", orderactive);

  const changes = [];

  // if (orderactiveData.packagingWeight !== value.packagingWeight) {
  const diff1 = {
    sentence: `Packaging weight of <strong>${value.packagingWeight}lb</strong> was added`,
    updatedBy: ` by <strong>${agentName}</strong>`,
    date: new Date(),
    isSeen: false,
  };
  changes.push(diff1);
  // }
  // if (orderactiveData?.dimensionalWeightPrice.storageFeeTotal !== value.storageFeeTotal) {
  const diff2 = {
    sentence: `Total storage fee for <strong>${value.storageDays} days</strong> in the amout of <strong>$${value.storageFeeTotal}</strong> was added`,
    updatedBy: ` by <strong>${agentName}</strong>`,
    date: new Date(),
    isSeen: false,
  };
  changes.push(diff2);
  // }
  // if (
  //   orderactiveData.dimensionalWeightPrice.height !== value.height ||
  //   orderactiveData.dimensionalWeightPrice.length !== value.length ||
  //   orderactiveData.dimensionalWeightPrice.width !== value.width ||
  //   orderactiveData.dimensionalWeightPrice.price !== value.price
  // ) {
  const diff3 = {
    sentence: `Dimensional weight price (DIM) of <strong>${value.length}</strong>(Length) <strong>${value.width}</strong>(Width) <strong>${value.height}</strong>(Height) was charged in the amount of <strong>$${value.price}</strong> was charged`,
    updatedBy: ` by <strong>${agentName}</strong>`,
    date: new Date(),
    isSeen: false,
  };
  changes.push(diff3);
  // }
  if (orderactiveData.amountDue !== Finalbalance && Finalbalance < 0) {
    const diff = {
      sentence: `A refund in the amount of <strong>$${Finalbalance}</strong> was issued`,
      updatedBy: ` by <strong>${agentName}</strong>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  }
  if (orderactiveData.amountDue !== Finalbalance && Finalbalance > 0) {
    const diff = {
      sentence: `You have a balance in the amount of <strong>$${Finalbalance}</strong> Please <button class="btn btn-primary">PAY NOW</button>`,
      date: new Date(),
      isSeen: false,
    };
    changes.push(diff);
  }

  getDoc(docRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      if (!data.history) {
        data.history = {
          preShopping: [],
          verification: [],
          postShopping: [],
          preShipping: [],
          postShipping: [],
          finalPrice: [],
        };
      }
      data.history.finalPrice = [...data.history.finalPrice, ...changes];

      updateDoc(docRef, data)
        .then((res) => console.log())
        .catch((error) => console.error("Error updating document: ", error));
    }
  });
};

export const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const MediaDownloadLink = ({ mediaUrl, fileName }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mediaUrl;
    link.download = fileName; // Specify the desired file name
    link.click();
  };

  return <button onClick={handleDownload}>Download Media</button>;
};
