#!/bin/bash

# Arrays of first names and last names
FIRST_NAMES=("John" "Jane" "Alice" "Bob" "Charlie" "Eve" "Mallory" "Oscar" "Trudy" "Walter")
LAST_NAMES=("Doe" "Smith" "Johnson" "Brown" "Davis" "Miller" "Wilson" "Taylor" "Clark" "Lewis")

PRODUCT_IDS=("P0001" "P0002" "P0003" "P0004" "P0005" "P0006" "P0007" "P0008" "P0009" "P0010" "P0011" "P0012" "P0013" "P0014" "P0015" "P0016" "P0017" "P0018" "P0019" "P0020")
QTY=(1 22 3 4 53 6 47 81 98 10 11 12 15 20 25 30 40 60 80 100)
AMOUNT=(5 15 100 200 345 500 700 23 34 5000 208 400 700 366 322 1000 788 966 30 20)


# Function to generate random names and emails
generate_random_name() {
  FIRST_NAME=${FIRST_NAMES[$RANDOM % ${#FIRST_NAMES[@]}]}
  LAST_NAME=${LAST_NAMES[$RANDOM % ${#LAST_NAMES[@]}]}
  EMAIL="${FIRST_NAME}.${LAST_NAME}$((RANDOM % 1000))@parseable.com"
}

# Function to generate a random date
generate_random_date() {
  # Generate a random number within the range of seconds between START_DATE and END_DATE
  START_DATE=$(date -d "2020-01-01" +%s) # Start date in seconds
  END_DATE=$(date -d "2024-12-31" +%s)   # End date in seconds

  # Use $RANDOM multiple times to generate a larger random number
  RANDOM_SECONDS=$(( (RANDOM << 15) | RANDOM ))

  # Ensure that the random seconds fall within the range of dates

  "

  echo "Inserted new random customer into the customers table."

  # Pick a random customer and update their email
  generate_random_name
  RANDOM_EMAIL_UPDATE=$EMAIL

  mysql -u root -e "
  UPDATE cdcdemo.customers
  SET email = '$RANDOM_EMAIL_UPDATE',
  status='UPDATE'
  ORDER BY RAND()
  LIMIT 1;
  "

  echo "Updated a random customer's email."


# Generate a random order date
  generate_random_date
  RANDOM_ORDER_DATE=$RANDOM_DATE

  # Pick a random customer ID from the customers table
  RANDOM_PURCHASER_ID=$(mysql -u root -N -e "SELECT id FROM cdcdemo.customers ORDER BY RAND() LIMIT 1;")

  # Insert a new order
  RANDOM_PRODUCT_ID=${PRODUCT_IDS[$RANDOM % ${#PRODUCT_IDS[@]}]}
  RANDOM_QTY=${QTY[$RANDOM % ${#QTY[@]}]}
  RANDOM_AMOUNT=${AMOUNT[$RANDOM % ${#AMOUNT[@]}]}

  mysql -u root -e "
  INSERT INTO cdcdemo.orders (order_date, purchaser_id, product_id, quantity, amount, status, total_amount)
  VALUES ('$RANDOM_ORDER_DATE', '$RANDOM_PURCHASER_ID', '$RANDOM_PRODUCT_ID', $RANDOM_QTY, $RANDOM_AMOUNT, 'INSERT', $RANDOM_QTY * $RANDOM_AMOUNT);
  "

  echo "Inserted new order into the orders table."

  RANDOM_AMOUNT_UPDATE=${AMOUNT[$RANDOM % ${#AMOUNT[@]}]}
  RANDOM_QTY_UPDATE=${QTY[$RANDOM % ${#QTY[@]}]}
  mysql -u root -e "
  UPDATE cdcdemo.orders
  SET amount = $RANDOM_AMOUNT_UPDATE,
  quantity = $RANDOM_QTY_UPDATE,
  total_amount = $RANDOM_AMOUNT_UPDATE * $RANDOM_QTY_UPDATE,
  status='UPDATE'
  ORDER BY RAND()
  LIMIT 1;
  "

  echo "Updated a random order's quantity, amount and total amount"

done