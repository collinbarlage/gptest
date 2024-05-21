
async function addToCart(cart, userToken, productId) {
  console.log('~~~> productId', productId)
  var products = cart.products
  if (cart.products.find(p => p.id === productId)) {
    products.find(p => p.id === productId).quantity ++
  } else {
    products.push({id: parseInt(productId),
      price: 0,
      quantity: 1,
      giftCards: [],
      type: "N/A"})
  }

  products = products.map (p => {
    return { id: p.id,
      price: p.price,
      quantity: p.quantity,
      giftCards: p.giftCards,
      type: p.type
    }
  })

  const response = await fetch('https://graphql-federation-gateway.consumer.gopuff.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Token token=${userToken}`
    },
    body: JSON.stringify({
      query: `
                      mutation SetCart($cart: SetCartInputV2, $validate: Boolean = false, $taxes: Boolean = true) {
                view {
                  setCart: setCart_v2(cart: $cart, validate: $validate, taxes: $taxes) {
                    ...Cart
                    appliedCoupon @include(if: $validate) {
                      ...AppliedCoupon
                    }
                  }
                }
              }

              fragment AppliedCoupon on AppliedCoupon {
                appliedCoupons {
                  ...Coupon
                }
                subtotal
                subtotalMinimum: subtotal_minimum
                discount
                total
              }

              fragment Coupon on Coupon {
                id
                couponDetails: coupon_details {
                  ...MessageObject
                }
                discount
                displayInBag: display_in_basket
                couponCode: coupon_code
              }

              fragment MessageObject on MessageObject {
                message {
                  ...LocalizedMessageObject
                }
              }

              fragment LocalizedMessageObject on LocalizedMessageObject {
                lang
                msg
              }

              fragment CartProduct on CartProduct {
                id
                price
                quantity
                availableQuantity
                giftCards {
                  receiverName
                  receiverEmail
                  senderMessage
                  senderName
                }
                type
                error {
                  code
                  message
                }
              }

              fragment CartProductSample on CartProductSample {
                productId
                title
                availableQuantity
                description
                imageUrl
                isInsert
                isVisible
              }

              fragment CartErrorProduct on CartErrorProduct {
                id
                price
                quantity
                availableQuantity
              }

              fragment CartCoupon on CartCoupon {
                name
                id
                value
                percent
                productSubtotal
                discount
                type
              }

              fragment Fee on Fee {
                code
                amount
                originalAmount
                config {
                  title
                  description
                  bounds {
                    amount
                    lowBound
                    highBound
                  }
                  applicableSubtotal
                }
              }

              fragment DiscountsByChannels on PriceChannelDiscount {
                channel
                discount
                isActive
              }

              fragment OrderSummary on OrderSummary {
                subtotal
                deliveryFee
                deliveryDiscount
                discountSubtotal
                alcoholFee
                seattleMandateFee
                discount
                subtotalMinimum
                tax
                tip
                total
                discountsByChannels {
                  ...DiscountsByChannels
                }
                fees {
                  ...Fee
                }
                subtotalWithoutChannelDiscount
                isMinOrderValueMet
                mov
                remainingSubtotal
                nonEBTSubtotal
                ebtSubtotal
                nonEBTEligibleSubtotal
                ebtEligibleSubtotal
                nonEBTTotal
              }

              fragment CartTipOptions on CartTipOptions {
                value1: value_1
                value2: value_2
                value3: value_3
              }

              fragment TipOptionsPercentage on TipOptionsPercentage {
                percentage
                amount
              }

              fragment CartTipOptionsPercentage on CartTipOptionsPercentage {
                tipOptions {
                  ...TipOptionsPercentage
                }
                defaultValue
                defaultValueDollarAmount
              }

              fragment CartDeliveryZone on CartDeliveryZone {
                id
                rank
              }

              fragment CartRecipient on CartRecipient {
                addressId
                name
                phone
                email
              }

              fragment CartSender on CartSender {
                phone
                name
              }

              fragment CartGift on CartGift {
                from
                message
              }

              fragment OrderOption on OrderOption {
                key
                value
              }

              fragment Cart on Cart {
                id
                userId
                locationId
                latitude
                longitude
                contentParams
                email
                couponCode
                fulfillmentType
                isGift
                orderType
                scheduledFrom
                scheduledTo
                isPriorityFulfillment
                interactionId
                invoiceId
                userSelectedEbtAmount
                defaultCustomTip
                deliveryZones {
                  ...CartDeliveryZone
                }
                products {
                  ...CartProduct
                }
                productSamples {
                  ...CartProductSample
                }
                coupons {
                  ...CartCoupon
                }
                orderSummary {
                  ...OrderSummary
                }
                errors {
                  type
                  code
                  message
                  product {
                    ...CartErrorProduct
                  }
                }
                tipOptions {
                  ...CartTipOptions
                }
                tipOptionsPercentage {
                  ...CartTipOptionsPercentage
                }
                deliveryZones {
                  id
                  rank
                }
                recipient {
                  ...CartRecipient
                }
                sender {
                  ...CartSender
                }
                giftDetails {
                  ...CartGift
                }
                orderOptions {
                  ...OrderOption
                }
              }

        `,
      variables: {
            "taxes": false,
            "validate": false,
            "cart": {
              "cartId": cart.id,
              "currentTip": 0, //?
              "currentTipOptions": {
                "value1": 0,
                "value2": 0,
                "value3": 0
              },
              "email": cart.email,
              "fulfillmentType": cart.fulfillmentType,
              "giftDetails": cart.giftDetails,
              "interactionId": null, // ??
              "isGift": cart.isGift,
              "isPriorityFulfillment": cart.isPriorityFulfillment,
              "latitude": cart.latitude,
              "longitude": cart.longitude,
              "locationId": cart.locationId,
              "orderOptions": cart.orderOptions,
              "products": products,
              "recipient": cart.recipient,
              "scheduledFrom": cart.scheduledFrom,
              "scheduledTo": cart.scheduledTo,
              "sender": cart.sender,
              "userId": cart.userId,
              "userSelectedEbtAmount": cart.userSelectedEbtAmount
            }
          },
    }),
  })
  const responseData = await response.json();
  return responseData
}


