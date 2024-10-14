#!/bin/bash

# Arrays of first names and last names
FIRST_NAMES=("John" "Jane" "Alice" "Bob" "Charlie" "Eve" "Mallory" "Oscar" "Trudy" "Walter")
LAST_NAMES=("Doe" "Smith" "Johnson" "Brown" "Davis" "Miller" "Wilson" "Taylor" "Clark" "Lewis")

# Function to generate random names and emails
generate_random_name() {
  FIRST_NAME=${FIRST_NAMES[$RANDOM % ${#FIRST_NAMES[@]}]}
  LAST_NAME=${LAST_NAMES[$RANDOM % ${#LAST_NAMES[@]}]}
  EMAIL="${FIRST_NAME}.${LAST_NAME}$((RANDOM % 1000))@parseable.com"
}

export MYSQL_PWD='debezium'

# Run an infinite loop to delete records every minute
while true; do
  # Find a random customer ID from the customers table
  RANDOM_CUSTOMER_ID=$(mysql -u root -N -e "SELECT id FROM cdcdemo.customers ORDER BY RAND() LIMIT 1;")

  # Delete all orders associated with the randomly chosen customer
  mysql -u root -e "
  DELETE FROM cdcdemo.orders
  WHERE purchaser_id = '$RANDOM_CUSTOMER_ID';
  "

  echo "Deleted all orders for customer ID $RANDOM_CUSTOMER_ID from the orders table."

  # Now delete the random customer
  mysql -u root -e "
  DELETE FROM cdcdemo.customers
  WHERE id = '$RANDOM_CUSTOMER_ID';
  "

  echo "Deleted customer ID $RANDOM_CUSTOMER_ID from the customers table."

  # Delete a random order (not related to the customer deletion)
  mysql -u root -e "
  DELETE FROM cdcdemo.orders
  ORDER BY RAND()
  LIMIT 1;
  "

  echo "Deleted a random order from the orders table."

  # Wait for 1 minute before repeating the process
  sleep 60
done