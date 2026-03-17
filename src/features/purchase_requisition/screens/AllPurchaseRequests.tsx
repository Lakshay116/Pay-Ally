import React from 'react';
import PurchaseRequestList from './PurchaseRequestList';

export default function AllPurchaseRequests(props) {
  return <PurchaseRequestList {...props} type="all" />;
}
