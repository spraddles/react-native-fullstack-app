openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:4096 && openssl rsa -in private.pem -pubout -out public.pem

cat public.pem | base64 > public_key_base64.txt

cat private.pem | base64 > private_key_base64.txt