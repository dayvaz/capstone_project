# GoodReads miniature application

This project is a miniature version of GoodReads social network in which users share their book reviews.

To implement this project, TODO application is used as a base application. The project uses AWS Lambda and Serverless framework to list, add, update, delete reviews

# Functionality of the application

This application will allow creating/removing/updating/fetching REVIEW items. Each REVIEW item can optionally have an attachment image. Each user only has access to REVIEW items that he/she has created.

The frontend also supports filtering items which are liked by the user (Favorite icon on the menubar can be used to list only liked items)

The search field on the menu bar filters book reviews based on book name. 

# REVIEW items

The application should store REVIEW items, and each REVIEW item contains the following fields:

* `reviewId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `bookName` (string) - name of the reviewed book
* `reviewText` (string) - User's review about the book
* `like` (boolean) - true if a book was liked by the user, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image (bookcover) attached to a REVIEW item

UserId is also stored to indicate the user who created a REVIEW item.


# Frontend

The `client` folder contains a web application that can use the API developed in the project.

This frontend works with the serverless backend which is already deployed. `client/src/config.ts` file includes required authantication and endpoint url information

```ts
export const apiEndpoint = 'https://2uvlde9otl.execute-api.us-east-2.amazonaws.com/dev'

export const authConfig = {
  domain: 'dev--8u8qrli.us.auth0.com',
  clientId: 'mtKaEv2dYeeCvgxN5KNzBtLtkxjPve8w',
  callbackUrl: 'http://localhost:3000/callback'
}
```

# How to run the application

## Backend

The application is deployed with the following commands: 

apiEndpoint = 'https://2uvlde9otl.execute-api.us-east-2.amazonaws.com/dev'

```
cd backend
npm install
sls deploy -v
```

## Frontend

`client/src/config.ts` file includes required authantication and endpoint url information. Run the following commands to start frontend application:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless REVIEW application.

# Postman collection

A Postman collection that contains sample requests is also added to project. You can find a Postman collection in this project. 
