// src/services/apApiService.js

// API Configuration for Accounts Payable
const API_PURCHASE_ORDERS = 'https://api-pos.hulmsolutions.com/POS/accountinghamid/bea876f9-b274-4cd2-9f86-d28953bee69d/PurchaseOrderManagement/purchaseOrdersWithoutDetails';
const API_VENDORS = 'https://api-pos.hulmsolutions.com/POS/accountinghamid/bea876f9-b274-4cd2-9f86-d28953bee69d/VendorManagement/vendors';
const API_PRODUCTS = 'https://api-pos.hulmsolutions.com/POS/accountinghamid/bea876f9-b274-4cd2-9f86-d28953bee69d/products?status=All&start=0&size=200';

// Replace with your actual Bearer token
const BEARER_TOKEN = 'your-bearer-token-here';

const apiHeaders = {
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'Content-Type': 'application/json',
};

export const apApiService = {
  async fetchProducts() {
    const response = await fetch(API_PRODUCTS, {
      method: 'GET',
      headers: apiHeaders,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  async fetchPurchaseOrders() {
    const response = await fetch(API_PURCHASE_ORDERS, {
      method: 'GET',
      headers: apiHeaders,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  async fetchVendors() {
    const response = await fetch(API_VENDORS, {
      method: 'GET',
      headers: apiHeaders,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

transformVendors(apiVendors, allPOData) {
  return apiVendors
    .map(vendor => {
      let vendorDetails = null;
      let actualType = vendor.type;

      // If vendor.type is Individual but no individuals exist, fall back to organizations
      if (vendor.type === 'Individual') {
        if (vendor.individuals && vendor.individuals.length > 0) {
          vendorDetails = vendor.individuals[0];
        } else if (vendor.organizations && vendor.organizations.length > 0) {
          vendorDetails = vendor.organizations[0];
          actualType = 'Organization'; // 👈 override
        }
      } else if (vendor.type === 'Organization') {
        vendorDetails = vendor.organizations && vendor.organizations.length > 0 ? vendor.organizations[0] : null;
      }

      if (!vendorDetails) {
        console.warn(`No details found for vendor ${vendor.id}`);
        return null;
      }

      const contactInfo = vendorDetails.contactMediums && vendorDetails.contactMediums.length > 0
        ? vendorDetails.contactMediums[0].mediumCharacteristics[0]
        : {};

      const vendorPOs = allPOData.filter(po => 
        po.vendor_Id === vendor.id || 
        po.Vendor_Id === vendor.id
      );

      const totalPayable = vendorPOs
        .filter(po => !po.purchaseOrderItems.every(item => item.status === 'applied'))
        .reduce((sum, po) => {
          const poTotal = po.purchaseOrderItems.reduce((itemSum, item) => 
            itemSum + (item.totalPrice || 0), 0);
          return sum + poTotal;
        }, 0);

      const overdueAmount = totalPayable;
      const billCount = vendorPOs.length;

      let vendorName = `Vendor ${vendor.id}`;
      if (actualType === 'Individual') {
        vendorName = vendorDetails.fullName || vendorName;
      } else if (actualType === 'Organization') {
        vendorName = vendorDetails.tradingName || vendorDetails.legalName || vendorName;
      }

      return {
        id: vendor.id,
        name: vendorName,
        email: contactInfo.emailAddress || 'No email provided',
        phone: contactInfo.number || 'No phone provided',
        address: `${contactInfo.street1 || ''} ${contactInfo.city || ''} ${contactInfo.country || ''}`.trim() || 'No address provided',
        vendorType: actualType,
        paymentTerms: actualType === 'Organization' ? 45 : 30,
        totalPayable,
        overdueAmount,
        lastPayment: 'No payments',
        accountBalance: totalPayable,
        billCount,
        avgPaymentDays: 30,
        status: vendor.status || 'active',
        type: actualType
      };
    })
    .filter(v => v !== null);
}



};