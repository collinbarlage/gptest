import React from "react";

export class TestButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cart: 0
    }
  }

  handleClick(e) {
    this.setState({ cart: this.state.cart + 1 })
 const url = "https://graphql-federation-gateway.consumer.gopuff.com/graphql";

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'authorization': "Token token=bb019378-084b-48e7-970e-f009038b15fa"
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
            "cartId": "e2501b7c-47c0-4b8a-9718-bbbd3d13b93a",
            "currentTip": 0,
            "currentTipOptions": {
              "value1": 0,
              "value2": 0,
              "value3": 0
            },
            "email": "qwazta@wat.com",
            "fulfillmentType": "fulfillment_delivery",
            "giftDetails": null,
            "interactionId": "33310c3d-4f30-4658-ba55-9611020221ec",
            "isGift": false,
            "isPriorityFulfillment": false,
            "latitude": 40.6917992,
            "locationId": 554,
            "longitude": -73.9362227,
            "orderOptions": [],
            "products": [
              {
                "giftCards": [],
                "id": 26694,
                "price": 0,
                "quantity": this.state.cart,
                "type": "N/A"
              },

            ],
            "recipient": {
              "addressId": 116025801,
              "name": "Collin Dev",
              "phone": "+12485352223",
              "email": "qwazta@wat.com"
            },
            "scheduledFrom": null,
            "scheduledTo": null,
            "sender": {
              "phone": "+12485352223",
              "name": null
            },
            "userId": "gopuff-user-140360",
            "userSelectedEbtAmount": null
          }
        },
  }),
})
  .then((res) => res.json())
  .then((result) => console.log(result));
  }


  render () {
    return (
      <div>
        <button style={{'width':'10%', 'margin': '20px'}} onClick={(e) => this.handleClick(e)}> add to cart! </button>
      </div>
    )
  }
}
