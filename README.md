_This project has been created as part of the 42 curriculum by txavier._

# Claris

## Description

Claris is a full-stack community and church management platform created for the 42 curriculum.
It combines a public-facing site with a private dashboard so organizations can manage users, memberships, events, chat, and authentication in one place.

The project focuses on a production-style architecture with a modern frontend, a modular backend, a relational database, secure authentication, and real-time communication.
Its main features include:

- Multi-tenant organization and membership management.
- Email/password authentication and Google OAuth 2.0 login.
- Two-factor authentication using temporary email codes.
- Real-time chat and activity updates.
- Event creation, editing, and media uploads.
- Multilingual support, accessibility improvements, and PWA support.
- Dark/light theme support and reusable design-system components.
- A Swagger-documented public API protected by an API key.


## Instructions

### Prerequisites

- Docker 24+ and Docker Compose v2.
- Node.js 22+ if you want to run the apps without Docker.
- A root `.env` file based on `.env.example`.
- Valid credentials for the external services used by the project when you want the full authentication and media flow:
  - Google OAuth client ID and secret.
  - Resend API key and sender email.
  - Cloudinary account credentials.

### Recommended setup with Docker

1. Copy the example environment file to the repository root.

   ```bash
   cp .env.example .env
   ```

2. Review the values in `.env` and adjust them if you are deploying outside the local development environment.
3. Start the full stack.

   ```bash
   make up
   # or
   docker compose up -d --build
   ```

4. Open the frontend in your browser:
   - `http://localhost:3000`
5. Access the backend API:
   - `http://localhost:3001/api/v1`
6. Open the public Swagger documentation:
   - `http://localhost:3001/public/docs`
7. Open Prisma Studio if you need to inspect the database:

   ```bash
   make studio
   ```

8. Stop the stack when you are done:

   ```bash
   make down
   ```

## Database Schema

The database stores User, Church, Organization, Membership,Friendship, Event, EventInterest, Message and EmailLoginCode. A typical structure is:

