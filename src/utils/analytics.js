import analytics from '@react-native-firebase/analytics';

/** item = {item_name: '', item_brand: 'FurrCrew', item_id: '', price: 10.0, quantity: 1, item_category: 'event|vet|groomer|adoption|ngo|course|webinar|shop|article|blog'} */
/** PurchaseEventParameters = {affiliation, items, transaction_id, coupon, shipping, value, currency, tak} */
/** ViewPromotionEventParameters = {creative_name, items, promotion_id, creative_shot, location_id, promotion_name} */
/** ViewItemEventParameters = {currency: 'INR', items: [], value: 10.0} */

const log = async ({event, options}) => {
    // console.log('-------------analytics---------', event, options);
    return await analytics().logEvent(event, options);
}

export const logViewItem = async (userId, ViewItemEventParameters) => {
    await analytics().setUserId(userId);
    return await analytics().logViewItem(ViewItemEventParameters);
}

export const logViewAd = async (userId, ViewPromotionEventParameters) => {
    await analytics().setUserId(userId);
    return await analytics().logViewPromotion(ViewPromotionEventParameters);
}

export const appointmentAccepted = async (type, id, userId) => {
    await analytics().setUserId(userId);
    return await log({event: 'partner_appointment_accept', options: { 'service_type': type, 'service_provider': id }});
}

export const appointmentRejected = async (type, id, userId) => {
    await analytics().setUserId(userId);
    return await log({event: 'partner_appointment_reject', options: { 'service_type': type, 'service_provider': id }});
}