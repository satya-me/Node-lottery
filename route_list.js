// # USER APIs ---------------------------------------------------------------------------------------------------

/* signup

curl --request POST \
  --url http://localhost:3303/api/auth/signup \
  --header 'Content-Type: application/json' \
  --data '{
    "first_name": "Saiyaka",
    "last_name": "Barik",
    "email": "saiyaka@gmail.com",
    "phone": 9658730363,
    "dob": "20-20-2000",
    "country": "India",
    "city": "Kolkata",
    "password": "test"
}'

*/

/* login

curl --request POST \
  --url http://localhost:3303/api/auth/login \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "satya@gmail.com",
    "password": "test"
}'

*/

// # Admin APIs ---------------------------------------------------------------------------------------------------

/* signup

curl --request POST \
  --url http://localhost:3303/api/admin/auth/signup \
  --header 'Content-Type: application/json' \
  --data '{
    "first_name": "Saiyaka",
    "last_name": "Barik",
    "email": "saiyaka@gmail.com",
    "phone": 9658730363,
    "dob": "20-20-2000",
    "country": "India",
    "city": "Kolkata",
    "password": "test"
}'

*/

/* login
curl --request POST \
  --url http://localhost:3303/api/admin/auth/login \
  --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2I1N2U4NzE2ZWE3NTJlNTE1OGFkMDgiLCJpYXQiOjE2NzI4NDE4MTMsImV4cCI6MTY3Mjg0OTAxM30.I3kDA2t6r2Op-fZaiN63qgjUfT6uxPMAnVmILN8jT90' \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "saiyaka@gmail.com",
    "password": "test"
}'

*/

// # Global APIs ---------------------------------------------------------------------------------------------------

/* config
curl --request GET \
  --url http://localhost:3303/api/setting/config

*/

/* get-tickets
curl --request GET \
  --url http://localhost:3303/api/ticket/get-tickets

*/
