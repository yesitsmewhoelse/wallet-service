## Wallet Service 🚀
Updates wallet balance when a selected service is bought.

### Installation
Not required. Exposed API endpoint

### Post  
#### `http://wallet-service-api-wallet.apps.us-east-1.starter.openshift-online.com/api/buy/`

This method takes discount percentage and original service cost in request body and JWT in request header. Depending on the input, the user is authenticated using JWT and the wallet balance is updated using the parameters in request bodyt(only if the conditions are met or else suitable error will be sent).

**Req.body**|**type**|**description**
-----|-----|-----
discount|String|Intended discount for the service.
service|String| Service fee.

**Req.headers**|**type**|**description**
-----|-----|-----
token|String|JWT token for user authentication.

## For validation using Postman : 

## Sample request body           

```
 {
	"discount": "",
	"service": ""
 }
 ```

## Sample request header           

```
 {
	"token": ""
 }
 ```

### Sample Curl request

```
curl --location --request POST 'http://wallet-service-api-wallet.apps.us-east-1.starter.openshift-online.com/api/buy' \
--header 'token: ' \
--data-raw '{
"discount": "",
"service": ""
}'
```
**returns**|**description**
-----|-----
*|Request status according to internal conditions.