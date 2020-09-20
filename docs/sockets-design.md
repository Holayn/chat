- keep track of users connected to server
  - a user needs to pass their user id as a query arg when connecting
- sending a chat normally involves adding an item to the chat table by session-id
  - if the receiving user is connected, emit a message on their socket
    - contain message, session-id
  - how to know if a user is connected that has a session with that id?
    - could have "active sessions" i.e. if both users are connected, then the session is active
      - but there could be a lot of active sessions
    - could look up that session-id, and for every user-id excluding the sender's user-id, lookup in connected users and if they're present, then send to their socket

How to keep track of "read" messages
- "read" flag on session
- whenever a new message(s) is added for that session, set flag to false
- when user reads the message(s), set flag to true
- why not set it on the chat message itself?
  - have to go through all chat messages when fetching to determine if there's an unread message
    - easier to track on the session level
  - how to track, in a group chat, what message was read by who?
    - "read" flag on each user's session is the id of the chat message