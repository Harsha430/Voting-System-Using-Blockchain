-- Create Enum Type for Role
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'VOTER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create User Table
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL PRIMARY KEY,
    "uniqueID" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VOTER',
    "hasVoted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Candidate Table
CREATE TABLE IF NOT EXISTS "Candidate" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Block Table
CREATE TABLE IF NOT EXISTS "Block" (
    "id" SERIAL PRIMARY KEY,
    "index" INTEGER NOT NULL UNIQUE,
    "timestamp" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "previousHash" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "nonce" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Election Table
CREATE TABLE IF NOT EXISTS "Election" (
    "id" SERIAL PRIMARY KEY,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "endTime" TIMESTAMP(3)
);
