# Setup
```
cd app && yarn
chmod +x deploy.sh
```

# Run locally
### 1 Start DB in docker
```
docker-compose up
```
![Start DB in docker](./gif/docker.gif)
### 2 Start application and check location endpoint
```
cd app && yarn start:dev
```

### 3 Check GraphQL
### 3.1 Create User
![create](./gif/create.gif)

### 3.2 Update User
![update](./gif/update.gif)

### 3.3 Delete User
![delete](./gif/delete.gif)

### 3.4 Get User by id
![get](./gif/get.gif)

### 3.5 Get list
![get list](./gif/get_list.gif)

## 4 Deploy to lambda with terraform
```
./deploy.sh
```

### 4.1 run location endpoint on Lambda
![lambda location](./gif/lambda-location.gif)

### 4.2 run location endpoint on Lambda
![lambda graphql](./gif/lambda-graphql.gif)

