import React from 'react';
import PurchaseRequestList from './PurchaseRequestList';

export default function MyPurchaseRequests(props) {
  return <PurchaseRequestList {...props} type="my" />;
}
