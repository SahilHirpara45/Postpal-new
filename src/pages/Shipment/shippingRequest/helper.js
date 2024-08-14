import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

export const calculateTotalValues = async (selectedPackages) => {
    if (selectedPackages.length > 0) {
      let totalAmount = 0;
      let totalWeight = 0;
      let packageItemIds = [];
      let uniqueBrands = new Set();
  
      for (const packageId of selectedPackages) {
        try {
          const docRef = doc(db, "shelfPackages", packageId);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const packageData = docSnap.data();
            totalAmount += packageData.packageTotalAmount || 0;
            totalWeight += packageData.packageTotalWeight || 0;
            packageItemIds.push(...packageData.packageItemIds);
            // Add unique brands
            uniqueBrands.add(packageData.brand.brandName);
          }
        } catch (error) {
          console.error("Error fetching package details:", error);
        }
      }
  
      return {
        totalAmount: totalAmount,
        totalWeight: totalWeight,
        packageItemIds: packageItemIds,
        merchantCount: uniqueBrands.size,
      };
    }
  };