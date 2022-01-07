rm ./terraform/app.zip
cd app
yarn install
yarn build
cp -R ./node_modules ./dist/node_modules
rm -rf ./dist/node_modules/.bin
rm -rf ./dist/node_modules/@types
rm -rf ./dist/node_modules/aws-sdk
cp ./src/user.gql ./dist/user.gql
cp ./src/user/user.schema.gql ./dist/user/user.schema.gql
cp ./src/user/user.schema.gql ./dist/user.schema.gql
cd ../terraform
terraform apply -auto-approve