async function getCart(userToken) {
  try {
    const response = await fetch('https://graphql-federation-gateway.consumer.gopuff.com/graphql', {
      method: 'POST',
      headers: getHeaders(userToken),
      body: JSON.stringify({
        query: "query Cart($validate: Boolean = false, $taxes: Boolean = true) {\n  view {\n    cart(validate: $validate, taxes: $taxes) {\n      ...Cart\n      appliedCoupon @include(if: $validate) {\n        ...AppliedCoupon\n      }\n    }\n  }\n}\n\nfragment CartProduct on CartProduct {\n  id\n  price\n  quantity\n  availableQuantity\n  giftCards {\n    receiverName\n    receiverEmail\n    senderMessage\n    senderName\n  }\n  type\n  error {\n    code\n    message\n  }\n}\n\nfragment CartProductSample on CartProductSample {\n  productId\n  title\n  availableQuantity\n  description\n  imageUrl\n  isInsert\n  isVisible\n}\n\nfragment CartErrorProduct on CartErrorProduct {\n  id\n  price\n  quantity\n  availableQuantity\n}\n\nfragment CartCoupon on CartCoupon {\n  name\n  id\n  value\n  percent\n  productSubtotal\n  discount\n  type\n}\n\nfragment Fee on Fee {\n  code\n  amount\n  originalAmount\n  config {\n    title\n    description\n    bounds {\n      amount\n      lowBound\n      highBound\n    }\n    applicableSubtotal\n  }\n}\n\nfragment DiscountsByChannels on PriceChannelDiscount {\n  channel\n  discount\n  isActive\n}\n\nfragment OrderSummary on OrderSummary {\n  subtotal\n  deliveryFee\n  deliveryDiscount\n  discountSubtotal\n  alcoholFee\n  seattleMandateFee\n  discount\n  subtotalMinimum\n  tax\n  tip\n  total\n  discountsByChannels {\n    ...DiscountsByChannels\n  }\n  fees {\n    ...Fee\n  }\n  subtotalWithoutChannelDiscount\n  isMinOrderValueMet\n  mov\n  remainingSubtotal\n  nonEBTSubtotal\n  ebtSubtotal\n  nonEBTEligibleSubtotal\n  ebtEligibleSubtotal\n  nonEBTTotal\n}\n\nfragment CartTipOptions on CartTipOptions {\n  value1: value_1\n  value2: value_2\n  value3: value_3\n}\n\nfragment TipOptionsPercentage on TipOptionsPercentage {\n  percentage\n  amount\n}\n\nfragment CartTipOptionsPercentage on CartTipOptionsPercentage {\n  tipOptions {\n    ...TipOptionsPercentage\n  }\n  defaultValue\n  defaultValueDollarAmount\n}\n\nfragment CartDeliveryZone on CartDeliveryZone {\n  id\n  rank\n}\n\nfragment CartRecipient on CartRecipient {\n  addressId\n  name\n  phone\n  email\n}\n\nfragment CartSender on CartSender {\n  phone\n  name\n}\n\nfragment CartGift on CartGift {\n  from\n  message\n}\n\nfragment OrderOption on OrderOption {\n  key\n  value\n}\n\nfragment InvoiceCreditDebit on InvoiceCreditDebit {\n  amount\n  type\n  title\n  comments\n}\n\nfragment Cart on Cart {\n  id\n  userId\n  locationId\n  latitude\n  longitude\n  contentParams\n  email\n  couponCode\n  fulfillmentType\n  isGift\n  orderType\n  scheduledFrom\n  scheduledTo\n  isPriorityFulfillment\n  interactionId\n  invoiceId\n  userSelectedEbtAmount\n  defaultCustomTip\n  deliveryZones {\n    ...CartDeliveryZone\n  }\n  products {\n    ...CartProduct\n  }\n  productSamples {\n    ...CartProductSample\n  }\n  coupons {\n    ...CartCoupon\n  }\n  orderSummary {\n    ...OrderSummary\n  }\n  errors {\n    type\n    code\n    message\n    product {\n      ...CartErrorProduct\n    }\n  }\n  tipOptions {\n    ...CartTipOptions\n  }\n  tipOptionsPercentage {\n    ...CartTipOptionsPercentage\n  }\n  deliveryZones {\n    id\n    rank\n  }\n  recipient {\n    ...CartRecipient\n  }\n  sender {\n    ...CartSender\n  }\n  giftDetails {\n    ...CartGift\n  }\n  orderOptions {\n    ...OrderOption\n  }\n  creditsAndDebits {\n    ...InvoiceCreditDebit\n  }\n  credits\n  debits\n}\n\nfragment AppliedCoupon on AppliedCoupon {\n  appliedCoupons {\n    ...Coupon\n  }\n  subtotal\n  subtotalMinimum: subtotal_minimum\n  discount\n  total\n}\n\nfragment Coupon on Coupon {\n  id\n  couponDetails: coupon_details {\n    ...MessageObject\n  }\n  discount\n  displayInBag: display_in_basket\n  couponCode: coupon_code\n}\n\nfragment MessageObject on MessageObject {\n  message {\n    ...LocalizedMessageObject\n  }\n}\n\nfragment LocalizedMessageObject on LocalizedMessageObject {\n  lang\n  msg\n}\n",
        'operationName': 'Cart',
        'variables': {
          'taxes': false,
          'validate': true
        }
      })
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return {"error": ":("};
  }
}

async function getAddress(userToken) {
  try {
    const response = await fetch('https://graphql-federation-gateway.consumer.gopuff.com/graphql', {
      method: 'POST',
      headers: getHeaders(userToken),
      body: JSON.stringify({

        query: "query UserAddress {\n  userAddresses(pageSize: 1) {\n    collection {\n      ...Address\n    }\n  }\n}\n\nfragment Address on UserAddress {\n  id: railsId\n  lineOne\n  apt\n  zip\n  longitude\n  latitude\n  streetNumber\n  route\n  state\n  city\n  country\n  deliveryInstructions\n  fullAddress\n  recipientName\n  recipientPhone\n  recipientEmail\n}\n",
        'operationName': 'UserAddress',
        'variables': {}
      })
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return {"error": ":("};
  }
}

function getHeaders(userToken) {
  return {
    'accept': 'application/graphql+json, application/json',
    'accept-language': 'en-US',
    'authorization': `Token token=${userToken}`,
    'content-type': 'application/json',
    'origin': 'https://www.gopuff.com',
    'priority': 'u=1, i',
    'sec-ch-ua-mobile': '?1',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'x-gp-point-of-sale': 'US'
  }
}

const exports = {
  getCart,
  addToCart,
  getAddress
};

export default exports;