```text
// User: It represents system users, storing authentication information, personal data, and activity details. It is linked to Membership to represent the organizations the user belongs to; to Message as the sender and recipient of messages; to Friendship to represent friendships and the user who created them; to EventInterest to record events the user has shown interest in; and to EmailLoginCode to manage temporary authentication codes sent via email. 
model User {
  id                 String           @id @default(cuid())
  email              String           @unique
  passwordHash       String?
  displayName        String
  gender             String?
  birthDate          DateTime?
  avatarUrl          String?
  googleId           String?          @unique
  lastSeen           DateTime?
  createdAt          DateTime         @default(now())
  memberships        Membership[]
  sentMessages       Message[]        @relation("SentMessages")
  receivedMessages   Message[]        @relation("ReceivedMessages")
  friendshipsA       Friendship[]     @relation("FriendshipUserA")
  friendshipsB       Friendship[]     @relation("FriendshipUserB")
  createdFriendships Friendship[]     @relation("FriendshipCreator")
  eventInterests     EventInterest[]
  emailLoginCodes    EmailLoginCode[]
}


// Church: It represents a church registered in the system. It is related to Organization, allowing a church to have one or more organizations.
model Church {
  id            String         @id @default(cuid())
  name          String
  createdAt     DateTime       @default(now())
  organizations Organization[]
}

// Organization: It represents an organization (church) within the system, storing information such as name, identifier, address, description, and logo. It is related to Church (the entity to which it belongs), Membership (for managing its members), Event (for organized events), Message (for messages exchanged within its context), and Friendship (for friendships existing among its members).
model Organization {
  id          String       @id @default(cuid())
  churchId    String
  name        String
  slug        String       @unique
  address     String?
  description String?
  logoUrl     String?
  createdAt   DateTime     @default(now())
  memberships Membership[]
  events      Event[]
  messages    Message[]
  friendships Friendship[]
  church      Church       @relation(fields: [churchId], references: [id])
}

// Membership: It represents the association of a user with an organization, indicating their role and the date of joining. It is related to User, which represents the member, and to Organization, to which that member belongs.
model Membership {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           Role         @default(MEMBER)
  joinedAt       DateTime     @default(now())
  user           User         @relation(fields: [userId], references: [id])
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@unique([userId, organizationId])
}

// Role: enumeration of the different roles a member can have within an organization, such as ADMIN and MEMBER.
enum Role {
  ADMIN
  MEMBER
}

// Friendship: It represents a friendship between two users within an organization. It is linked to the Organization where the friendship exists, and to the User, identifying the two participants in the friendship and the user responsible for creating it.
model Friendship {
  id             String       @id @default(cuid())
  organizationId String
  userAId        String
  userBId        String
  createdById    String
  createdAt      DateTime     @default(now())
  organization   Organization @relation(fields: [organizationId], references: [id])
  userA          User         @relation("FriendshipUserA", fields: [userAId], references: [id])
  userB          User         @relation("FriendshipUserB", fields: [userBId], references: [id])
  createdBy      User         @relation("FriendshipCreator", fields: [createdById], references: [id])

  @@unique([organizationId, userAId, userBId])
  @@index([organizationId, userAId])
  @@index([organizationId, userBId])
  @@index([createdById])
}

// Event: It represents an event organized by an organization, containing information such as title, description, date, location, and a photograph. It is linked to the Organization responsible for organizing the event and to EventInterest, which records users interested in participating.
model Event {
  id             String          @id @default(cuid())
  organizationId String
  title          String
  description    String?
  date           DateTime
  location       String?
  photoUrl       String?
  createdAt      DateTime        @default(now())
  organization   Organization    @relation(fields: [organizationId], references: [id])
  interests      EventInterest[]
}

// EventInterest: It represents a user's interest in participating in an event. It is related to the User, who expresses the interest, and to the Event, where that interest is recorded.
model EventInterest {
  id        String   @id @default(cuid())
  eventId   String
  userId    String
  createdAt DateTime @default(now())
  event     Event    @relation(fields: [eventId], references: [id])
  user      User     @relation(fields: [userId], references: [id])

  @@unique([eventId, userId])
  @@index([userId])
}

// Message: It represents a message sent within an organization, storing its content as well as the dates it was sent and read. It is related to a User—acting as the sender and, optionally, as the recipient—and to an Organization, where the message was sent.
model Message {
  id             String       @id @default(cuid())
  senderId       String
  recipientId    String?
  organizationId String
  content        String
  readAt         DateTime?
  createdAt      DateTime     @default(now())
  sender         User         @relation("SentMessages", fields: [senderId], references: [id])
  recipient      User?        @relation("ReceivedMessages", fields: [recipientId], references: [id])
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@index([organizationId, senderId, recipientId, createdAt])
  @@index([organizationId, recipientId, senderId, createdAt])
}

// EmailLoginCode: Represents a temporary authentication code sent to a user via email. It is associated with the User to whom the code belongs and for whom it was generated.
model EmailLoginCode {
  id        String    @id @default(cuid())
  userId    String
  codeHash  String
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime  @default(now())
  user      User      @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

## Resources

Classic references used for the project topic:

- 42 ft_transcendence subject.
- Docker documentation: https://docs.docker.com/
- Docker Compose documentation: https://docs.docker.com/compose/
- MDN Web Docs: https://developer.mozilla.org/
- PostgreSQL documentation: https://www.postgresql.org/docs/

AI usage:

- AI was used to help structure this README according to the requested 42 curriculum requirements.
- AI was used to improve wording, organize sections, and ensure that required topics such as team information, project management, technical stack, modules, database schema, and individual contributions were covered.
- AI was not used as a replacement for understanding or validating the project implementation.
- Any AI-generated documentation must be reviewed and adjusted to match the final code, selected modules, and team member responsibilities.

## License and Credits

This project was developed for educational purposes as part of the 42 curriculum.
