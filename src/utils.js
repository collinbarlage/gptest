
const GQL_PROD_URL = 'https://graphql-federation-gateway.consumer.gopuff.com/graphql'
const GQL_DEV_URL = 'https://graphql-federation-gateway.consumer.gopuff.dev/graphql'

async function addToCart(cart, userToken, productsToAdd) {
  var products = cart.products
  productsToAdd.forEach(productToAdd => {
    if (cart.products.find(p => p.id === productToAdd.productId)) {
      products.find(p => p.id === productToAdd.productId).quantity += productToAdd.quantity
    } else {
      products.push({id: parseInt(productToAdd.productId),
        price: 0,
        quantity: 1,
        giftCards: [],
        type: "N/A"})
    }
  })



  products = products.map (p => {
    return { id: p.id,
      price: p.price,
      quantity: p.quantity,
      giftCards: p.giftCards,
      type: p.type
    }
  })

  const response = await fetch(getUrl(userToken), {
    method: 'POST',
    headers: getHeaders(userToken),
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
    const response = await fetch(getUrl(userToken), {
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
    const response = await fetch(getUrl(userToken), {
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
    "authorization": `Token token=${userToken}`,
    "accept": "application/graphql+json, application/json",
    "accept-language": "en-US",
    "content-type": "application/json",
    "origin": "https://www.gopuff.com",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-gopuff-client-platform": "web",
    "x-gopuff-client-user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "x-gopuff-client-version": "10.6.21-177109",
    "x-gp-point-of-sale": "US"
  }
}

async function getContent(userToken, route) {
  const query = "query Content($route: String!, $contentParams: String, $apiVersion: String!, $addressId: Int, $fulfillmentType: String) {\n  view {\n    content: content_v3(\n      route: $route\n      contentParams: $contentParams\n      apiVersion: $apiVersion\n      addressId: $addressId\n      fulfillmentType: $fulfillmentType\n    ) {\n      ... on BaseContent {\n        ...Content\n      }\n      ... on PdpContent {\n        ...Content\n        product {\n          ...PdpProduct\n        }\n      }\n      __typename\n    }\n  }\n}\n\nfragment Content on ContentInterface {\n  id\n  route\n  ... on BaseContent {\n    showUserFilters\n    palette {\n      ...PagePalette\n    }\n  }\n  title\n  availability {\n    availableNow\n    willOpenOn\n    willCloseOn\n  }\n  messages {\n    type\n    text\n    destination\n  }\n  content {\n    __typename\n    ... on Collection {\n      ...CollectionContent\n    }\n    ... on ProductCollection {\n      surfaceId\n      entityId\n      entityType\n      searchRequestId\n      action {\n        __typename\n        ... on CartAction {\n          ...CartActionContent\n        }\n        ... on ClickThroughAction {\n          destinationUrl\n        }\n      }\n      adTrackingId\n      availability {\n        availableNow\n        willOpenOn\n        willCloseOn\n      }\n      palette {\n        ...Palette\n      }\n      collection {\n        ...TileProduct\n      }\n      actions {\n        ...ContentEventAction\n      }\n      totalProductCount\n      isTotalCountApproximate\n      contentQuickFilter {\n        ...ContentQuickFilter\n      }\n      subHeaderText\n    }\n    ... on LinkCollection {\n      adTrackingId\n      availability {\n        availableNow\n        willOpenOn\n        willCloseOn\n      }\n      entityId\n      entityType\n      surfaceId\n      palette {\n        ...Palette\n      }\n      collection {\n        ...Link\n      }\n      actions {\n        ...ContentEventAction\n      }\n    }\n    ... on ContentFilter {\n      id\n      surfaceId\n      type\n      totalResults\n      collection {\n        ...EmptyObjectContent\n      }\n    }\n    ... on InvisibleCollection {\n      id\n      surfaceId\n      actions {\n        ...ContentEventAction\n      }\n      collection {\n        ...EmptyObjectContent\n      }\n    }\n    ... on CTACollection {\n      id\n      surfaceId\n      entityId\n      collection {\n        ...CTACollectionContent\n      }\n    }\n    ... on SeoContent {\n      id\n      surfaceId\n      entityId\n      text {\n        ...ContentText\n      }\n      copyBlock {\n        ...SeoContentTextContent\n      }\n      questions {\n        ...SeoContentTextContent\n      }\n      questionLinks {\n        ...SeoContentLinkContent\n      }\n      collection {\n        ...EmptyObjectContent\n      }\n    }\n    ... on LinkAndProductCollection {\n      id\n      surfaceId\n      entityId\n      entityType\n      destination\n      imageTypes {\n        ...ImageTypes\n      }\n      text {\n        ...ContentText\n      }\n      palette {\n        ...Palette\n      }\n      collection {\n        ...LinkOrProduct\n      }\n      searchRequestId\n      action {\n        __typename\n        ... on CartAction {\n          ...CartActionContent\n        }\n        ... on ClickThroughAction {\n          destinationUrl\n        }\n      }\n      adTrackingId\n      availability {\n        availableNow\n        willOpenOn\n        willCloseOn\n      }\n      actions {\n        ...ContentEventAction\n      }\n      totalProductCount\n      isTotalCountApproximate\n      contentQuickFilter {\n        ...ContentQuickFilter\n      }\n    }\n  }\n}\n\nfragment PagePalette on PagePalette {\n  navbarPalette {\n    ...Palette\n  }\n}\n\nfragment Palette on Palette {\n  primary\n  secondary\n  accent\n  background\n  surface\n}\n\nfragment CollectionContent on Collection {\n  id\n  surfaceId\n  destination\n  next\n  imageTypes {\n    ...ImageTypes\n  }\n  open {\n    ...Open\n  }\n  palette {\n    ...Palette\n  }\n  text {\n    ...ContentText\n  }\n}\n\nfragment ImageTypes on ImageTypes {\n  background {\n    ...ImageWithAttributes\n  }\n  logo {\n    ...ImageWithAttributes\n  }\n  thumb {\n    ...ImageWithAttributes\n  }\n}\n\nfragment ImageWithAttributes on ImageWithAttributes {\n  width\n  height\n  src\n  orientation\n  rotation\n}\n\nfragment Open on Open {\n  date {\n    from\n    to\n  }\n  time {\n    from\n    to\n  }\n  timeZone\n}\n\nfragment ContentText on ContentText {\n  eyebrow\n  eyebrowColor\n  subtitle\n  subtitleColor\n  title\n  titleColor\n}\n\nfragment CartActionContent on CartAction {\n  productsToAdd {\n    count\n    product {\n      productId\n      currency\n      price\n      offer\n      availability {\n        availableNow\n        willOpenOn\n        willCloseOn\n      }\n      quantity\n    }\n  }\n  productIdsToRemove\n}\n\nfragment TileProduct on ContentProduct {\n  id\n  destination\n  quantity\n  entityId\n  adTrackingId\n  refAdTrackingId\n  tileImage {\n    ...UrlType\n  }\n  productTileInfo {\n    __typename\n    ... on ProductCallout {\n      ...ProductCallout\n    }\n    ... on PriceCallout {\n      ...PriceCallout\n    }\n  }\n  productTileBadgeInfo {\n    title\n    color\n    titleColor\n    borderColor\n    type\n    url\n  }\n  activePriceChannelDisplay\n  availability {\n    availableNow\n    willOpenOn\n  }\n  isBase\n  isSingle\n  isBundle\n  isGiftcard\n  isBoosted\n  isNationalBrandAdjacent\n  isPinned\n  modificationNames\n}\n\nfragment UrlType on UrlType {\n  url\n  backgroundColors\n  display\n}\n\nfragment ProductCallout on ProductCallout {\n  text\n  backgroundColor\n  type\n  isFam\n  color\n}\n\nfragment PriceCallout on PriceCallout {\n  price\n  offer\n  backgroundColor\n  type\n  isFam\n  color\n}\n\nfragment ContentEventAction on ContentEventAction {\n  trigger\n  actionType\n  data {\n    ...ContentEventActionData\n  }\n}\n\nfragment ContentEventActionData on ContentEventActionData {\n  event\n  name\n  treatment\n}\n\nfragment ContentQuickFilter on ContentQuickFilter {\n  totalResults\n  filters {\n    ...Filters\n  }\n}\n\nfragment Filters on SearchFilterCategory {\n  key\n  label\n  type\n  multiSelect\n  displayType\n  sections {\n    ...Sections\n  }\n}\n\nfragment Sections on SearchFilterSection {\n  key\n  label\n  choices {\n    ...Choices\n  }\n}\n\nfragment Choices on SearchFilterChoice {\n  key\n  label\n  state\n}\n\nfragment Link on Link {\n  destination\n  refAdTrackingId\n  entityId\n  palette {\n    ...Palette\n  }\n  style {\n    ...ContentStyle\n  }\n  image {\n    ...ImageWithAttributes\n    srcSet {\n      ...SrcSet\n    }\n  }\n  srcSet {\n    ...SrcSet\n  }\n  linkText\n  open {\n    ...Open\n  }\n  availability {\n    availableNow\n    willOpenOn\n    willCloseOn\n  }\n  text {\n    ...ContentText\n  }\n  count\n  badges {\n    title\n    color\n    titleColor\n    borderColor\n    type\n    url\n  }\n  linkId: id\n  destination\n  buttonTitle\n}\n\nfragment ContentStyle on ContentStyle {\n  imageAlignment\n}\n\nfragment SrcSet on SrcSet {\n  small {\n    src\n  }\n  medium {\n    src\n  }\n  mediumV2 {\n    src\n  }\n  large {\n    src\n  }\n}\n\nfragment EmptyObjectContent on EmptyObject {\n  name\n}\n\nfragment CTACollectionContent on CTA {\n  action {\n    __typename\n    ... on CartAction {\n      ...CartActionContent\n    }\n    ... on ClickThroughAction {\n      destinationUrl\n    }\n    ... on ShowDisclaimerAction {\n      disclaimer\n    }\n  }\n  adTrackingId\n  refAdTrackingId\n  entityId\n  image {\n    ...ImageWithAttributes\n    srcSet {\n      ...SrcSet\n    }\n  }\n  destination\n  linkText\n  open {\n    ...Open\n  }\n  openByDefault\n  palette {\n    ...Palette\n  }\n  takeoverDestination\n  takeoverImage {\n    ...ImageWithAttributes\n  }\n  takeoverPalette {\n    ...Palette\n  }\n  takeoverText {\n    ...ContentText\n  }\n  text {\n    ...ContentText\n  }\n  variation\n}\n\nfragment SeoContentTextContent on SeoContentText {\n  title\n  description\n}\n\nfragment SeoContentLinkContent on SeoContentLink {\n  text\n  link\n}\n\nfragment LinkOrProduct on LinkOrProduct {\n  __typename\n  ... on ContentProduct {\n    ...TileProduct\n  }\n  ... on Link {\n    ...Link\n  }\n}\n\nfragment PdpProduct on ContentProduct {\n  ...ContentProduct\n  description\n  productDetailImages: images {\n    ...UrlType\n  }\n  segmentation\n  abv\n  ounces\n  pricePerUnit\n  thirdPartyRatings {\n    ...ThirdPartyRating\n  }\n  warnings {\n    ...ProductWarnings\n  }\n  productDetails {\n    ...ProductDetail\n  }\n  ibu {\n    ...Ibu\n  }\n  tastingDetails {\n    ...AlcoholTasting\n  }\n  originationDetails {\n    ...ProductOrigination\n  }\n  nutritionalDetails {\n    ...ProductNutritional\n  }\n  miniBarPills {\n    ...MiniBarPill\n  }\n  modifications {\n    ...ProductModification\n  }\n  sizes {\n    ...SizedProduct\n  }\n}\n\nfragment ContentProduct on ContentProduct {\n  adTrackingId\n  entityId\n  id\n  categoryName\n  categoryId\n  subCategoryId\n  surfaceId\n  price\n  title\n  refAdTrackingId\n  badges {\n    title\n    color\n    titleColor\n    borderColor\n    type\n    url\n  }\n  availability {\n    availableNow\n    willOpenOn\n    willCloseOn\n  }\n  availableForBonus\n  brand\n  brandDestination\n  destination\n  currency\n  offer\n  salePrice\n  size\n  sizeWithPack\n  unitSize {\n    ...ProductUnitSize\n  }\n  quantity\n  isTobacco\n  isAlcohol\n  isSofMovExempt\n  isZoned\n  isConfirmed\n  isGiftcard\n  isSnapEligible\n  isBase\n  isSingle\n  isBundle\n  isBoosted\n  isPinned\n  isNationalBrandAdjacent\n  modificationNames\n  tileImages: images {\n    ...UrlType\n  }\n  internalItemHierarchy {\n    ...ProductInternalItemHierarchy\n  }\n  giftCards {\n    receiverEmail\n    receiverName\n    senderName\n    senderMessage\n  }\n  callouts {\n    __typename\n    ...ProductCallout\n  }\n  activePriceChannel\n  activePriceChannelDisplay\n  activePriceId\n  priceChannelDetailsDisplay\n  priceChannelDetails {\n    channelName\n    price\n    offer\n    priceId\n  }\n  productTileInfo {\n    __typename\n    ... on ProductCallout {\n      ...ProductCallout\n    }\n    ... on PriceCallout {\n      ...PriceCallout\n    }\n  }\n  productTileBadgeInfo {\n    title\n    color\n    titleColor\n    borderColor\n    type\n    url\n  }\n  ageVerification {\n    ...AgeVerification\n  }\n}\n\nfragment ProductUnitSize on ProductUnitSize {\n  value\n  measurement\n}\n\nfragment ProductInternalItemHierarchy on ProductInternalItemHierarchy {\n  department {\n    ...InternalItemHierarchyID\n  }\n  class {\n    ...InternalItemHierarchyID\n  }\n  subclass {\n    ...InternalItemHierarchyID\n  }\n  product_type {\n    ...InternalItemHierarchyID\n  }\n}\n\nfragment InternalItemHierarchyID on InternalItemHierarchyID {\n  id\n}\n\nfragment AgeVerification on AgeVerification {\n  idVerification {\n    age\n    reason\n  }\n  signatureVerification {\n    age\n    reason\n  }\n}\n\nfragment ThirdPartyRating on ThirdPartyRating {\n  rating\n  review\n  source\n  year\n}\n\nfragment ProductWarnings on ProductWarnings {\n  prop65 {\n    ...Warning\n  }\n}\n\nfragment Warning on Warning {\n  type\n  contains\n}\n\nfragment ProductDetail on ProductDetail {\n  label\n  value\n}\n\nfragment Ibu on Ibu {\n  max\n  min\n  value\n}\n\nfragment AlcoholTasting on AlcoholTasting {\n  label\n  value\n  options\n}\n\nfragment ProductOrigination on ProductOrigination {\n  countryCode\n  labels {\n    ...ProductOriginationLabelEntry\n  }\n}\n\nfragment ProductOriginationLabelEntry on ProductOriginationLabelEntry {\n  label\n  value\n}\n\nfragment ProductNutritional on ProductNutritional {\n  diets\n  nutritionalWarning\n  ingredients\n  ingredientsSymbols\n}\n\nfragment MiniBarPill on MiniBarPill {\n  countryCode\n  heading\n  icon\n  subHeading\n  pillType\n  route\n}\n\nfragment ProductModification on ProductModification {\n  categoryName\n  children {\n    ...ModificationChild\n  }\n}\n\nfragment ModificationChild on ModificationChild {\n  id\n  name\n  subcategoryTitle\n  subcategoryName\n  ingredients {\n    ...ModificationIngredient\n  }\n}\n\nfragment ModificationIngredient on ModificationIngredient {\n  id\n  name\n  type\n  localAvailability\n  availabilityStatus\n  ingredientType\n  previouslySelected\n  previouslySelectedQuantity\n  offer\n  price\n  maxQuantityLimit\n  activePriceChannel\n  activePriceId\n  activePriceChannelDisplay\n  priceChannelDetails {\n    channelName\n    offer\n    price\n    priceId\n  }\n  priceChannelDetailsDisplay\n  variants {\n    ...IngredientVariant\n  }\n}\n\nfragment IngredientVariant on IngredientVariant {\n  id\n  name\n  sizeCode\n}\n\nfragment SizedProduct on SizedProduct {\n  id\n  name\n  price\n  offer\n  unitSizeDetails {\n    value\n    measurement\n  }\n  default\n  nutritionalHighlight\n  nutritionalImage {\n    ...UrlType\n  }\n  description\n  activePriceChannel\n  activePriceId\n  activePriceChannelDisplay\n  priceChannelDetails {\n    channelName\n    offer\n    price\n    priceId\n  }\n  priceChannelDetailsDisplay\n  recipe {\n    ...Recipe\n  }\n}\n\nfragment Recipe on Recipe {\n  name\n  modificationId\n  quantity\n  ingredientId\n}\n"
  try {
    const response = await fetch(getUrl(userToken), {
      method: 'POST',
      headers: getHeaders(userToken),
      body: JSON.stringify({
        query: query,
        'operationName': 'Content',
        'variables': {
          "addressId": 116025801,
          "apiVersion": "v2",
          "contentParams": "554",
          "fulfillmentType": "fulfillment_delivery",
          "route": route
        }
      })
    })

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return {"error": error};
  }
}

function getUrl (userToken) {
  if (userToken?.includes('.')) {
    return GQL_DEV_URL
  }
  return GQL_PROD_URL
}


const exports = {
  getCart,
  addToCart,
  getAddress,
  getContent
};

export default exports;
