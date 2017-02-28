# An Online Marketplace (Late submission)

# Team Members

Justin Sabourin
Gordon Chan

# Description

We're going to be creating a web application for an online marketplace where users can shop for products and sellers can sell items. The users interaction with the application will revolve around listings (described below). Users can create, search for and comment on listings, as well as receive notifications about these events.

## Users

Users will be able to sign up, sign in and sign out of the application. A user will have the following information:
- Username
- Email Address
- Password
- Location

## Creating Listings

A listing consists of:
 - An item name
 - A description of the item
 - The proposed price of the item
 - The category this item belongs to (The seller will be able to select from a pre determined list of categories)
 - Photos of the item
 - Listing state (one of 'Selling', 'Sold' or 'Closed')
 - A seller account

A listing will also have comments from other users that can be viewed publicly.
Once a seller has found a buyer, they can mark the listing as 'Sold'.
If the seller doesn't want to sell the item anymore they can mark it as 'Closed'.

## Viewing Listings

When viewing a listing, a user can choose to contact the seller directly by starting a chat conversation. In the chat conversation, users can send messages to negotiate a price, and if agreed upon, arrange for the sale to take place.

Also, users will have the option to 'watch' a listing. Meaning they will receive notifications (described further down) whenever something about the listing changes.

## Searching for listings

When searching for listings, users will have two options:
- Search by keyword
- Search by category

When searching by keyword, the search text will be run through the search API and listings that most closely match the search term will be displayed.

When searching by category, the user can select a category from a pre determined list of categories and the listings that are in that category will be displayed. 

When searching by keyword or category, they can chose to sort the listings by price, most recent or most popular. By default the user will be searching for listings in the 'Selling' state, but can choose to widen their search for listings that are 'Closed' or 'Sold'.


## Real-time notification system

All users will receive a real-time notification when the following occurs:
- They've received a chat message
- A comment they have made on a listing has been replied to

Sellers will receive additional real-time notifications when:
- A comment has been made on their listing
- Another user has started 'watching' their listing

Users 'watching' a listing will receive real-time notifications when:
- The listing has been modified in any way (e.g. description change, price change, new photos)
- A new comment has been made on the listing

## Permissions

Users who are not signed in can:
- Search for listings
- View a listing, but only:
  - The item name
  - The item description
  - The price of the item
  - The listing state
  - The category of the item
- Can NOT comment on a listing
- Can NOT start a chat
- Can NOT 'watch' a listing

Authenticated users can:
- Search for listings
- Create listings

When viewing listings, authenticated users will have different permissions depending on if they are the seller (created the listing) or potential buyer (viewing a listing another user has created).

When viewing their own listing, sellers can:
- Edit any part of the listing (except the seller account)
- Create a comment on the listing
- Reply to a comment on the listing

When viewing another users listing, potential buyers can:
- Comment on the listing
- Create a chat conversation with the seller
- Start 'watching' the listing

## Application Navigation and Presentation

The following specification is a guideline and is subject to change throughout development.

As a user navigates through the application, the navigation bar will always be on the top of the page, it will include:
- A navigation bar with links to the 'Settings' page, 'Chat' page, 'Listings' page and 'Home' page.
- If there are any notifications related to the user's listings or listings that the user is watching, the 'Listings' link in the navigation bar will have a badge with the number of notifications.
- If there are any unread chat messages, the 'Chat' link in the navigation bar will have a badge with the number of new messages.
- A search bar with a search button

When a user opens the site they will be brought to the home page. The home page will have:
- A list of the most popular products on the site.
- An option to view categories, if a category is selected, then the application will go to 'Search Results' page.

When a user starts typing into the search bar:
- A list of suggestions will appear for products or categories
- If a user clicks on a suggestion or clicks the search button, then they are directed to the 'Search Results' page.

After user clicks on a category or uses the search bar, a search results page will show containing:
- A list of listings that match the search
- The ability to click on a listing to be taken to the listing.
- A sort by option
- A filter option for listing state ('Closed', 'Sold', 'Selling')

When a user clicks on a listing, they are taken to the listing page which contains:
- Listing information
- Comment section, which contains comments and the ability to post and reply to comments
- An option to start a chat with the seller, which will take them to the chats page and automatically start a chat with the seller
- An option to edit the listing information [For the owners of the listing]
- An option to 'watch'/'unwatch' the listing [For potential buyers]

Clicking on the 'Chat' link in the navigation bar will take the user to the chats page containing:
- A chat window where users can send messages and view messages in the chat
- The list of chats for this user, where chats with new messages are distinguishable from the others

Clicking on the 'Listings' link in the navigation bar will take the user to the listing page which contains:
- Tabs for 'Watched Listings' and 'My Listings'
- Each tab will contain a list of listings
- Each listing will have the name of the listing, and if any, the unread notifications for that listing.
- Clicking on a listing will navigate the user to that listings page.
- 

Clicking on the 'Settings' link in the navigation bar will take the user to the settings page containing:
- An option to change username, email address, password, location


When ever a notification comes in while the user is viewing the application, a notification message should display for a couple seconds on the screen containing information about the notification.

# Key feautures for beta version

For the beta version, we have hope to have to the following completed:
- The ability to sign up for the application, login and logout
- The ability to view the most popular listings on the home page
- The ability to do a simple search for listings by keyword or category (no auto suggestions)
- The ability to create listings
- The ability to view listings
- The ability to create comments for listings
- The ability to change user settings
- The ability to view the own users listings (no notifications)

# Key features for final version

For the beta version, we have hope to have to the following completed:
- The ability to 'watch' listings and view watched listings
- The ability to start a chat and view chats
- The ability to receive real-time notifications 
- The ability to do complex searches with auto suggestion


# Technology we will use

## Frontend

In the front end we will use Angular 2. We will use the socket-io client to support the real-time notification system.

## Backend

In the backend we will use Nodejs with the Express Framework, as well as MongoDB for our database.

We will use MongoDB's built in Full Text Search to support the search capabilities.

To support the notification system in the backend we will use socket-io. Socket-io will allow us to send messages in real time to the client and provide a mechanism to manage all the different notifications for different users.

# Description of technical challenges

The notification system is very complex as it presents three different challenges:
- How to manage different notifications among many users
- Being able to store unread notifications and knowing when to send them out
- Being able to appropriately handle and react to notifications being received in the front end

The search mechanism with suggestions will also pose a challenge since MongoDB's built in Full Text Search only provides a mechanism to search text based on weights. We will also have to figure out how to store search terms and weight them properly, as well as provide the ability for auto suggestions in the search box.



